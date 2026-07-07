import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { QuizResultPassPage } from '@/features/quiz/quiz-result-pass-page'
import type { QuizResultData } from '@/features/quiz/hooks/use-quiz-result'
import { hasNudgedAttempt, markNudgedAttempt } from '@/features/passport/lib/passport-share'

const mocks = vi.hoisted(() => ({
  toast: vi.fn(),
  dismiss: vi.fn(),
  useQuizResult: vi.fn(),
  useTopicDetail: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  default: Object.assign(mocks.toast, { dismiss: mocks.dismiss }),
}))

vi.mock('@/features/quiz/hooks/use-quiz-result', () => ({
  useQuizResult: mocks.useQuizResult,
}))

vi.mock('@/features/topic/hooks/use-topic-detail', () => ({
  useTopicDetail: mocks.useTopicDetail,
}))

const ATTEMPT_ID = 'attempt-1'

const quizResult: QuizResultData = {
  quizAttempt: {
    attemptId: ATTEMPT_ID,
    quizId: 'quiz-1',
    startedAt: '2026-07-07T08:00:00.000Z',
    submittedAt: '2026-07-07T08:05:00.000Z',
    score: 80,
    isPassed: true,
  },
  questions: [],
}

const topicDetail = (
  sections: Array<{ _id: string; isPublished: boolean }>,
  progress: Array<{ sectionId: string; isCompleted: boolean }>,
) => ({
  name: 'HTML Basics',
  sectionList: sections,
  userProgress: progress,
})

const completeTopic = topicDetail(
  [
    { _id: 'section-1', isPublished: true },
    { _id: 'section-2', isPublished: true },
  ],
  [
    { sectionId: 'section-1', isCompleted: true },
    { sectionId: 'section-2', isCompleted: true },
  ],
)

const incompleteTopic = topicDetail(
  [
    { _id: 'section-1', isPublished: true },
    { _id: 'section-2', isPublished: true },
  ],
  [{ sectionId: 'section-1', isCompleted: true }],
)

const page = (entry: string) => (
  <MemoryRouter initialEntries={[entry]}>
    <Routes>
      <Route path="/quizzes/:attemptId/result/pass" element={<QuizResultPassPage />} />
    </Routes>
  </MemoryRouter>
)

const renderPage = (entry: string) => render(page(entry))

const mockQuizResult = () => {
  ;(mocks.useQuizResult as Mock).mockReturnValue({
    data: quizResult,
    isLoading: false,
    isError: false,
  })
}

describe('QuizResultPassPage passport nudge', () => {
  beforeEach(() => {
    sessionStorage.clear()
    mocks.toast.mockReset()
    mocks.dismiss.mockReset()
    mocks.useQuizResult.mockReset()
    mocks.useTopicDetail.mockReset()
    mockQuizResult()
  })

  it('shows one passport toast and marks the attempt when the topic is fully verified', async () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: completeTopic,
      isLoading: false,
      isFetching: false,
    })

    renderPage(`/quizzes/${ATTEMPT_ID}/result/pass?topicId=topic-1`)

    await waitFor(() => expect(mocks.toast).toHaveBeenCalledTimes(1))
    expect(mocks.toast.mock.calls[0][1]).toMatchObject({ id: 'passport-nudge' })
    expect(hasNudgedAttempt(ATTEMPT_ID)).toBe(true)
  })

  it('does not toast or mark storage when a published section is still incomplete', async () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: incompleteTopic,
      isLoading: false,
      isFetching: false,
    })

    renderPage(`/quizzes/${ATTEMPT_ID}/result/pass?topicId=topic-1`)

    expect(await screen.findByText('Great job! You passed!')).toBeInTheDocument()
    expect(mocks.toast).not.toHaveBeenCalled()
    expect(hasNudgedAttempt(ATTEMPT_ID)).toBe(false)
  })

  it('waits while topic detail is fetching and toasts after fresh completed data settles', async () => {
    let topicQuery = {
      data: incompleteTopic,
      isLoading: false,
      isFetching: true,
    }
    ;(mocks.useTopicDetail as Mock).mockImplementation(() => topicQuery)

    const { rerender } = renderPage(`/quizzes/${ATTEMPT_ID}/result/pass?topicId=topic-1`)
    expect(mocks.toast).not.toHaveBeenCalled()

    topicQuery = {
      data: completeTopic,
      isLoading: false,
      isFetching: false,
    }
    rerender(page(`/quizzes/${ATTEMPT_ID}/result/pass?topicId=topic-1`))

    await waitFor(() => expect(mocks.toast).toHaveBeenCalledTimes(1))
    expect(hasNudgedAttempt(ATTEMPT_ID)).toBe(true)
  })

  it('stays silent when topicId is absent', async () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    })

    renderPage(`/quizzes/${ATTEMPT_ID}/result/pass`)

    expect(await screen.findByText('Great job! You passed!')).toBeInTheDocument()
    expect(mocks.toast).not.toHaveBeenCalled()
    expect(hasNudgedAttempt(ATTEMPT_ID)).toBe(false)
  })

  it('does not let an unpublished incomplete section block the nudge', async () => {
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: topicDetail(
        [
          { _id: 'section-1', isPublished: true },
          { _id: 'draft-section', isPublished: false },
        ],
        [{ sectionId: 'section-1', isCompleted: true }],
      ),
      isLoading: false,
      isFetching: false,
    })

    renderPage(`/quizzes/${ATTEMPT_ID}/result/pass?topicId=topic-1`)

    await waitFor(() => expect(mocks.toast).toHaveBeenCalledTimes(1))
    expect(hasNudgedAttempt(ATTEMPT_ID)).toBe(true)
  })

  it('does not re-toast after this attempt was already nudged in session storage', async () => {
    markNudgedAttempt(ATTEMPT_ID)
    ;(mocks.useTopicDetail as Mock).mockReturnValue({
      data: completeTopic,
      isLoading: false,
      isFetching: false,
    })

    renderPage(`/quizzes/${ATTEMPT_ID}/result/pass?topicId=topic-1`)

    expect(await screen.findByText('Great job! You passed!')).toBeInTheDocument()
    expect(mocks.toast).not.toHaveBeenCalled()
    expect(hasNudgedAttempt(ATTEMPT_ID)).toBe(true)
  })
})
