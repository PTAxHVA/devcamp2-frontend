import { useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import { AnswerReview } from '@/features/quiz/components/answer-review'
import { MistakeCoach } from '@/features/quiz/components/mistake-coach'
import { countCorrect } from '@/features/quiz/lib/count-correct'
import { useTopicDetail } from '@/features/topic/hooks/use-topic-detail'
import {
  buildPassportNudge,
  hasNudgedAttempt,
  markNudgedAttempt,
} from '@/features/passport/lib/passport-share'

const PASS_THRESHOLD = 80

export function QuizResultPassPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('topicId')
  const roadmapId = searchParams.get('roadmapId')
  const { data, isLoading, isError } = useQuizResult(attemptId ?? '')

  // Passport nudge: one toast per pass inviting the learner to share the skill
  // they just verified. Waits for the topic name when a topicId is available,
  // but never blocks on it (generic copy if the lookup errors or is absent).
  // Guarded per attempt in sessionStorage so reopening this URL doesn't re-toast.
  const topicDetail = useTopicDetail(topicId ?? '')
  const hasNudged = useRef(false)
  useEffect(() => {
    if (hasNudged.current || !data || !attemptId) return
    if (topicId && topicDetail.isLoading) return
    if (hasNudgedAttempt(attemptId)) return
    hasNudged.current = true
    markNudgedAttempt(attemptId)
    toast(
      (t) => (
        <span className="text-sm">
          {buildPassportNudge(topicDetail.data?.name)}{' '}
          <button
            type="button"
            className="text-brand-purple-600 font-bold underline"
            onClick={() => {
              toast.dismiss(t.id)
              navigate('/passport')
            }}
          >
            Share your Passport
          </button>
        </span>
      ),
      { icon: '🎖️', duration: 8000, id: 'passport-nudge' },
    )
  }, [attemptId, data, topicId, topicDetail.isLoading, topicDetail.data?.name, navigate])

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
          className="border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section mt-4 rounded-xl border px-5 py-2 text-sm font-bold"
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
        <div className="bg-bg-card relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-100 text-indigo-600 shadow-lg">
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-50 opacity-75 duration-1000"></div>
          <FiCheck className="relative z-10 h-12 w-12" />
        </div>
        <h1 className="text-text-primary text-4xl font-black tracking-tight">
          Great job! You passed!
        </h1>
        <p className="text-text-muted mt-3 text-lg font-medium">
          You've completed this section and are one step closer to your goal.
        </p>

        <div className="bg-bg-card mt-10 flex gap-16 rounded-3xl border p-6 shadow-sm">
          <div className="text-center">
            <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
              Your score
            </p>
            <p className="text-text-primary mt-2 text-4xl font-black">{score}%</p>
            <p className="text-text-muted mt-1 text-sm font-medium">
              {correct} / {total} correct
            </p>
          </div>
          <div className="border-r border-l px-16 text-center">
            <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
              Result
            </p>
            <p className="mt-2 text-4xl font-black text-indigo-600">Pass</p>
            <p className="mt-1 text-sm font-medium text-indigo-600/70">Well done!</p>
          </div>
          <div className="text-center">
            <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
              Passing score
            </p>
            <p className="text-text-primary mt-2 text-4xl font-black">{PASS_THRESHOLD}%</p>
            <p className="text-text-muted mt-1 text-sm font-medium">
              {score > PASS_THRESHOLD ? 'Exceeded target' : 'Target reached'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-3xl border p-8 shadow-sm">
        <h3 className="text-text-primary mb-6 text-lg font-bold">Review your answers</h3>
        <AnswerReview questions={data.questions} />
      </div>

      {/* Only when this pass still has missed questions (e.g. an 80% pass). */}
      {correct < total && (
        <div className="mt-8">
          <MistakeCoach attemptId={data.quizAttempt.attemptId} questions={data.questions} />
        </div>
      )}

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
