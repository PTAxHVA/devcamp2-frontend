import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import TopicDetailPage from '../topic-detail-page'
import type { BETopicDetail } from '../hooks/use-topic-detail'

const mocks = vi.hoisted(() => ({
  useTopicDetail: vi.fn(),
}))

vi.mock('../hooks/use-topic-detail', () => ({
  useTopicDetail: mocks.useTopicDetail,
}))

const TOPIC_ID = 'topic-1'

const baseTopic: BETopicDetail = {
  _id: TOPIC_ID,
  name: 'React',
  description: '',
  whyLearn: '',
  estimatedHours: 4,
  resources: [],
  orderIndex: 0,
  sectionList: [
    {
      _id: 'section-1',
      topicId: TOPIC_ID,
      name: 'Components & JSX',
      slug: 'components-jsx',
      contentOverview: 'Learn components.',
      isPublished: true,
      orderIndex: 0,
      resourceList: [],
    },
    {
      _id: 'section-2',
      topicId: TOPIC_ID,
      name: 'Hooks',
      slug: 'hooks',
      contentOverview: 'Learn hooks.',
      isPublished: true,
      orderIndex: 1,
      resourceList: [],
    },
  ],
  userProgress: [
    {
      userTopicId: 'ut-1',
      sectionId: 'section-1',
      isCompleted: true,
      startedAt: '',
      completedAt: '',
    },
  ],
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[`/my-learning/topics/${TOPIC_ID}`]}>
      <Routes>
        <Route path="/my-learning/topics/:id" element={<TopicDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('TopicDetailPage why-learn panel (J)', () => {
  beforeEach(() => {
    mocks.useTopicDetail.mockReset()
  })

  it('renders the curated whyLearn text when present', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: {
        ...baseTopic,
        whyLearn: 'React is the most popular UI library for building interfaces.',
      },
      isLoading: false,
      isError: false,
    })

    renderPage()

    expect(
      screen.getByText('React is the most popular UI library for building interfaces.'),
    ).toBeInTheDocument()
  })

  it('degrades to the topic description when whyLearn is empty', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: { ...baseTopic, whyLearn: '', description: 'A JavaScript library for building UIs.' },
      isLoading: false,
      isError: false,
    })

    renderPage()

    expect(screen.getByText('A JavaScript library for building UIs.')).toBeInTheDocument()
  })

  it('degrades to a generic line when both whyLearn and description are empty', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: { ...baseTopic, whyLearn: '', description: '' },
      isLoading: false,
      isError: false,
    })

    renderPage()

    expect(
      screen.getByText(/builds a core skill you'll use throughout the roadmap/i),
    ).toBeInTheDocument()
  })

  it('lists the published sections under "What you\'ll learn"', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: baseTopic,
      isLoading: false,
      isError: false,
    })

    renderPage()

    expect(screen.getByText(/What you'll learn \(2 sections\)/i)).toBeInTheDocument()
    // Section names appear both in the "What you'll learn" list and the
    // interactive Sections table below it, by design — assert at least one.
    expect(screen.getAllByText('Components & JSX').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Hooks').length).toBeGreaterThan(0)
  })

  it('reflects the 3-state status badge for each section in the sections table', () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: baseTopic,
      isLoading: false,
      isError: false,
    })

    renderPage()

    // section-1 has a completed progress row, section-2 has none.
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('Not started')).toBeInTheDocument()
  })
})
