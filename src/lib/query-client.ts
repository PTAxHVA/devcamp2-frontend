import { QueryClient, QueryCache } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { extractApiError } from './api-client'

/**
 * Shared TanStack Query client.
 * Defaults tuned for learning platform: 1 min stale, no refetch on focus.
 * Global query error handler surfaces BE error messages so each query hook
 * doesn't need its own onError toast.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        // 401 is handled by the api-client interceptor (redirect to login).
        if (status === 401) return
        // Queries that render their own error state can opt out via meta.suppressToast: true
        // to avoid showing a toast alongside an inline error message.
        if (query.meta?.suppressToast) return
        const { message } = extractApiError(error)
        toast.error(message ?? 'Something went wrong. Please try again.')
      }
    },
  }),
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
