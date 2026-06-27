import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface ProgressItem {
  roadmapId: string
  totalSections: number
  totalCompletedSections: number
  roadmapCompletionPercentage: number
}

interface UpdateProfileBody {
  username?: string
  level?: string
}

interface UpdateAccountBody {
  email?: string
  currentPassword: string
  password?: string
}

interface DeactivateAccountBody {
  currentPassword: string
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

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: UpdateProfileBody) =>
      (await apiClient.patch('/me/profile', body)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: UpdateAccountBody) =>
      (await apiClient.patch('/me/account', body)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useDeactivateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: DeactivateAccountBody) =>
      (await apiClient.patch('/me/account/deactivate', body)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
