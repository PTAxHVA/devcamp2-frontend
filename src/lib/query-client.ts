import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Shared TanStack Query client.
 * Defaults tuned for learning platform: 1 min stale, no refetch on focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      // Don't retry auth failures (401/403) — the token is bad, retrying just
      // loops the same unauthorized request. Retry other errors up to 3 times.
      retry: (failureCount: number, error: unknown) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status
          if (status === 401 || status === 403) return false
        }
        return failureCount < 3
      },
    },
  },
})
