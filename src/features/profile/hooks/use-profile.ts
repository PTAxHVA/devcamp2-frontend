import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

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
