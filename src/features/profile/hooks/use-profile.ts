import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface ProgressItem {
  roadmapId: string
  totalSections: number
  totalCompletedSections: number
  roadmapCompletionPercentage: number
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => (await apiClient.get('/me')).data.data,
  })
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['me', 'profile'],
    queryFn: async () => (await apiClient.get('/me/profile')).data.data,
  })
}

export function useMyProgress() {
  return useQuery<ProgressItem[]>({
    queryKey: ['me', 'progress'],
    queryFn: async () => (await apiClient.get('/me/progress')).data.data,
  })
}
