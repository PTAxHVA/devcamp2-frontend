import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface MasterRoadmapItem {
  id: string
  roleName: string
  description: string
  topicCount: number
  isEnrolledByUser: boolean
  /** Branch ids for this roadmap — used when enrolling */
  branchIds?: string[]
}

/** GET /master-roadmaps returns a flat array of published roadmaps. */
interface BrowseRoadmapsApiItem {
  _id: string
  roleName: string
  description: string
}

interface BrowseRoadmapsResponse {
  success: boolean
  data: BrowseRoadmapsApiItem[]
}

export function useBrowseRoadmaps() {
  return useQuery<MasterRoadmapItem[]>({
    queryKey: ['master-roadmaps'],
    queryFn: async () => {
      const res = await apiClient.get<BrowseRoadmapsResponse>('/master-roadmaps')
      // BE catalog only returns _id/roleName/description; topicCount + enrollment
      // status aren't provided yet — default them. TODO: enrich the BE endpoint.
      return res.data.data.map((r) => ({
        id: r._id,
        roleName: r.roleName,
        description: r.description,
        topicCount: 0,
        isEnrolledByUser: false,
      }))
    },
  })
}
