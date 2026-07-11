import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RoadmapCard from '../roadmap-card'

// The card fetches its branch list on mount; keep it offline and instant.
vi.mock('@/lib/api-client', () => ({
  apiClient: { get: vi.fn().mockResolvedValue({ data: { data: [] } }) },
}))
vi.mock('../../hooks/use-enroll-roadmap', () => ({
  useEnrollRoadmap: () => ({ mutate: vi.fn(), isPending: false }),
}))

const renderCard = (isEnrolled = false) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <RoadmapCard
          data={{ _id: 'master-1', roleName: 'Frontend Developer' }}
          isEnrolled={isEnrolled}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RoadmapCard preview action', () => {
  it('labels the preview action "Customize" (not "Preview")', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /customize/i })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /^preview$/i })).toBeNull()
  })
})
