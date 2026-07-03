import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface BERoadmapMetadata {
  userRoadmapId: string
  masterRoadmapId: string
  roleName: string | null
  sourceType: string
  isActive: boolean
}

export interface BEGraphTopic {
  masterTopicId: string
  userTopicId: string | null
  name: string
  descriptionShort?: string
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  orderIndex: number
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  prerequisiteTopicIds: string[]
}

export interface BEGraphEdge {
  source: string
  target: string
}

export interface BERoadmapDetail {
  roadmap: BERoadmapMetadata
  topics: BEGraphTopic[]
  edges: BEGraphEdge[]
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export function useRoadmapDetail(id: string) {
  return useQuery<BERoadmapDetail>({
    queryKey: ['roadmap-detail', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<BERoadmapDetail>>(`/roadmaps/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}
