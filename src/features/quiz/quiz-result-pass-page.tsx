import { useParams, useNavigate, useSearchParams } from 'react-router'
import { FiCheck } from 'react-icons/fi'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import { AnswerReview } from '@/features/quiz/components/answer-review'
import { countCorrect } from '@/features/quiz/lib/count-correct'

const PASS_THRESHOLD = 80

export function QuizResultPassPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('topicId')
  const roadmapId = searchParams.get('roadmapId')
  const { data, isLoading, isError } = useQuizResult(attemptId ?? '')

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

  const { score } = data.quizAttempt
  const total = data.questions.length
  const correct = countCorrect(data.questions)

  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto max-w-5xl p-6 duration-500">
      <div className="mb-10 flex flex-col items-center border-b pb-10 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-100 bg-white text-indigo-600 shadow-lg">
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-50 opacity-75 duration-1000"></div>
          <FiCheck className="relative z-10 h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800">
          Great job! You passed!
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-500">
          You've completed this section and are one step closer to your goal.
        </p>

        <div className="mt-10 flex gap-16 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Your score</p>
            <p className="mt-2 text-4xl font-black text-slate-800">{score}%</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {correct} / {total} correct
            </p>
          </div>
          <div className="border-r border-l px-16 text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Result</p>
            <p className="mt-2 text-4xl font-black text-indigo-600">Pass</p>
            <p className="mt-1 text-sm font-medium text-indigo-600/70">Well done!</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Passing score
            </p>
            <p className="mt-2 text-4xl font-black text-slate-800">{PASS_THRESHOLD}%</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {score > PASS_THRESHOLD ? 'Exceeded target' : 'Target reached'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-slate-800">Review your answers</h3>
        <AnswerReview questions={data.questions} />
      </div>

      <div className="mt-10 flex justify-end">
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
          className="btn h-14 rounded-xl bg-slate-900 px-10 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
