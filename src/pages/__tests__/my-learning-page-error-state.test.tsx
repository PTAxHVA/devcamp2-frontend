import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import MyLearningJourneyPage from '../my-learning-page'

const mocks = vi.hoisted(() => ({
  useMyRoadmaps: vi.fn(),
  useRoadmapDetail: vi.fn(),
}))

vi.mock('@/features/learning/hooks/use-my-learning', () => ({
  useMyRoadmaps: mocks.useMyRoadmaps,
  useRoadmapDetail: mocks.useRoadmapDetail,
}))

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/my-learning']}>
      <MyLearningJourneyPage />
    </MemoryRouter>,
  )

describe('MyLearningJourneyPage list states (NEW-2)', () => {
  beforeEach(() => {
    mocks.useMyRoadmaps.mockReset()
    mocks.useRoadmapDetail.mockReturnValue({ data: undefined, isLoading: false, isError: false })
  })

  it('shows a distinct error state (not the empty state) when the list request fails', () => {
    const refetch = vi.fn()
    mocks.useMyRoadmaps.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    })
    renderPage()

    expect(screen.getByText("Couldn't load your roadmaps")).toBeInTheDocument()
    expect(screen.queryByText('No active roadmaps')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('keeps the genuine empty state for a learner with no roadmaps', () => {
    mocks.useMyRoadmaps.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    renderPage()

    expect(screen.getByText('No active roadmaps')).toBeInTheDocument()
    expect(screen.queryByText("Couldn't load your roadmaps")).not.toBeInTheDocument()
  })
})
