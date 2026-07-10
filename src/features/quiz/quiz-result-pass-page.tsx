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
  isTopicFullyVerified,
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

  // Passport nudge: show only when this pass leaves the whole topic verified,
  // matching the Passport/dashboard completed-topic rule.
  const topicDetail = useTopicDetail(topicId ?? '')
  const topicData = topicDetail.data
  const isTopicDetailLoading = topicDetail.isLoading
  const isTopicDetailFetching = topicDetail.isFetching
  const hasNudged = useRef(false)
  useEffect(() => {
    if (hasNudged.current || !data || !attemptId || !topicId) return
    if (isTopicDetailLoading || isTopicDetailFetching) return
    if (!topicData || !isTopicFullyVerified(topicData)) return
    if (hasNudgedAttempt(attemptId)) return
    hasNudged.current = true
    markNudgedAttempt(attemptId)
    toast(
      (t) => (
        <span className="text-sm">
          {buildPassportNudge(topicData.name)}{' '}
          <button
            type="button"
            className="text-brand-purple-600 hover:text-brand-purple-700 focus-visible:ring-brand-purple-300 font-bold underline transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
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
  }, [attemptId, data, isTopicDetailFetching, isTopicDetailLoading, navigate, topicData, topicId])

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

  const { score } = data.quizAttempt
  const total = data.questions.length
  const correct = countCorrect(data.questions)

  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto w-full max-w-5xl p-4 duration-500 sm:p-6">
      <div className="mb-8 flex flex-col items-center border-b pb-8 text-center sm:mb-10 sm:pb-10">
        <div className="bg-bg-card relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-100 text-indigo-600 shadow-lg sm:h-24 sm:w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-50 opacity-75 duration-1000"></div>
          <FiCheck className="relative z-10 h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <h1 className="text-text-primary text-3xl font-black tracking-tight sm:text-4xl">
          Great job! You passed!
        </h1>
        <p className="text-text-muted mt-3 max-w-xl text-base font-medium sm:text-lg">
          You've completed this section and are one step closer to your goal.
        </p>

        <div className="bg-bg-card mt-8 flex w-full flex-col rounded-3xl border p-4 shadow-sm sm:mt-10 sm:w-auto sm:flex-row sm:gap-10 sm:p-6 md:gap-16">
          <div className="text-center">
            <p className="text-text-placeholder text-xs font-bold tracking-wider uppercase">
              Your score
            </p>
            <p className="text-text-primary mt-2 text-4xl font-black">{score}%</p>
            <p className="text-text-muted mt-1 text-sm font-medium">
              {correct} / {total} correct
            </p>
          </div>
          <div className="my-4 border-y py-4 text-center sm:my-0 sm:border-y-0 sm:border-r sm:border-l sm:px-10 sm:py-0 md:px-16">
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

      <div className="bg-bg-card rounded-3xl border p-4 shadow-sm sm:p-8">
        <h3 className="text-text-primary mb-6 text-lg font-bold">Review your answers</h3>
        <AnswerReview questions={data.questions} />
      </div>

      {/* Only when this pass still has missed questions (e.g. an 80% pass). */}
      {correct < total && (
        <div className="mt-8">
          <MistakeCoach attemptId={data.quizAttempt.attemptId} questions={data.questions} />
        </div>
      )}

      <div className="mt-10 flex justify-stretch sm:justify-end">
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
          className="btn focus-visible:ring-brand-purple-300 h-14 w-full rounded-xl bg-slate-900 px-10 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:ring-2 sm:w-auto"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
