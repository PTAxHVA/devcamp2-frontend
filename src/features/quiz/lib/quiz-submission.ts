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

/**
 * The submit endpoint requires at least one answer. On timeout we submit at most
 * one answer so the server closes and grades the attempt as failed, including
 * when the learner did not select anything. This gives the fail page a canonical
 * result and lets the normal retry/cooldown flow start a fresh attempt.
 */
export function buildTimedOutPayload(
  questions: SessionQuestion[],
  answers: Record<string, string>,
): SubmitAnswer[] {
  const answered = buildAnsweredPayload(questions, answers)
  if (answered.length > 0) return answered.slice(0, 1)

  const fillQuestion = questions.find((question) => question.type === 'fill')
  if (fillQuestion) {
    return [
      {
        questionId: fillQuestion.id,
        userInput: '__QUIZ_TIME_EXPIRED_WITHOUT_ANSWER__',
      },
    ]
  }

  const mcqQuestion = questions.find(
    (question) => question.type === 'mcq' && question.options?.length,
  )
  const firstOption = mcqQuestion?.options?.[0]

  return mcqQuestion && firstOption
    ? [{ questionId: mcqQuestion.id, selectedOptionId: firstOption.id }]
    : []
}
