import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { BEResource } from '@/features/topic/hooks/use-topic-detail'

export interface BESectionDetail {
  _id: string
  title: string
  contentOverview: string
  orderIndex: number
  resourceList: BEResource[]
  hasQuiz: boolean
  isCompleted: boolean
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export function useSectionDetail(sectionId: string) {
  return useQuery<BESectionDetail>({
    queryKey: ['section-detail', sectionId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<BESectionDetail>>(`/sections/${sectionId}`)
      return res.data.data
    },
    enabled: !!sectionId,
  })
}
