import type { ResultQuestion } from '@/features/quiz/hooks/use-quiz-result'
import { isQuestionCorrect } from '@/features/quiz/lib/count-correct'
import { QuestionContent } from '@/features/quiz/components/question-content'

/**
 * Per-question review of a submitted attempt. Both MCQ and fill-in-blank answers
 * are graded green/red from the server verdict (`userAnswer.isCorrect`).
 */
export function AnswerReview({ questions }: { questions: ResultQuestion[] }) {
  if (questions.length === 0) {
    return <p className="text-text-muted text-sm">No answers to review.</p>
  }

  return (
    <ul className="space-y-3">
      {questions.map((q, i) => {
        const isMcq = q.type === 'MULTIPLE_CHOICE'
        const correct = isQuestionCorrect(q)
        const chosen = q.options?.find((o) => o._id === q.userAnswer?.selectedOptionId)
        const answerText = isMcq ? chosen?.content : q.userAnswer?.userInput

        const tone = correct ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'
        const label = correct ? 'text-green-700' : 'text-red-600'

        return (
          <li key={q._id} className={`rounded-xl border p-4 ${tone}`}>
            <div className="text-text-primary font-semibold break-words">
              Q{i + 1}. <QuestionContent text={q.content} />
            </div>
            <div className={`mt-1 text-sm font-medium break-words ${label}`}>
              {correct ? 'Correct' : 'Incorrect'}
              {answerText ? (
                <>
                  {' — "'}
                  <QuestionContent text={answerText} />
                  {'"'}
                </>
              ) : (
                ' — not answered'
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
