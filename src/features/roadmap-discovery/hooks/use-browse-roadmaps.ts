import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useBrowseStore } from '../browse-store'

interface RoadmapItem {
  id: string
  roleName: string
  description: string
  topicCount: number
  isEnrolledByUser: boolean
}

export function useBrowseRoadmaps() {
  // Pull current filter values from Zustand store
  const filters = useBrowseStore((state) => ({
    role: state.role,
    difficulty: state.difficulty,
    duration: state.duration,
    search: state.search,
  }))

  return useQuery({
    // Include filters in queryKey so React Query refetches when filters change
    queryKey: ['master-roadmaps', filters],
    queryFn: async () => {
      // Pass filters directly as query parameters to the backend
      const res = await apiClient.get('/master-roadmaps', { params: filters })
      return res.data.data.items as RoadmapItem[]
    },
  })
}
