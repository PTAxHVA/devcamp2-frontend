import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export function useSubmitQuiz(attemptId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (
      answers: Array<{ questionId: string; selectedOptionId?: string; userInput?: string }>,
    ) => {
      const res = await apiClient.post(`/attempts/${attemptId}/submit`, { answers })
      return res.data.data // Unwrap envelope [cite: 57, 224]
    },
    onSuccess: (r) => {
      if (r.isPassed) {
        qc.invalidateQueries({ queryKey: ['dashboard'] })
        qc.invalidateQueries({ queryKey: ['streak'] })
      }
    },
    onError: () => toast.error('Nộp bài thất bại, thử lại nhé'),
  })
}
