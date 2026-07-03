import { useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { FiClock, FiZap } from 'react-icons/fi'
import { HiMiniArrowLeft, HiMiniArrowRight, HiMiniPaperAirplane } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { McqQuestion } from '@/features/quiz/components/mcq-question'
import { FillQuestion } from '@/features/quiz/components/fill-question'
import { useQuizStore } from '@/features/quiz/quiz-store'
import { useQuizAttempt } from '@/features/quiz/hooks/use-quiz-attempt'
import { useSubmitQuiz } from '@/features/quiz/hooks/use-submit-quiz'
import { useQuizTimer } from '@/features/quiz/hooks/use-quiz-timer'
import { buildAnsweredPayload } from '@/features/quiz/lib/quiz-submission'

// Section quizzes require >=80% to pass (product spec).
const PASS_THRESHOLD = 80
// Client-side time budget. When it expires, the current answers are submitted.
const QUIZ_DURATION_SECONDS = 10 * 60

export function QuizAttemptPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sectionId = searchParams.get('sectionId')
  const topicId = searchParams.get('topicId')
  const roadmapId = searchParams.get('roadmapId')
  // Only include context params that are present so result/back URLs stay
  // clean (no `?sectionId=&topicId=`); missing params fall back downstream.
  const ctxParams = new URLSearchParams()
  if (sectionId) ctxParams.set('sectionId', sectionId)
  if (topicId) ctxParams.set('topicId', topicId)
  if (roadmapId) ctxParams.set('roadmapId', roadmapId)
  const queryParamsStr = ctxParams.toString() ? `?${ctxParams.toString()}` : ''

  const { isLoading, error } = useQuizAttempt(quizId ?? '')
  const { attemptId, startedAt, questions, currentIndex, answers, setAnswer, next, prev, reset } =
    useQuizStore()
  const { mutate: submitQuiz, isPending: isSubmitPending } = useSubmitQuiz(attemptId ?? '')
  const isQuizReady = !isLoading && !error && !!quizId && !!attemptId && questions.length > 0
  const { formatted, isUrgent, isExpired } = useQuizTimer(
    QUIZ_DURATION_SECONDS,
    isQuizReady && !isSubmitPending,
    startedAt,
  )
  const autoSubmittedAttemptId = useRef<string | null>(null)
  const submissionInFlight = useRef(false)
  const timeoutToastAttemptId = useRef<string | null>(null)

  // Clear the session on unmount so a stale attempt never bleeds into the next quiz.
  useEffect(() => reset, [reset])

  const buildPayload = useCallback(
    () => buildAnsweredPayload(questions, answers),
    [answers, questions],
  )

  const submitAttempt = useCallback(
    ({ isTimedOut = false } = {}) => {
      if (!attemptId || submissionInFlight.current) return false
      if (isTimedOut && typeof navigator !== 'undefined' && !navigator.onLine) return false

      const payload = buildPayload()

      if (!isTimedOut && payload.length === 0) {
        toast.error('Please answer at least one question before submitting.')
        return false
      }

      if (isTimedOut && timeoutToastAttemptId.current !== attemptId) {
        timeoutToastAttemptId.current = attemptId
        toast("Time's up. Submitting your quiz now.")
      }

      submissionInFlight.current = true
      submitQuiz(payload, {
        onError: () => {
          if (isTimedOut && autoSubmittedAttemptId.current === attemptId) {
            autoSubmittedAttemptId.current = null
          }
        },
        onSettled: () => {
          submissionInFlight.current = false
        },
        onSuccess: (result) =>
          navigate(
            `/quizzes/${result.quizAttemptId}/result/${result.isPassed ? 'pass' : 'fail'}${queryParamsStr}`,
          ),
      })
      return true
    },
    [attemptId, buildPayload, navigate, submitQuiz, queryParamsStr],
  )

  const autoSubmit = useCallback(() => {
    if (!isExpired || !isQuizReady || !attemptId) return
    if (autoSubmittedAttemptId.current === attemptId) return

    autoSubmittedAttemptId.current = attemptId
    if (!submitAttempt({ isTimedOut: true })) {
      autoSubmittedAttemptId.current = null
    }
  }, [attemptId, isExpired, isQuizReady, submitAttempt])

  useEffect(() => autoSubmit(), [autoSubmit])

  useEffect(() => {
    const resumeAutoSubmit = () => {
      if (document.visibilityState === 'hidden' || submissionInFlight.current) return
      autoSubmittedAttemptId.current = null
      autoSubmit()
    }

    window.addEventListener('online', resumeAutoSubmit)
    window.addEventListener('focus', resumeAutoSubmit)
    document.addEventListener('visibilitychange', resumeAutoSubmit)

    return () => {
      window.removeEventListener('online', resumeAutoSubmit)
      window.removeEventListener('focus', resumeAutoSubmit)
      document.removeEventListener('visibilitychange', resumeAutoSubmit)
    }
  }, [autoSubmit])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-32">
        <span className="loading loading-spinner loading-lg text-indigo-600" />
      </div>
    )
  }

  if (error || !quizId || questions.length === 0) {
    return (
      <div className="mx-auto my-20 max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="text-lg font-bold text-red-600">Unable to load this quiz</p>
        <p className="mt-1 text-sm text-red-500">Please try again.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Go back
        </button>
      </div>
    )
  }

  const total = questions.length
  const current = questions[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1
  const currentAnswer = answers[current.id]

  const handleSubmit = () => {
    if (isExpired) return
    submitAttempt()
  }

  return (
    <div className="fade-in mx-auto flex h-full max-w-7xl flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <button
            onClick={() => {
              if (sectionId && topicId) {
                navigate(
                  `/my-learning/topics/${topicId}/sections/${sectionId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`,
                )
              } else {
                navigate(-1)
              }
            }}
            className="mb-2 flex items-center font-bold text-indigo-600 hover:underline"
          >
            ← Back to lesson
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800">Quiz</h1>
        </div>
        <p className="rounded-full bg-indigo-50 px-4 py-1 font-bold text-indigo-600">
          Question {currentIndex + 1} of {total}
        </p>
      </div>

      <progress
        className="progress progress-primary mb-8 h-2 w-full"
        value={currentIndex + 1}
        max={total}
      ></progress>

      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Question */}
        <div className="col-span-1 flex flex-col lg:col-span-2">
          <div key={current.id} className="flex-1 rounded-2xl border bg-white p-8 shadow-sm">
            {current.type === 'mcq' ? (
              <McqQuestion
                question={current}
                selectedId={currentAnswer}
                onSelect={(val) => setAnswer(current.id, val)}
              />
            ) : (
              <FillQuestion
                question={current}
                value={currentAnswer ?? ''}
                onChange={(val) => setAnswer(current.id, val)}
              />
            )}

            <div className="mt-10 flex items-center justify-between border-t pt-6">
              <button
                onClick={prev}
                disabled={isFirst || isExpired || isSubmitPending}
                className="btn btn-ghost font-bold text-indigo-600 disabled:opacity-40"
              >
                <HiMiniArrowLeft className="h-5 w-5" /> Previous
              </button>
              {isLast ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitPending || isExpired}
                  className="btn h-12 rounded-xl bg-slate-900 px-8 text-white hover:bg-slate-800"
                >
                  {isSubmitPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      Submit answer <HiMiniPaperAirplane className="h-5 w-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={next}
                  disabled={isExpired || isSubmitPending}
                  className="btn h-12 rounded-xl bg-slate-900 px-8 text-white hover:bg-slate-800"
                >
                  Next <HiMiniArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-bold text-slate-800">Quiz summary</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-lg p-2 ${isUrgent ? 'animate-pulse bg-red-100 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}
                >
                  <FiClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    {isExpired ? 'Time expired' : 'Time remaining'}
                  </p>
                  <p
                    className={`text-2xl font-black ${isUrgent ? 'text-red-600' : 'text-slate-800'}`}
                  >
                    {formatted}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-500">
                  <FiZap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Score to pass
                  </p>
                  <p className="text-2xl font-black text-slate-800">{PASS_THRESHOLD}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
