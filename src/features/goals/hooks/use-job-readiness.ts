import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { JobReadinessResult } from '../types'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/** Curated target roles for the picker (BE is the single source of truth). */
export function useJobReadinessRoles() {
  return useQuery<string[]>({
    queryKey: ['job-readiness-roles'],
    queryFn: async () =>
      (await apiClient.get<ApiEnvelope<{ roles: string[] }>>('/ai/job-readiness/roles')).data.data
        .roles,
    staleTime: 5 * 60 * 1000, // static curated list — no point refetching per visit
  })
}

/** Run the gap analysis for one target role. */
export function useAnalyzeJobReadiness() {
  return useMutation({
    mutationFn: async (role: string) =>
      (await apiClient.post<ApiEnvelope<JobReadinessResult>>('/ai/job-readiness', { role })).data
        .data,
  })
}

/** Add missing gap topics to a roadmap — same PATCH (and cache invalidations) as the customize editor. */
export function useAddMissingTopics(roadmapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (addTopicIds: string[]) =>
      (await apiClient.patch(`/roadmaps/${roadmapId}`, { addTopicIds })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-detail', roadmapId] })
      queryClient.invalidateQueries({ queryKey: ['my-roadmaps'] })
      queryClient.invalidateQueries({ queryKey: ['available-topics', roadmapId] })
    },
  })
}
