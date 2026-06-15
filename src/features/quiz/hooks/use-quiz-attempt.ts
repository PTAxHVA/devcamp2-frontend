import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useQuizStore } from '../quiz-store'

export function useQuizAttempt(quizId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const setAttempt = useQuizStore((state) => state.initAttempt)

  useEffect(() => {
    let cancelled = false
    apiClient
      .post(`/quizzes/${quizId}/attempts`)
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
