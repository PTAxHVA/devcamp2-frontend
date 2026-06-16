import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useBrowseRoadmaps() {
  return useQuery({
    queryKey: ['master-roadmaps'],
    queryFn: async () => {
      const res = await apiClient.get('/master-roadmaps')
      return res.data.data.items
    },
  })
}
