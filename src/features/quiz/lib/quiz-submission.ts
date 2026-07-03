import type { SessionQuestion } from '@/features/quiz/quiz-store'

export type SubmitAnswer =
  | { questionId: string; selectedOptionId: string; userInput?: never }
  | { questionId: string; userInput: string; selectedOptionId?: never }

export function buildAnsweredPayload(
  questions: SessionQuestion[],
  answers: Record<string, string>,
): SubmitAnswer[] {
  return questions.flatMap((question) => {
    const answer = answers[question.id]
    if (answer === undefined || answer === '') return []

    return [
      question.type === 'mcq'
        ? { questionId: question.id, selectedOptionId: answer }
        : { questionId: question.id, userInput: answer },
    ]
  })
}
