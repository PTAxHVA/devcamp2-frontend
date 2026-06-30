import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { UserRoadmapDetail, RoadmapSummary, LearningTopic, TopicStatus } from '../types'

type RawStatus = 'completed' | 'in_progress' | 'available' | 'locked'

function mapApiTopic(t: {
  masterTopicId: string
  userTopicId: string | null
  name: string
  status: RawStatus
  orderIndex: number
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  prerequisiteTopicIds: string[]
}): LearningTopic {
  return {
    masterTopicId: t.masterTopicId,
    userTopicId: t.userTopicId,
    title: t.name,
    status: t.status,
    orderIndex: t.orderIndex,
    estimatedHours: t.estimatedHours,
    sectionTotal: t.sectionTotal,
    sectionCompleted: t.sectionCompleted,
    prerequisiteTopicIds: t.prerequisiteTopicIds,
  }
}

/** Matches isTopicCompleted in build-flow-graph.ts: section progress is the
 *  source of truth, not the BE status field. */
const isTopicDone = (t: Pick<LearningTopic, 'sectionTotal' | 'sectionCompleted'>): boolean =>
  t.sectionTotal > 0 && t.sectionCompleted >= t.sectionTotal

/** Sequential unlock: topic 1 always available, topic N unlocks only after N-1 is completed.
 *  Uses section progress (same logic as build-flow-graph.ts) so the snake roadmap and the
 *  ReactFlow graph agree on what "completed" means. BE sends 'available' for eligible topics
 *  but also sends 'locked' for the root when no progress exists, so we re-derive here. */
export function deriveSequentialStatuses(topics: LearningTopic[]): LearningTopic[] {
  if (!topics.length) return topics
  const ordered = [...topics].sort((a, b) => a.orderIndex - b.orderIndex)
  const completedIds = new Set(ordered.filter(isTopicDone).map((t) => t.masterTopicId))
  const idSet = new Set(ordered.map((t) => t.masterTopicId))

  const derivedStatus = new Map<string, TopicStatus>()
  for (let i = 0; i < ordered.length; i++) {
    const t = ordered[i]
    if (isTopicDone(t)) {
      derivedStatus.set(t.masterTopicId, 'completed')
    } else if (t.sectionCompleted > 0) {
      derivedStatus.set(t.masterTopicId, 'in_progress')
    } else if (i === 0) {
      derivedStatus.set(t.masterTopicId, 'available')
    } else {
      const inRoadmapPrereqs = t.prerequisiteTopicIds.filter((id) => idSet.has(id))
      if (inRoadmapPrereqs.length > 0) {
        derivedStatus.set(
          t.masterTopicId,
          inRoadmapPrereqs.every((id) => completedIds.has(id)) ? 'available' : 'locked',
        )
      } else {
        // No explicit prerequisites: sequential — only unlock after previous topic is done.
        derivedStatus.set(
          t.masterTopicId,
          completedIds.has(ordered[i - 1].masterTopicId) ? 'available' : 'locked',
        )
      }
    }
  }

  return topics.map((t) => ({ ...t, status: derivedStatus.get(t.masterTopicId) ?? t.status }))
}

export function useMyRoadmaps() {
  return useQuery<RoadmapSummary[]>({
    queryKey: ['my-roadmaps'],
    queryFn: async () => {
      const res = await apiClient.get('/roadmaps')
      return res.data.data
    },
  })
}

export function useRoadmapDetail(roadmapId: string | null | undefined) {
  return useQuery<UserRoadmapDetail>({
    queryKey: ['roadmap-detail', roadmapId],
    enabled: !!roadmapId,
    queryFn: async () => {
      const res = await apiClient.get(`/roadmaps/${roadmapId}`)
      const data = res.data.data
      return {
        roadmap: data.roadmap,
        topics: deriveSequentialStatuses(data.topics.map(mapApiTopic)),
        edges: data.edges,
      }
    },
  })
}
