import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { apiClient } from '@/lib/api-client'
import { useUnregisterRoadmap } from '../use-my-learning'

vi.mock('@/lib/api-client', () => ({
  apiClient: { delete: vi.fn(), get: vi.fn() },
}))

describe('useUnregisterRoadmap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('DELETEs the roadmap and invalidates the active-roadmap queries', async () => {
    ;(apiClient.delete as Mock).mockResolvedValue({
      data: { success: true, data: { deleted: true } },
    })

    const queryClient = new QueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useUnregisterRoadmap(), { wrapper })
    result.current.mutate('road-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiClient.delete).toHaveBeenCalledWith('/roadmaps/road-1')

    const invalidatedKeys = invalidateSpy.mock.calls.map((call) => call[0]?.queryKey)
    expect(invalidatedKeys).toContainEqual(['my-roadmaps'])
    expect(invalidatedKeys).toContainEqual(['dashboard'])
    expect(invalidatedKeys).toContainEqual(['me', 'progress'])
  })
})
