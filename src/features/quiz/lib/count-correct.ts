import type { ResultQuestion } from '@/features/quiz/hooks/use-quiz-result'

/**
 * Whether a reviewed question was answered correctly. Prefers the server verdict
 * (`userAnswer.isCorrect`, stored for MCQ + fill-in-blank); falls back to the
 * chosen-vs-correct option compare for MCQ if the verdict is ever absent.
 */
export function isQuestionCorrect(q: ResultQuestion): boolean {
  if (typeof q.userAnswer?.isCorrect === 'boolean') return q.userAnswer.isCorrect
  const correctOption = q.options?.find((o) => o.isCorrect)
  return !!correctOption && q.userAnswer?.selectedOptionId === correctOption._id
}

/**
 * Real number of correct answers — counted from per-question verdicts, not
 * reconstructed as round(score/100 * total) (NEW-8).
 */
export function countCorrect(questions: ResultQuestion[]): number {
  return questions.filter(isQuestionCorrect).length
}
