import { useState, useEffect } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api-client'
import { useQuizStore, type QuizStore } from '@/features/quiz/quiz-store'
import { readRetryAfterMs, cooldownDeadlineFrom } from '@/features/quiz/lib/cooldown-conflict'
import type { QuizResultData } from '@/features/quiz/hooks/use-quiz-result'

interface BEQuestion {
  _id: string
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK'
  content: string
  orderIndex: number
  options?: Array<{ _id: string; questionId: string; content: string; orderIndex: number }>
}

// POST /quizzes/:id/start and GET /attempts/:id both return only an in-progress
// attempt (exactly these 3 fields). Pass/fail + cooldown live on the result/submit
// endpoints, not here.
interface AttemptResponse {
  data: {
    quizAttempt: {
      attemptId: string
      quizId: string
      startedAt: string
    }
    questions: BEQuestion[]
  }
}

function mapQuestion(q: BEQuestion) {
  return {
    id: q._id,
    type: q.type === 'MULTIPLE_CHOICE' ? ('mcq' as const) : ('fill' as const),
    content: q.content,
    options: q.options?.map((o) => ({ id: o._id, content: o.content })),
  }
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const readString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined

function getConflictCode(payload: unknown): string | undefined {
  const error = asRecord(asRecord(payload)?.error)
  return readString(error?.code)
}

// The 409 (QUIZ_ALREADY_STARTED / COOLDOWN_ACTIVE) carries the existing attempt id
// at error.details.attemptId (see backend quiz.service.ts).
function getConflictAttemptId(payload: unknown): string | undefined {
  const details = asRecord(asRecord(asRecord(payload)?.error)?.details)
  return readString(details?.attemptId)
}

export function useQuizAttempt(quizId: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const setAttempt = useQuizStore((state: QuizStore) => state.initAttempt)

  useEffect(() => {
    let cancelled = false
    let inFlight = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let retryCount = 0

    const clearRetry = () => {
      if (retryTimer !== undefined) clearTimeout(retryTimer)
      retryTimer = undefined
    }

    const initAttempt = ({ quizAttempt, questions }: AttemptResponse['data']) => {
      setAttempt(quizAttempt.attemptId, quizAttempt.startedAt, questions.map(mapQuestion))
      retryCount = 0
      setError(null)
      setIsLoading(false)
    }

    const loadAttempt = async (attemptId: string) => {
      const res = await apiClient.get<AttemptResponse>(`/attempts/${attemptId}`)
      if (!cancelled) initAttempt(res.data.data)
    }

    const startAttempt = async () => {
      if (cancelled || inFlight) return

      if (!quizId) {
        setIsLoading(false)
        return
      }

      // Keep initialization pending while offline. The `online` listener below
      // resumes it without turning a temporary disconnect into a fatal state.
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsLoading(true)
        setError(null)
        return
      }

      inFlight = true
      clearRetry()
      setIsLoading(true)
      setError(null)

      try {
        const res = await apiClient.post<AttemptResponse>(`/quizzes/${quizId}/start`)
        if (!cancelled) initAttempt(res.data.data)
      } catch (err) {
        if (cancelled) return

        const status = isAxiosError(err) ? err.response?.status : undefined
        const payload = isAxiosError(err) ? err.response?.data : undefined
        const code = getConflictCode(payload)
        const attemptId = getConflictAttemptId(payload)

        if (status === 409 && code === 'QUIZ_ALREADY_STARTED' && attemptId) {
          try {
            await loadAttempt(attemptId)
          } catch (resumeErr) {
            if (!cancelled) setError(resumeErr)
          }
          return
        }

        if (status === 409 && code === 'COOLDOWN_ACTIVE' && attemptId) {
          // The server says the cooldown hasn't expired (client clock ran a touch
          // ahead, or the retry raced the deadline). Re-arm the fail page's
          // countdown from the server-authoritative remaining duration and say
          // why we bounced — instead of silently ping-ponging with an enabled
          // Retry button against a stale cached deadline (NEW-1).
          const retryAfterMs = readRetryAfterMs(payload)
          if (retryAfterMs !== undefined) {
            const deadline = cooldownDeadlineFrom(retryAfterMs)
            queryClient.setQueryData<QuizResultData>(['attempt-result', attemptId], (old) =>
              old
                ? { ...old, quizAttempt: { ...old.quizAttempt, cooldownUntil: deadline } }
                : undefined,
            )
            // Fixed id: a duplicate conflict (e.g. dev double-mount firing two
            // starts) updates the one toast instead of stacking a second.
            toast(`Hold on — you can retry in ${Math.max(1, Math.ceil(retryAfterMs / 1000))}s.`, {
              id: 'quiz-cooldown-resync',
            })
          } else {
            // Older backend without retryAfterMs — still explain the bounce.
            toast('Hold on — that quiz is still cooling down.', { id: 'quiz-cooldown-resync' })
          }
          navigate(`/quizzes/${attemptId}/result/fail${window.location.search}`, { replace: true })
          return
        }

        // Starting is idempotent at product level: if an ambiguous request did
        // reach the server, the next request resolves through the resume path.
        if (isAxiosError(err) && !err.response && retryCount < 3) {
          retryCount += 1
          retryTimer = setTimeout(() => {
            retryTimer = undefined
            void startAttempt()
          }, retryCount * 1500)
          return
        }

        setError(err)
      } finally {
        inFlight = false
        if (!cancelled && retryTimer === undefined) setIsLoading(false)
      }
    }

    const handleOnline = () => {
      retryCount = 0
      void startAttempt()
    }

    window.addEventListener('online', handleOnline)
    void startAttempt()

    return () => {
      cancelled = true
      clearRetry()
      window.removeEventListener('online', handleOnline)
    }
  }, [navigate, queryClient, quizId, setAttempt])

  return { isLoading, error }
}
