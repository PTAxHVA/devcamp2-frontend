import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

/** Option shape in result (includes isCorrect) */
export interface ResultOption {
  _id: string
  questionId: string
  content: string
  orderIndex: number
  isCorrect: boolean
}

/** Question shape in result response */
export interface ResultQuestion {
  _id: string
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK'
  content: string
  orderIndex: number
  options?: ResultOption[]
  userAnswer?: {
    questionId: string
    selectedOptionId?: string
    userInput?: string
  }
}

/** Shape returned by GET /attempts/:id/result */
export interface QuizResultData {
  quizAttempt: {
    attemptId: string
    quizId: string
    startedAt: string
    submittedAt: string
    score: number
    isPassed: boolean
  }
  questions: ResultQuestion[]
}

export function useQuizResult(attemptId: string) {
  return useQuery<QuizResultData>({
    queryKey: ['attempt-result', attemptId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: QuizResultData }>(
        `/attempts/${attemptId}/result`,
      )
      return res.data.data
    },
    enabled: !!attemptId,
  })
}
