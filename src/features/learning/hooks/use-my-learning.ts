import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { UserRoadmapDetail, RoadmapSummary, LearningTopic } from '../types'

function mapApiTopic(t: {
  masterTopicId: string
  userTopicId: string | null
  name: string
  // Backend still uses the 4-state contract; the learning UI is 3-state.
  status: LearningTopic['status'] | 'available'
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
    // Collapse "available" -> "locked" so the rest of the learning UI only ever
    // deals with the 3-state model (and never hits an undefined status lookup).
    status: t.status === 'available' ? 'locked' : t.status,
    orderIndex: t.orderIndex,
    estimatedHours: t.estimatedHours,
    sectionTotal: t.sectionTotal,
    sectionCompleted: t.sectionCompleted,
    prerequisiteTopicIds: t.prerequisiteTopicIds,
  }
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
        topics: data.topics.map(mapApiTopic),
        edges: data.edges,
      }
    },
  })
}
