import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import MyLearningJourneyPage from '../my-learning-page'
import type { LearningTopic } from '@/features/learning/types'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  useMyRoadmaps: vi.fn(),
  useRoadmapDetail: vi.fn(),
  useUnregisterRoadmap: vi.fn(),
}))

vi.mock('react-router', async (importActual) => {
  const actual = await importActual<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mocks.navigate }
})

vi.mock('@/features/learning/hooks/use-my-learning', () => ({
  useMyRoadmaps: mocks.useMyRoadmaps,
  useRoadmapDetail: mocks.useRoadmapDetail,
  useUnregisterRoadmap: mocks.useUnregisterRoadmap,
}))

// Heavy children pull their own data — stub them so this test isolates the page's
// completion wiring. The snake-path stub exposes onFinish as a button, proving the
// page hands it a working navigation callback.
vi.mock('@/features/learning/components/snake-roadmap', () => ({
  default: ({ onFinish }: { onFinish?: () => void }) => (
    <button onClick={onFinish}>finish-node-stub</button>
  ),
}))
vi.mock('@/features/learning/components/fork-path-banner', () => ({ default: () => null }))
vi.mock('@/features/learning/components/topic-side-bar', () => ({ default: () => null }))

function topic(over: Partial<LearningTopic>): LearningTopic {
  return {
    masterTopicId: 't',
    userTopicId: null,
    title: 'T',
    status: 'completed',
    orderIndex: 0,
    estimatedHours: 1,
    sectionTotal: 2,
    sectionCompleted: 2,
    prerequisiteTopicIds: [],
    ...over,
  }
}

const roadmaps = [
  {
    _id: 'rm1',
    roadmapId: 'master1',
    roleName: 'Frontend',
    sourceType: 'suggested',
    isActive: true,
    createdAt: '',
  },
]

const meta = {
  userRoadmapId: 'rm1',
  masterRoadmapId: 'master1',
  roleName: 'Frontend',
  sourceType: 'suggested',
  isActive: true,
}

function setDetail(topics: LearningTopic[]) {
  mocks.useRoadmapDetail.mockReturnValue({
    data: { roadmap: meta, topics, edges: [] },
    isLoading: false,
    isError: false,
  })
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/my-learning']}>
      <MyLearningJourneyPage />
    </MemoryRouter>,
  )

describe('MyLearningJourneyPage — roadmap completion', () => {
  beforeEach(() => {
    mocks.navigate.mockReset()
    mocks.useMyRoadmaps.mockReturnValue({
      data: roadmaps,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    mocks.useUnregisterRoadmap.mockReturnValue({ mutate: vi.fn(), isPending: false })
  })

  it('shows the certificate banner and navigates to the complete page when all topics are done', () => {
    setDetail([topic({ masterTopicId: 'a' }), topic({ masterTopicId: 'b' })])
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /view your certificate/i }))
    expect(mocks.navigate).toHaveBeenCalledWith('/roadmaps/rm1/complete')
  })

  it('routes the FINISH node click to the complete page', () => {
    setDetail([topic({ masterTopicId: 'a' })])
    renderPage()

    fireEvent.click(screen.getByText('finish-node-stub'))
    expect(mocks.navigate).toHaveBeenCalledWith('/roadmaps/rm1/complete')
  })

  it('hides the banner while any topic is unfinished', () => {
    setDetail([
      topic({ masterTopicId: 'a' }),
      topic({ masterTopicId: 'b', status: 'in_progress', sectionCompleted: 1 }),
    ])
    renderPage()

    expect(screen.queryByRole('button', { name: /view your certificate/i })).not.toBeInTheDocument()
  })
})
