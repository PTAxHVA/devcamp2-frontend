import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import SectionDetailPage from '../section-detail-page'

const mocks = vi.hoisted(() => ({
  useSectionDetail: vi.fn(),
  useTopicDetail: vi.fn(),
  useSectionQuiz: vi.fn(),
}))

vi.mock('../hooks/use-section-detail', () => ({
  useSectionDetail: mocks.useSectionDetail,
}))
vi.mock('@/features/topic/hooks/use-topic-detail', () => ({
  useTopicDetail: mocks.useTopicDetail,
}))
vi.mock('../hooks/use-section-quiz', () => ({
  useSectionQuiz: mocks.useSectionQuiz,
}))

const SECTION_ID = 'section-1'
const TOPIC_ID = 'topic-1'

const section = {
  _id: SECTION_ID,
  title: 'useState Basics',
  contentOverview: 'Learn the useState hook.',
  orderIndex: 0,
  resourceList: [],
  hasQuiz: false,
  isCompleted: false,
}

const topic = (userProgress: Array<{ sectionId: string; isCompleted: boolean }>) => ({
  _id: TOPIC_ID,
  name: 'React',
  sectionList: [{ _id: SECTION_ID, name: 'useState Basics', orderIndex: 0 }],
  userProgress,
})

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[`/my-learning/topics/${TOPIC_ID}/sections/${SECTION_ID}`]}>
      <Routes>
        <Route
          path="/my-learning/topics/:topicId/sections/:sectionId"
          element={<SectionDetailPage />}
        />
      </Routes>
    </MemoryRouter>,
  )

describe('SectionDetailPage 3-state status badge', () => {
  beforeEach(() => {
    mocks.useSectionDetail.mockReset()
    mocks.useTopicDetail.mockReset()
    mocks.useSectionQuiz.mockReset()
    ;(mocks.useSectionDetail as Mock).mockReturnValue({
      data: section,
      isLoading: false,
      isError: false,
    })
    ;(mocks.useSectionQuiz as Mock).mockReturnValue({ data: undefined, isLoading: false })
  })

  it('shows "Not started" when there is no progress row for this section', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: topic([]),
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('Not started')).toBeInTheDocument()
  })

  it('shows "In progress" when the row exists with isCompleted: false', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: topic([{ sectionId: SECTION_ID, isCompleted: false }]),
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('In progress')).toBeInTheDocument()
  })

  it('shows "Done" when the row exists with isCompleted: true', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: topic([{ sectionId: SECTION_ID, isCompleted: true }]),
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
