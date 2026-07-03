import type { ResultQuestion } from '@/features/quiz/hooks/use-quiz-result'

/**
 * Per-question review of a submitted attempt. MCQ answers are graded green/red
 * from the result payload; fill-in answers are shown neutral (graded server-side).
 */
export function AnswerReview({ questions }: { questions: ResultQuestion[] }) {
  if (questions.length === 0) {
    return <p className="text-sm text-slate-500">No answers to review.</p>
  }

  return (
    <ul className="space-y-3">
      {questions.map((q, i) => {
        const isMcq = q.type === 'MULTIPLE_CHOICE'
        const correct = q.userAnswer?.isCorrect ?? false
        const chosen = q.options?.find((o) => o._id === q.userAnswer?.selectedOptionId)
        const answerText = isMcq ? chosen?.content : q.userAnswer?.userInput

        const tone = correct ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'
        const label = correct ? 'text-green-700' : 'text-red-600'

        return (
          <li key={q._id} className={`rounded-xl border p-4 ${tone}`}>
            <p className="font-semibold text-slate-800">
              Q{i + 1}. {q.content}
            </p>
            <p className={`mt-1 text-sm font-medium ${label}`}>
              {correct ? 'Correct' : 'Incorrect'}
              {answerText ? ` — "${answerText}"` : ' — not answered'}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
