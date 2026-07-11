import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { BEGraphTopic, BEGraphEdge } from './use-roadmap-detail'

export interface MasterRoadmapGraph {
  roadmap: { masterRoadmapId: string; roleName: string | null; description?: string | null }
  topics: BEGraphTopic[]
  edges: BEGraphEdge[]
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/**
 * All-branches graph of a master roadmap (GET /master-roadmaps/:id/graph) — every
 * parallel branch's topics + fork edges, with NO user progress. Public (no JWT).
 *
 * Powers the Customize editor's ghost overlay: topics the learner hasn't enrolled
 * (the unchosen fork branches) are drawn as inert "ghost" columns beside the chosen
 * path so the learner can see — and add — the parallel options. Same
 * `{ roadmap, topics, edges }` shape as the roadmap-detail graph.
 */
export function useMasterRoadmapGraph(id: string | null | undefined, enabled = true) {
  return useQuery<MasterRoadmapGraph>({
    queryKey: ['master-roadmap-graph', id],
    enabled: enabled && !!id,
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<MasterRoadmapGraph>>(
        `/master-roadmaps/${id}/graph`,
      )
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
