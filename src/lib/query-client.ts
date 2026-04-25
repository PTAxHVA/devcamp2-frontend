import { QueryClient } from '@tanstack/react-query'

/**
 * Shared TanStack Query client.
 * Defaults tuned for learning platform: 1 min stale, no refetch on focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})
