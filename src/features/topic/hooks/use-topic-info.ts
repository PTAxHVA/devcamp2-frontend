import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface BETopicInfoSection {
  _id: string
  name: string
  contentOverview: string
  orderIndex: number
}

/** Pre-enrollment topic preview (GET /topics/:id/info) — no user progress. */
export interface BETopicInfo {
  _id: string
  name: string
  description: string
  /** Curated "why learn this" line (BE PR #62). `''` until the topic is reseeded —
   *  callers must degrade to the description, never assume it's populated. */
  whyLearn: string
  estimatedHours: number
  sectionList: BETopicInfoSection[]
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

/**
 * Fetch a topic's pre-enrollment preview (why-learn + published sections) for the
 * onboarding personalized-plan panel. Unlike useTopicDetail, this hits the
 * enrollment-free /info endpoint, so it works before the learner has enrolled.
 */
export function useTopicInfo(topicId: string | null) {
  return useQuery<BETopicInfo>({
    queryKey: ['topic-info', topicId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<BETopicInfo>>(`/topics/${topicId}/info`)
      return res.data.data
    },
    enabled: !!topicId,
  })
}
