import { useState, useEffect } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router'
import { apiClient } from '@/lib/api-client'
import { useQuizStore, type QuizStore } from '@/features/quiz/quiz-store'

interface BEQuestion {
  _id: string
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK'
  content: string
  orderIndex: number
  options?: Array<{ _id: string; questionId: string; content: string; orderIndex: number }>
}

interface AttemptResponse {
  data: {
    quizAttempt: {
      attemptId: string
      quizId: string
      startedAt: string
      submittedAt?: string | null
      cooldownUntil?: string | null
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
  const root = asRecord(payload)
  const error = asRecord(root?.error)

  return readString(error?.code) ?? readString(root?.code)
}

function readAttemptId(value: Record<string, unknown> | null): string | undefined {
  return (
    readString(value?.attemptId) ??
    readString(value?.quizAttemptId) ??
    readString(value?.id) ??
    readString(value?._id)
  )
}

function getConflictAttemptId(payload: unknown): string | undefined {
  const root = asRecord(payload)
  const error = asRecord(root?.error)
  const data = asRecord(root?.data)
  const details = asRecord(error?.details)
  const errorData = asRecord(error?.data)
  const quizAttempt = asRecord(data?.quizAttempt)
  const attempt = asRecord(data?.attempt)

  return (
    readAttemptId(error) ??
    readAttemptId(details) ??
    readAttemptId(errorData) ??
    readAttemptId(data) ??
    readAttemptId(quizAttempt) ??
    readAttemptId(attempt) ??
    readAttemptId(root)
  )
}

export function useQuizAttempt(quizId: string) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const setAttempt = useQuizStore((state: QuizStore) => state.initAttempt)

  useEffect(() => {
    let cancelled = false

    const initAttempt = ({ quizAttempt, questions }: AttemptResponse['data']) => {
      if (quizAttempt.submittedAt || quizAttempt.cooldownUntil) {
        navigate(`/quizzes/${quizAttempt.attemptId}/result/fail`, { replace: true })
        return
      }

      setAttempt(quizAttempt.attemptId, questions.map(mapQuestion))
    }

    const loadAttempt = async (attemptId: string) => {
      const res = await apiClient.get<AttemptResponse>(`/attempts/${attemptId}`)
      if (!cancelled) initAttempt(res.data.data)
    }

    const startAttempt = async () => {
      if (!quizId) {
        setIsLoading(false)
        return
      }

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
          navigate(`/quizzes/${attemptId}/result/fail`, { replace: true })
          return
        }

        setError(err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void startAttempt()

    return () => {
      cancelled = true
    }
  }, [navigate, quizId, setAttempt])

  return { isLoading, error }
}
