import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ContinueLearningCard, type ContinueLearningData } from '../continue-learning-card'

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

const continueLearning: ContinueLearningData = {
  sectionId: 'sec-1',
  topicId: 'top-1',
  userRoadmapId: 'ur-1',
  topicName: 'HTML Basics',
  sectionName: 'Semantic tags',
  // Display name without a front/back/full keyword: a slug derived from it would
  // round-trip to no enrolled roadmap — navigation must use the id instead.
  roadmapName: 'My Custom Path',
  progressPercentage: 40,
  completedSections: 2,
  totalSections: 5,
}

const renderCard = () =>
  render(
    <MemoryRouter>
      <ContinueLearningCard continueLearning={continueLearning} />
    </MemoryRouter>,
  )

describe('ContinueLearningCard navigation', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('opens the roadmap by id (title + View Roadmap), never by a name-derived slug', () => {
    renderCard()

    fireEvent.click(screen.getByText('My Custom Path'))
    fireEvent.click(screen.getByRole('button', { name: /view roadmap/i }))

    expect(mockNavigate).toHaveBeenCalledTimes(2)
    for (const [target] of mockNavigate.mock.calls) {
      expect(target).toBe('/roadmaps/ur-1')
    }
  })

  it('Continue Learning goes straight to the next section', () => {
    renderCard()

    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }))

    expect(mockNavigate).toHaveBeenCalledWith(
      '/my-learning/topics/top-1/sections/sec-1?roadmapId=ur-1',
    )
  })
})
