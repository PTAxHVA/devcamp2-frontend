// 3-state model for the learning view: a topic is either done, actively being
// learned, or not-yet-started. We intentionally do NOT distinguish "available"
// from "locked" here — both render identically (slate, non-navigable). The
// backend may still send "available"; it is normalized to "locked" at the API
// boundary (see use-my-learning.ts).
export type TopicStatus = 'completed' | 'in_progress' | 'locked'

export interface LearningTopic {
  masterTopicId: string
  userTopicId: string | null
  title: string
  status: TopicStatus
  orderIndex: number
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  prerequisiteTopicIds: string[]
}

export interface UserRoadmapMeta {
  userRoadmapId: string
  masterRoadmapId: string
  roleName: string | null
  sourceType: string
  isActive: boolean
}

export interface UserRoadmapDetail {
  roadmap: UserRoadmapMeta
  topics: LearningTopic[]
  edges: { source: string; target: string }[]
}

export interface RoadmapSummary {
  _id: string
  roadmapId: string
  roleName: string | null
  sourceType: string
  isActive: boolean
  createdAt: string
}
