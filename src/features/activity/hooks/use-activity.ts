import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { ActivityResponse } from '../types'

/** Daily section-completion series for the "View full" chart (dashboard modal +
 *  profile inline). Keyed by `days` so different windows cache separately. */
export function useActivity(days = 30) {
  return useQuery<ActivityResponse>({
    queryKey: ['activity', days],
    queryFn: async () => (await apiClient.get('/me/activity', { params: { days } })).data.data,
  })
}
