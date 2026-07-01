import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface BrowseRoadmap {
  _id: string
  roleName: string
  description?: string
  difficulty?: string
  duration?: string
  topicsCount?: number
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export interface BrowseRoadmapFilters {
  role?: string
  difficulty?: string
  duration?: string
  search?: string
}

type BrowseRoadmapData = BrowseRoadmap[] | { items: BrowseRoadmap[] }

export function normalizeBrowseRoadmapFilters(filters: BrowseRoadmapFilters): BrowseRoadmapFilters {
  return Object.fromEntries(
    Object.entries(filters).flatMap(([key, value]) => {
      const normalized = value?.trim()
      return normalized && normalized.toLowerCase() !== 'all' ? [[key, normalized]] : []
    }),
  ) as BrowseRoadmapFilters
}

export function useBrowseRoadmaps(filters: BrowseRoadmapFilters = {}) {
  const normalizedFilters = normalizeBrowseRoadmapFilters(filters)

  return useQuery<BrowseRoadmap[]>({
    queryKey: ['browse-roadmaps', normalizedFilters],
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<BrowseRoadmapData>>('/master-roadmaps', {
        params: normalizedFilters,
      })
      return Array.isArray(res.data.data) ? res.data.data : (res.data.data.items ?? [])
    },
    staleTime: 5 * 60 * 1000,
  })
}
