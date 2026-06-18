/** 4-state topic status returned by the backend roadmap graph. */
export type RoadmapTopicStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface RoadmapMeta {
  masterRoadmapId: string
  roleName: string
  description: string
}

export interface RoadmapGraphTopic {
  masterTopicId: string
  userTopicId: string | null
  name: string
  status: RoadmapTopicStatus
  orderIndex: number
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  prerequisiteTopicIds: string[]
}

export interface RoadmapGraphEdge {
  source: string
  target: string
}

/** Response of GET /master-roadmaps/demo (public, no auth). */
export interface DemoRoadmap {
  roadmap: RoadmapMeta
  topics: RoadmapGraphTopic[]
  edges: RoadmapGraphEdge[]
}
