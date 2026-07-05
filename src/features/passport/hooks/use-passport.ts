import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import {
  fetchPublicPassport,
  type PassportSettings,
  type PublicPassport,
} from '../lib/passport-api'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export function usePublicPassport(shareToken: string) {
  return useQuery<PublicPassport>({
    queryKey: ['public-passport', shareToken],
    queryFn: () => fetchPublicPassport(shareToken),
    enabled: !!shareToken,
    // 404 means "unknown link or owner made it private" — retrying won't help.
    retry: false,
  })
}

export function useMyPassport() {
  return useQuery<PassportSettings>({
    queryKey: ['me', 'passport'],
    queryFn: async () =>
      (await apiClient.get<ApiEnvelope<PassportSettings>>('/me/passport')).data.data,
  })
}

interface UpdatePassportBody {
  isPublic: boolean
  /** Mint a fresh share token — the old public link stops working. */
  regenerate?: boolean
}

export function useUpdatePassport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: UpdatePassportBody) =>
      (await apiClient.patch<ApiEnvelope<PassportSettings>>('/me/passport', body)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'passport'] })
    },
  })
}
