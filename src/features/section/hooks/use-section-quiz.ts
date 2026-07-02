import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface BESectionQuiz {
  quizId: string
  minPassScore: number
  questionCount: number
  lastAttemptId?: string | null
  lastAttemptPassed?: boolean
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export function useSectionQuiz(sectionId: string, enabled: boolean = true) {
  return useQuery<BESectionQuiz>({
    queryKey: ['section-quiz', sectionId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<BESectionQuiz>>(`/sections/${sectionId}/quiz`)
      return res.data.data
    },
    enabled: enabled && !!sectionId,
  })
}
