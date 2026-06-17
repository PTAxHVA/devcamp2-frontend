import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { UserRoadmapDetail, RoadmapSummary, LearningTopic } from '../types'

// --- Mock data for UI preview (remove when backend is ready) ---
const MOCK_ROADMAPS: RoadmapSummary[] = [
  {
    _id: 'rm-1',
    roadmapId: 'master-1',
    roleName: 'Frontend Web Developer',
    sourceType: 'SUGGESTED',
    isActive: true,
    createdAt: '',
  },
]

const MOCK_DETAIL: UserRoadmapDetail = {
  roadmap: {
    userRoadmapId: 'rm-1',
    masterRoadmapId: 'master-1',
    roleName: 'Frontend Web Developer',
    sourceType: 'SUGGESTED',
    isActive: true,
  },
  topics: [
    {
      masterTopicId: 't1',
      userTopicId: 'ut1',
      title: 'Web Fundamentals',
      status: 'completed',
      orderIndex: 0,
      estimatedHours: 8,
      sectionTotal: 4,
      sectionCompleted: 4,
      prerequisiteTopicIds: [],
    },
    {
      masterTopicId: 't2',
      userTopicId: 'ut2',
      title: 'HTML & CSS',
      status: 'completed',
      orderIndex: 1,
      estimatedHours: 12,
      sectionTotal: 6,
      sectionCompleted: 6,
      prerequisiteTopicIds: ['t1'],
    },
    {
      masterTopicId: 't3',
      userTopicId: 'ut3',
      title: 'JavaScript Basics',
      status: 'completed',
      orderIndex: 2,
      estimatedHours: 20,
      sectionTotal: 8,
      sectionCompleted: 8,
      prerequisiteTopicIds: ['t2'],
    },
    {
      masterTopicId: 't4',
      userTopicId: 'ut4',
      title: 'DOM & Events',
      status: 'in_progress',
      orderIndex: 3,
      estimatedHours: 10,
      sectionTotal: 5,
      sectionCompleted: 2,
      prerequisiteTopicIds: ['t3'],
    },
    {
      masterTopicId: 't5',
      userTopicId: 'ut5',
      title: 'React Basics',
      status: 'available',
      orderIndex: 4,
      estimatedHours: 15,
      sectionTotal: 6,
      sectionCompleted: 0,
      prerequisiteTopicIds: ['t4'],
    },
    {
      masterTopicId: 't6',
      userTopicId: 'ut6',
      title: 'Advanced React',
      status: 'locked',
      orderIndex: 5,
      estimatedHours: 20,
      sectionTotal: 8,
      sectionCompleted: 0,
      prerequisiteTopicIds: ['t5'],
    },
    {
      masterTopicId: 't7',
      userTopicId: 'ut7',
      title: 'API Integration',
      status: 'locked',
      orderIndex: 6,
      estimatedHours: 8,
      sectionTotal: 4,
      sectionCompleted: 0,
      prerequisiteTopicIds: ['t5'],
    },
    {
      masterTopicId: 't8',
      userTopicId: 'ut8',
      title: 'TypeScript',
      status: 'locked',
      orderIndex: 7,
      estimatedHours: 12,
      sectionTotal: 5,
      sectionCompleted: 0,
      prerequisiteTopicIds: ['t5'],
    },
    {
      masterTopicId: 't9',
      userTopicId: 'ut9',
      title: 'Testing',
      status: 'locked',
      orderIndex: 8,
      estimatedHours: 10,
      sectionTotal: 4,
      sectionCompleted: 0,
      prerequisiteTopicIds: ['t6', 't7'],
    },
  ],
  edges: [],
}

const USE_MOCK = true // flip to false khi backend sẵn sàng
// --- End mock data ---

function mapApiTopic(t: {
  masterTopicId: string
  userTopicId: string | null
  name: string
  status: LearningTopic['status']
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

export function useMyRoadmaps() {
  return useQuery<RoadmapSummary[]>({
    queryKey: ['my-roadmaps'],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_ROADMAPS
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
      if (USE_MOCK) return MOCK_DETAIL
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
