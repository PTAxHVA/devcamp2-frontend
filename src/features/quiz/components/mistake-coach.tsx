import toast from 'react-hot-toast'
import { FiBookOpen, FiExternalLink } from 'react-icons/fi'
import { TbSparkles } from 'react-icons/tb'
import { extractApiError } from '@/lib/api-client'
import { useExplainMistakes } from '@/features/quiz/hooks/use-explain-mistakes'
import { isQuestionCorrect } from '@/features/quiz/lib/count-correct'
import type { ResultQuestion } from '@/features/quiz/hooks/use-quiz-result'

/** Only http(s) resource links are rendered — never javascript:/data: URLs. */
const isSafeUrl = (url: string) => /^https?:\/\//i.test(url)

interface MistakeCoachProps {
  attemptId: string
  questions: ResultQuestion[]
}

/**
 * On-demand AI review of the questions the learner missed on this attempt.
 * Nothing is called until the learner clicks — grading never depends on it.
 * When Gemini is down the backend degrades to correct answers + curated
 * resources (source: 'fallback'), so the panel always shows something useful.
 */
export function MistakeCoach({ attemptId, questions }: MistakeCoachProps) {
  const explain = useExplainMistakes()
  const wrongCount = questions.filter((q) => !isQuestionCorrect(q)).length
  const questionTextById = new Map(questions.map((q) => [q._id, q.content]))

  // Nothing to coach on a perfect attempt.
  if (wrongCount === 0) return null

  const handleReview = () => {
    explain.mutate(attemptId, {
      onError: (err) => {
        const { code, message } = extractApiError(err)
        toast.error(
          code === 'RATE_LIMITED'
            ? 'The AI is busy — please try again in a minute.'
            : (message ?? 'Could not load the review. Please try again.'),
        )
      },
    })
  }

  const result = explain.data
  const safeResources = result?.resources.filter((r) => isSafeUrl(r.url)) ?? []

  return (
    <div className="bg-bg-card rounded-3xl border p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-text-primary flex items-center gap-2 text-lg font-bold">
            <TbSparkles className="h-5 w-5 text-indigo-600" />
            Mistake Coach
          </h3>
          <p className="text-text-muted mt-1 text-sm font-medium">
            Get a short explanation of why each missed question went wrong and what to review.
          </p>
        </div>
        {!result && (
          <button
            type="button"
            onClick={handleReview}
            disabled={explain.isPending}
            className="btn disabled:bg-border-soft disabled:text-text-placeholder h-12 shrink-0 rounded-xl border-none bg-indigo-600 px-6 font-bold text-white hover:bg-indigo-700"
          >
            {explain.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Reviewing…
              </>
            ) : (
              `Review my mistakes (${wrongCount})`
            )}
          </button>
        )}
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {result.source === 'fallback' && result.explanations.length > 0 && (
            <p className="bg-bg-section text-text-secondary inline-block rounded-full px-3 py-1 text-xs font-semibold">
              AI is busy right now — showing the correct answers and curated resources instead.
            </p>
          )}

          <ul className="space-y-3">
            {result.explanations.map((e, i) => (
              <li
                key={e.questionId}
                className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4"
              >
                <p className="text-text-primary font-semibold">
                  {questionTextById.get(e.questionId) ?? `Question ${i + 1}`}
                </p>
                <p className="text-text-secondary mt-2 text-sm font-medium">{e.why}</p>
                <p className="mt-1 text-sm font-medium text-indigo-700">
                  <FiBookOpen className="mr-1 inline h-4 w-4" />
                  {e.reviewHint}
                </p>
              </li>
            ))}
          </ul>

          {safeResources.length > 0 && (
            <div>
              <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
                Curated resources for this section
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {safeResources.map((r) => (
                  <li key={`${r.title}|${r.url}`}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border-soft bg-bg-card text-text-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold hover:border-indigo-300 hover:text-indigo-700"
                    >
                      {r.title}
                      <FiExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
