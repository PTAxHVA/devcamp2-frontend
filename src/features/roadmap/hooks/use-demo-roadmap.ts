import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { DemoRoadmap } from '../types'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/**
 * Public, no-login curated demo roadmap (GET /master-roadmaps/demo).
 * Powers the /demo-roadmap preview — no JWT required.
 */
export function useDemoRoadmap() {
  return useQuery<DemoRoadmap>({
    queryKey: ['demo-roadmap'],
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<DemoRoadmap>>('/master-roadmaps/demo')
      return res.data.data
    },
  })
}
