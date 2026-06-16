import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useQuizStore, type QuizStore } from '@/features/quiz/quiz-store'

interface QuestionPayload {
  id: string
  type: 'mcq' | 'fill'
  content: string
  options?: Array<{ id: string; content: string }>
}

interface AttemptResponse {
  data: {
    attemptId: string
    questions: QuestionPayload[] // Đã thay thế any[] bằng QuestionPayload[]
  }
}

export function useQuizAttempt(quizId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const setAttempt = useQuizStore((state: QuizStore) => state.initAttempt)

  useEffect(() => {
    let cancelled = false
    apiClient
      .post<AttemptResponse>(`/quizzes/${quizId}/attempts`)
      .then((res) => {
        if (!cancelled) {
          const { attemptId, questions } = res.data.data
          setAttempt(attemptId, questions)
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
