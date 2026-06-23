// 4-state model for the learning view: completed, actively being learned,
// available (can start now — prerequisites met), or locked (prerequisites not met).
export type TopicStatus = 'completed' | 'in_progress' | 'available' | 'locked'

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
