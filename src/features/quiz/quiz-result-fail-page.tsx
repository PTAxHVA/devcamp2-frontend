import { useParams, useNavigate } from 'react-router'
import { FiX, FiRefreshCw, FiShield } from 'react-icons/fi'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import { useCooldownTimer } from '@/features/quiz/hooks/use-cooldown-timer'
import { AnswerReview } from '@/features/quiz/components/answer-review'

const PASS_THRESHOLD = 80

export function QuizResultFailPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuizResult(attemptId ?? '')

  // Real cooldown from the attempt; null until loaded / when BE sets no cooldown.
  const { formatted, isExpired } = useCooldownTimer(data?.quizAttempt?.cooldownUntil ?? null)

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <span className="loading loading-spinner loading-lg text-indigo-600" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto my-20 max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Unable to load the result.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const { score, quizId } = data.quizAttempt
  const total = data.questions.length
  const correct = Math.round((score / 100) * total)
  const gap = Math.max(0, PASS_THRESHOLD - score)

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl p-6 duration-500">
      <div className="mb-8 flex items-center gap-5 border-b pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-100 bg-white text-red-500 shadow-sm">
          <FiX className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Quiz failed</h1>
          <p className="mt-1 font-medium text-slate-500">
            Keep going! Review your answers below and try again—you're improving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Your score
              </p>
              <p className="mt-1 text-5xl font-black text-red-500">{score}%</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {correct} / {total} correct
              </p>
            </div>
            <div className="border-l pl-8">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Passing score
              </p>
              <p className="mt-1 text-5xl font-black text-slate-800">{PASS_THRESHOLD}%</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                You're {gap}% away from passing
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-800">Review your answers</h3>
            <AnswerReview questions={data.questions} />
          </div>
        </div>

        <div className="rounded-3xl border bg-slate-50/50 p-8">
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <div className="mt-1 rounded-full bg-green-100 p-2 text-green-600">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">Don't worry</p>
              <p className="font-medium text-slate-500">
                Your attempt was recorded. Review the questions and retry when you're ready.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
            <button
              className={`btn h-14 flex-1 rounded-xl text-base font-bold transition-all ${
                isExpired
                  ? 'border-none bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800'
                  : 'cursor-not-allowed border-none bg-slate-200 text-slate-400'
              }`}
              disabled={!isExpired}
              onClick={() => navigate(`/quizzes/${quizId}/attempt`)}
            >
              <FiRefreshCw className="mr-2 h-5 w-5" />
              {isExpired ? 'Retry quiz' : `Retry in ${formatted}`}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn h-14 flex-1 rounded-xl border-slate-200 bg-white text-base font-bold text-slate-700 hover:bg-slate-50"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
