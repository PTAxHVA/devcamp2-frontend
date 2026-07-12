import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface AvailableTopic {
  masterTopicId: string
  name: string
  estimatedHours: number
  sectionTotal: number
  /** MasterTopic ids this topic depends on. Optional until the backend adds it to the
   *  /available-topics payload; the editor's prerequisite remove-guard reads it. */
  prerequisiteTopicIds?: string[]
}

export function useAvailableTopics(roadmapId: string) {
  return useQuery<AvailableTopic[]>({
    queryKey: ['available-topics', roadmapId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AvailableTopic[] }>(
        `/roadmaps/${roadmapId}/available-topics`,
      )
      return res.data.data
    },
    enabled: !!roadmapId,
    staleTime: 30 * 1000,
  })
}
