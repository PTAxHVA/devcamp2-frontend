import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface MasterBranch {
  _id: string
  name: string
  description?: string
  /** Fork metadata: branches sharing a selectionGroup with isMutuallyExclusive are a choose-one set. */
  selectionGroup?: string | null
  isMutuallyExclusive?: boolean
  isMandatory?: boolean
  orderIndex?: number
  topicCount: number
  /** Ordered master-topic ids of this branch. */
  topicIds?: string[]
}

export interface MasterRoadmapPreview {
  _id: string
  roleName: string
  description?: string
  branches: MasterBranch[]
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/**
 * Public master-roadmap detail (GET /master-roadmaps/:id) used to preview a
 * roadmap before enrolling — returns the role, description and its branches
 * with topic counts. No JWT required.
 */
export function useMasterRoadmap(id: string | null | undefined, enabled = true) {
  return useQuery<MasterRoadmapPreview>({
    queryKey: ['master-roadmap', id],
    enabled: enabled && !!id,
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<MasterRoadmapPreview>>(`/master-roadmaps/${id}`)
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
