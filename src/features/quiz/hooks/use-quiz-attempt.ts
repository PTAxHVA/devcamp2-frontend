import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useQuizStore, type QuizStore } from '@/features/quiz/quiz-store'

/** Raw question shape returned by POST /quizzes/:id/start */
interface BEQuestion {
  _id: string
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK'
  content: string
  orderIndex: number
  options?: Array<{ _id: string; questionId: string; content: string; orderIndex: number }>
}

/** Raw start-attempt response: { quizAttempt: {...}, questions: [...] } */
interface StartAttemptResponse {
  data: {
    quizAttempt: {
      attemptId: string
      quizId: string
      startedAt: string
    }
    questions: BEQuestion[]
  }
}

/** Map BE question → store shape expected by McqQuestion / FillQuestion */
function mapQuestion(q: BEQuestion) {
  return {
    id: q._id,
    type: q.type === 'MULTIPLE_CHOICE' ? ('mcq' as const) : ('fill' as const),
    content: q.content,
    options: q.options?.map((o) => ({ id: o._id, content: o.content })),
  }
}

export function useQuizAttempt(quizId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const setAttempt = useQuizStore((state: QuizStore) => state.initAttempt)

  useEffect(() => {
    let cancelled = false
    apiClient
      .post<StartAttemptResponse>(`/quizzes/${quizId}/start`)
      .then((res) => {
        if (!cancelled) {
          const { quizAttempt, questions } = res.data.data
          setAttempt(quizAttempt.attemptId, questions.map(mapQuestion))
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [quizId, setAttempt])

  return { isLoading, error }
}
