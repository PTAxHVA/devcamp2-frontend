import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface BrowseRoadmap {
  _id: string
  roleName: string
  description?: string
  difficulty?: string
  duration?: string
  topicsCount?: number
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export function useBrowseRoadmaps() {
  return useQuery<BrowseRoadmap[]>({
    queryKey: ['browse-roadmaps'],
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<BrowseRoadmap[]>>('/master-roadmaps')
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
