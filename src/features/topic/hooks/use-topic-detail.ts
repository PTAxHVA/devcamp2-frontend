import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface BEUserProgress {
  userTopicId: string
  sectionId: string
  isCompleted: boolean
  startedAt: string
  completedAt: string | null
}

export interface BEResource {
  title: string
  url: string
  type: 'article' | 'video' | 'docs' | 'interactive'
  provider: string
  estimatedMinutes: number
}

export interface BESection {
  _id: string
  topicId: string
  name: string
  slug: string
  contentOverview: string
  isPublished: boolean
  orderIndex: number
  resourceList: BEResource[]
  createdAt?: string
  updatedAt?: string
}

export interface BETopicDetail {
  _id: string
  name: string
  description: string
  /** Curated "why learn this" line (BE PR #62). Empty string `''` when the
   * topic hasn't been reseeded yet — callers must degrade, never assume it's
   * populated. */
  whyLearn: string
  estimatedHours: number
  resources: unknown[]
  orderIndex: number
  sectionList: BESection[]
  userProgress: BEUserProgress[]
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export function useTopicDetail(topicId: string) {
  return useQuery<BETopicDetail>({
    queryKey: ['topic-detail', topicId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<BETopicDetail>>(`/topics/${topicId}`)
      return res.data.data
    },
    enabled: !!topicId,
  })
}
