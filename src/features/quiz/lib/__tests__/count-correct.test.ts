import { describe, it, expect } from 'vitest'
import { countCorrect, isQuestionCorrect } from '@/features/quiz/lib/count-correct'
import type { ResultQuestion } from '@/features/quiz/hooks/use-quiz-result'

const mcq = (correct: boolean): ResultQuestion => ({
  _id: `m-${correct}`,
  type: 'MULTIPLE_CHOICE',
  content: 'q',
  orderIndex: 0,
  options: [
    { _id: 'o1', questionId: 'm', content: 'a', orderIndex: 0, isCorrect: true },
    { _id: 'o2', questionId: 'm', content: 'b', orderIndex: 1, isCorrect: false },
  ],
  userAnswer: { questionId: 'm', selectedOptionId: correct ? 'o1' : 'o2', isCorrect: correct },
})

const fill = (isCorrect: boolean): ResultQuestion => ({
  _id: `f-${isCorrect}`,
  type: 'FILL_IN_BLANK',
  content: 'q',
  orderIndex: 0,
  userAnswer: { questionId: 'f', userInput: 'npm', isCorrect },
})

describe('isQuestionCorrect (M1 — fill-in-blank verdict)', () => {
  it('uses the server verdict for fill-in-blank (both true and false)', () => {
    expect(isQuestionCorrect(fill(true))).toBe(true)
    expect(isQuestionCorrect(fill(false))).toBe(false)
  })

  it('falls back to option compare for MCQ when isCorrect is absent', () => {
    const q: ResultQuestion = {
      ...mcq(true),
      userAnswer: { questionId: 'm', selectedOptionId: 'o1' },
    }
    expect(isQuestionCorrect(q)).toBe(true)
  })

  it('treats an unanswered question as incorrect', () => {
    expect(
      isQuestionCorrect({ _id: 'x', type: 'FILL_IN_BLANK', content: 'q', orderIndex: 0 }),
    ).toBe(false)
  })
})

describe('countCorrect (NEW-8 — real count, not round(score/100*total))', () => {
  it('counts correct MCQ + fill-in-blank from per-question verdicts', () => {
    expect(countCorrect([mcq(true), fill(true), mcq(false), fill(false)])).toBe(2)
  })
})
