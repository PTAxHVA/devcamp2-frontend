import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { GapAnalyzerPage } from '../gap-analyzer-page'
import {
  useAnalyzeJobReadiness,
  useAddMissingTopics,
  useJobReadinessRoles,
} from '../hooks/use-job-readiness'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'
import { useAvailableTopics } from '@/features/roadmap/hooks/use-available-topics'
import type { JobReadinessResult } from '../types'

vi.mock('../hooks/use-job-readiness', () => ({
  useJobReadinessRoles: vi.fn(),
  useAnalyzeJobReadiness: vi.fn(),
  useAddMissingTopics: vi.fn(),
}))
vi.mock('@/features/learning/hooks/use-my-learning', () => ({
  useMyRoadmaps: vi.fn(),
}))
vi.mock('@/features/roadmap/hooks/use-available-topics', () => ({
  useAvailableTopics: vi.fn(),
}))

const ROLE = 'Junior Frontend Developer'

const resultFixture: JobReadinessResult = {
  role: ROLE,
  readinessPct: 25,
  source: 'ai',
  verified: [{ topicId: 't-html', name: 'HTML', estimatedHours: 2 }],
  inProgress: [{ topicId: 't-css', name: 'CSS', estimatedHours: 2 }],
  missing: [
    { topicId: 't-react', name: 'React', estimatedHours: 2 },
    { topicId: 't-node', name: 'Node.js & Express', estimatedHours: 3 },
  ],
}

const analyzeMutate = vi.fn()
const analyzeReset = vi.fn()
const addMutate = vi.fn()

const mockAnalyze = (data: JobReadinessResult | undefined) => {
  ;(useAnalyzeJobReadiness as Mock).mockReturnValue({
    mutate: analyzeMutate,
    reset: analyzeReset,
    isPending: false,
    data,
  })
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <GapAnalyzerPage />
    </MemoryRouter>,
  )

describe('GapAnalyzerPage', () => {
  beforeEach(() => {
    analyzeMutate.mockReset()
    analyzeReset.mockReset()
    addMutate.mockReset()
    ;(useJobReadinessRoles as Mock).mockReturnValue({
      data: [ROLE, 'Junior Backend Developer'],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    ;(useAddMissingTopics as Mock).mockReturnValue({ mutate: addMutate, isPending: false })
    ;(useMyRoadmaps as Mock).mockReturnValue({
      data: [
        {
          _id: 'ur-1',
          roadmapId: 'mr-1',
          roleName: 'Frontend Web',
          sourceType: 'SUGGESTED',
          isActive: true,
          createdAt: '2026-07-01T00:00:00.000Z',
        },
      ],
    })
    // Only React can still be added — Node belongs to another roadmap's branches.
    ;(useAvailableTopics as Mock).mockReturnValue({
      data: [{ masterTopicId: 't-react', name: 'React', estimatedHours: 2, sectionTotal: 1 }],
      isLoading: false,
    })
  })

  it('analyzes the picked role', () => {
    mockAnalyze(undefined)
    renderPage()

    fireEvent.change(screen.getByLabelText('Target role'), { target: { value: ROLE } })
    fireEvent.click(screen.getByRole('button', { name: 'Analyze my readiness' }))

    expect(analyzeMutate).toHaveBeenCalledTimes(1)
    expect(analyzeMutate.mock.calls[0][0]).toBe(ROLE)
  })

  it('renders the gap result and adds only the addable missing topics', () => {
    mockAnalyze(resultFixture)
    renderPage()

    expect(screen.getByText(`25% ready for ${ROLE}`)).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add 1 missing topic to my roadmap' }))
    expect(useAddMissingTopics).toHaveBeenCalledWith('ur-1')
    expect(addMutate).toHaveBeenCalledTimes(1)
    expect(addMutate.mock.calls[0][0]).toEqual(['t-react'])
  })

  it('clears a stale result when the target role changes', () => {
    mockAnalyze(resultFixture)
    renderPage()

    fireEvent.change(screen.getByLabelText('Target role'), {
      target: { value: 'Junior Backend Developer' },
    })
    expect(analyzeReset).toHaveBeenCalledTimes(1)
  })

  it('celebrates when the role has no missing topics', () => {
    mockAnalyze({ ...resultFixture, missing: [], readinessPct: 100 })
    renderPage()

    expect(screen.getByText(/Every topic this role needs is covered/i)).toBeInTheDocument()
    expect(screen.queryByText(/Close the gap/i)).not.toBeInTheDocument()
  })
})
