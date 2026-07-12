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
 * In the Customize editor this resolves a ghost branch's topic details when the
 * learner clicks "+ Add" to learn it in parallel (handleAddGhostBranch). The ghost
 * NODES themselves are derived from the roadmap's branch metadata by
 * buildEditorLayout. Same `{ roadmap, topics, edges }` shape as the roadmap-detail graph.
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
