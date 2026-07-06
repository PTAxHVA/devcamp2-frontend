import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MistakeCoach } from '../mistake-coach'
import { useExplainMistakes } from '@/features/quiz/hooks/use-explain-mistakes'
import type { ExplainMistakesResult } from '@/features/quiz/hooks/use-explain-mistakes'
import type { ResultQuestion } from '@/features/quiz/hooks/use-quiz-result'

vi.mock('@/features/quiz/hooks/use-explain-mistakes', () => ({
  useExplainMistakes: vi.fn(),
}))

const ATTEMPT_ID = 'attempt-1'

// One wrong MCQ + one correct fill-in-blank — exactly one question to coach.
const questions: ResultQuestion[] = [
  {
    _id: 'q1',
    type: 'MULTIPLE_CHOICE',
    content: 'Which tag creates a hyperlink?',
    orderIndex: 0,
    options: [
      { _id: 'o1', questionId: 'q1', content: '<a>', orderIndex: 0, isCorrect: true },
      { _id: 'o2', questionId: 'q1', content: '<div>', orderIndex: 1, isCorrect: false },
    ],
    userAnswer: { questionId: 'q1', selectedOptionId: 'o2', isCorrect: false },
  },
  {
    _id: 'q2',
    type: 'FILL_IN_BLANK',
    content: 'Node package manager?',
    orderIndex: 1,
    userAnswer: { questionId: 'q2', userInput: 'npm', isCorrect: true },
  },
]

const aiResult: ExplainMistakesResult = {
  attemptId: ATTEMPT_ID,
  sectionName: 'HTML Links',
  source: 'ai',
  explanations: [
    {
      questionId: 'q1',
      why: 'The <div> tag only groups content; <a> is the anchor element that creates links.',
      reviewHint: 'Review anchor tags in "MDN: the <a> element".',
    },
  ],
  resources: [
    { title: 'MDN: the <a> element', url: 'https://developer.mozilla.org/anchor', type: 'docs' },
  ],
}

const mutate = vi.fn()

const mockExplain = (overrides: { data?: ExplainMistakesResult; isPending?: boolean } = {}) => {
  ;(useExplainMistakes as Mock).mockReturnValue({
    mutate,
    isPending: overrides.isPending ?? false,
    data: overrides.data,
  })
}

describe('MistakeCoach', () => {
  beforeEach(() => {
    mutate.mockReset()
  })

  it('calls the explain endpoint with the attempt id on click', () => {
    mockExplain()
    render(<MistakeCoach attemptId={ATTEMPT_ID} questions={questions} />)

    fireEvent.click(screen.getByRole('button', { name: 'Review my mistakes (1)' }))

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate.mock.calls[0][0]).toBe(ATTEMPT_ID)
  })

  it('renders the AI explanations for the wrong question with the resource link', () => {
    mockExplain({ data: aiResult })
    render(<MistakeCoach attemptId={ATTEMPT_ID} questions={questions} />)

    expect(screen.getByText('Which tag creates a hyperlink?')).toBeInTheDocument()
    expect(screen.getByText(/anchor element that creates links/)).toBeInTheDocument()
    expect(screen.getByText(/Review anchor tags/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /MDN: the <a> element/ })).toHaveAttribute(
      'href',
      'https://developer.mozilla.org/anchor',
    )
    // No "AI is busy" note on a real AI answer.
    expect(screen.queryByText(/AI is busy right now/)).not.toBeInTheDocument()
  })

  it('shows the degrade note plus correct answer and resources on a fallback payload', () => {
    mockExplain({
      data: {
        ...aiResult,
        source: 'fallback',
        explanations: [
          {
            questionId: 'q1',
            why: 'The correct answer is "<a>", not "<div>".',
            reviewHint: 'Revisit "HTML Links" with the curated resources below before retrying.',
          },
        ],
      },
    })
    render(<MistakeCoach attemptId={ATTEMPT_ID} questions={questions} />)

    expect(screen.getByText(/AI is busy right now/)).toBeInTheDocument()
    expect(screen.getByText(/The correct answer is "<a>"/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /MDN: the <a> element/ })).toBeInTheDocument()
  })

  it('renders nothing on a perfect attempt', () => {
    mockExplain()
    const perfect = questions.map((q) => ({
      ...q,
      userAnswer: { ...q.userAnswer, questionId: q._id, isCorrect: true },
    }))
    const { container } = render(<MistakeCoach attemptId={ATTEMPT_ID} questions={perfect} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('never renders a non-http(s) resource link', () => {
    mockExplain({
      data: {
        ...aiResult,
        resources: [
          { title: 'Evil', url: 'javascript:alert(1)', type: 'docs' },
          { title: 'Safe', url: 'https://example.com/safe', type: 'article' },
        ],
      },
    })
    render(<MistakeCoach attemptId={ATTEMPT_ID} questions={questions} />)

    expect(screen.queryByRole('link', { name: /Evil/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Safe/ })).toHaveAttribute(
      'href',
      'https://example.com/safe',
    )
  })
})
