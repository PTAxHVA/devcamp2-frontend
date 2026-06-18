import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export interface SubmitQuizResult {
  quizAttemptId: string
  score: number
  isPassed: boolean
  cooldownUntil?: string | null
}

type SubmitAnswer =
  | { questionId: string; selectedOptionId: string; userInput?: never }
  | { questionId: string; userInput: string; selectedOptionId?: never }

export function useSubmitQuiz(attemptId: string) {
  const qc = useQueryClient()

  return useMutation<SubmitQuizResult, Error, SubmitAnswer[]>({
    mutationFn: async (answers) => {
      const res = await apiClient.post<{ success: boolean; data: SubmitQuizResult }>(
        `/attempts/${attemptId}/submit`,
        { answers },
      )
      return res.data.data
    },
    onSuccess: (result) => {
      if (result.isPassed) {
        qc.invalidateQueries({ queryKey: ['dashboard'] })
        qc.invalidateQueries({ queryKey: ['streak'] })
      }
    },
    onError: () => toast.error('Failed to submit quiz, please try again.'),
  })
}
