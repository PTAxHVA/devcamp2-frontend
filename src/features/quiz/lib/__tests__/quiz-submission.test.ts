import { describe, expect, it } from 'vitest'
import { buildAnsweredPayload, buildTimedOutPayload } from '@/features/quiz/lib/quiz-submission'
import type { SessionQuestion } from '@/features/quiz/quiz-store'

const questions: SessionQuestion[] = [
  {
    id: 'mcq-1',
    type: 'mcq',
    content: 'Pick one',
    options: [
      { id: 'option-1', content: 'One' },
      { id: 'option-2', content: 'Two' },
    ],
  },
  { id: 'fill-1', type: 'fill', content: 'Fill this in' },
]

describe('quiz submission payloads', () => {
  it('keeps every answered question for a manual submission', () => {
    expect(buildAnsweredPayload(questions, { 'mcq-1': 'option-2', 'fill-1': 'answer' })).toEqual([
      { questionId: 'mcq-1', selectedOptionId: 'option-2' },
      { questionId: 'fill-1', userInput: 'answer' },
    ])
  })

  it('submits at most one answer when time expires', () => {
    expect(buildTimedOutPayload(questions, { 'mcq-1': 'option-2', 'fill-1': 'answer' })).toEqual([
      { questionId: 'mcq-1', selectedOptionId: 'option-2' },
    ])
  })

  it('creates a gradable answer when time expires before any answer', () => {
    expect(buildTimedOutPayload(questions, {})).toEqual([
      {
        questionId: 'fill-1',
        userInput: '__QUIZ_TIME_EXPIRED_WITHOUT_ANSWER__',
      },
    ])
  })

  it('falls back to a valid option for an unanswered MCQ-only quiz', () => {
    expect(buildTimedOutPayload([questions[0]], {})).toEqual([
      { questionId: 'mcq-1', selectedOptionId: 'option-1' },
    ])
  })
})
