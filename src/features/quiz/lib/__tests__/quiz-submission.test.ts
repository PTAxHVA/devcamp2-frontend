import { describe, expect, it } from 'vitest'
import { buildAnsweredPayload } from '@/features/quiz/lib/quiz-submission'
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

  it('keeps completed answers and omits unanswered questions at timeout', () => {
    expect(buildAnsweredPayload(questions, { 'mcq-1': 'option-2' })).toEqual([
      { questionId: 'mcq-1', selectedOptionId: 'option-2' },
    ])
  })

  it('returns an empty payload when no question was answered', () => {
    expect(buildAnsweredPayload(questions, {})).toEqual([])
  })
})
