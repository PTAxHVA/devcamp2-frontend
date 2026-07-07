import { useParams, useNavigate, useSearchParams } from 'react-router'
import { FiX, FiRefreshCw, FiShield } from 'react-icons/fi'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import { useCooldownTimer } from '@/features/quiz/hooks/use-cooldown-timer'
import { AnswerReview } from '@/features/quiz/components/answer-review'
import { MistakeCoach } from '@/features/quiz/components/mistake-coach'
import { countCorrect } from '@/features/quiz/lib/count-correct'

const PASS_THRESHOLD = 80

export function QuizResultFailPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sectionId = searchParams.get('sectionId')
  const topicId = searchParams.get('topicId')
  const roadmapId = searchParams.get('roadmapId')
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
          className="border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 mt-4 rounded-xl border px-5 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const { score, quizId } = data.quizAttempt
  const total = data.questions.length
  const correct = countCorrect(data.questions)
  const gap = Math.max(0, PASS_THRESHOLD - score)

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl p-6 duration-500">
      <div className="mb-8 flex items-center gap-5 border-b pb-6">
        <div className="bg-bg-card flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-100 text-red-500 shadow-sm">
          <FiX className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-text-primary text-3xl font-extrabold tracking-tight">Quiz failed</h1>
          <p className="text-text-muted mt-1 font-medium">
            Keep going! Review your answers below and try again—you're improving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="bg-bg-card flex items-center justify-between rounded-2xl border p-6 shadow-sm">
            <div>
              <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
                Your score
              </p>
              <p className="mt-1 text-5xl font-black text-red-500">{score}%</p>
              <p className="text-text-muted mt-2 text-sm font-medium">
                {correct} / {total} correct
              </p>
            </div>
            <div className="border-l pl-8">
              <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
                Passing score
              </p>
              <p className="text-text-primary mt-1 text-5xl font-black">{PASS_THRESHOLD}%</p>
              <p className="text-text-muted mt-2 text-sm font-medium">
                You're {gap}% away from passing
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-text-primary mb-4 text-lg font-bold">Review your answers</h3>
            <AnswerReview questions={data.questions} />
          </div>

          <MistakeCoach attemptId={data.quizAttempt.attemptId} questions={data.questions} />
        </div>

        <div className="bg-bg-section/50 rounded-3xl border p-8">
          <div className="bg-bg-card mb-8 flex items-start gap-4 rounded-2xl border border-green-200 p-5 shadow-sm">
            <div className="mt-1 rounded-full bg-green-100 p-2 text-green-600">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary text-lg font-bold">Don't worry</p>
              <p className="text-text-muted font-medium">
                Your attempt was recorded. Review the questions and retry when you're ready.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
            <button
              className={`btn focus-visible:ring-brand-purple-300 h-14 flex-1 rounded-xl text-base font-bold transition-all duration-200 focus-visible:ring-2 ${
                isExpired
                  ? 'border-none bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800'
                  : 'bg-border-soft text-text-placeholder cursor-not-allowed border-none'
              }`}
              disabled={!isExpired}
              onClick={() => {
                const q = `?sectionId=${sectionId || ''}&topicId=${topicId || ''}${roadmapId ? `&roadmapId=${roadmapId}` : ''}`
                navigate(`/quizzes/${quizId}/attempt${q}`)
              }}
            >
              <FiRefreshCw className="mr-2 h-5 w-5" />
              {isExpired ? 'Retry quiz' : `Retry in ${formatted}`}
            </button>
            <button
              onClick={() => {
                if (topicId) {
                  navigate(
                    `/my-learning/topics/${topicId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`,
                  )
                } else {
                  navigate('/dashboard')
                }
              }}
              className="btn border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 h-14 flex-1 rounded-xl text-base font-bold transition-colors duration-200 focus-visible:ring-2"
            >
              Back to topic
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
