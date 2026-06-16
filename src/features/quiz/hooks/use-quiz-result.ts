import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useQuizResult(attemptId: string) {
  return useQuery({
    queryKey: ['attempt-result', attemptId],
    queryFn: async () => {
      const res = await apiClient.get(`/attempts/${attemptId}/result`)
      return res.data.data
    },
    enabled: !!attemptId,
  })
}
