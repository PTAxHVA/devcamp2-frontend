import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { FiX, FiRefreshCw, FiShield, FiBookOpen, FiExternalLink } from 'react-icons/fi'
import { TbSparkles } from 'react-icons/tb'
import toast from 'react-hot-toast'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import { useCooldownTimer } from '@/features/quiz/hooks/use-cooldown-timer'
import { useExplainMistakes } from '@/features/quiz/hooks/use-explain-mistakes'
import { QuestionContent } from '@/features/quiz/components/question-content'
import { isQuestionCorrect, countCorrect } from '@/features/quiz/lib/count-correct'
import { extractApiError } from '@/lib/api-client'

const PASS_THRESHOLD = 80

export function QuizResultFailPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sectionId = searchParams.get('sectionId')
  const topicId = searchParams.get('topicId')
  const roadmapId = searchParams.get('roadmapId')

  const { data, isLoading, isError } = useQuizResult(attemptId ?? '')
  const explain = useExplainMistakes()
  const [showCoach, setShowCoach] = useState(false)

  // Real cooldown from the attempt; null until loaded / when BE sets no cooldown.
  const { formatted, isExpired } = useCooldownTimer(data?.quizAttempt?.cooldownUntil ?? null)

  const handleToggleCoach = () => {
    if (!showCoach) {
      setShowCoach(true)
      if (!explain.data && !explain.isPending) {
        explain.mutate(attemptId ?? '', {
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
    } else {
      setShowCoach(false)
    }
  }

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
    <div className="animate-in fade-in mx-auto w-full max-w-7xl p-6 duration-500">
      {/* Header with Fail Status & Score Metrics Row */}
      <div className="mb-8 flex flex-col justify-between gap-6 border-b pb-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <div className="bg-bg-card flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-red-100 text-red-500 shadow-sm">
            <FiX className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-text-primary text-3xl font-extrabold tracking-tight">
              Quiz failed
            </h1>
            <p className="text-text-muted mt-1 font-medium">
              Keep going! Review your answers below and try again—you're improving.
            </p>
          </div>
        </div>

        {/* Score Card Card aligned to right on desktop */}
        <div className="border-border-soft bg-bg-card flex shrink-0 items-center gap-6 rounded-2xl border p-4 shadow-sm">
          <div className="flex flex-col justify-center">
            <p className="text-text-placeholder text-[10px] font-bold tracking-wider uppercase">
              Your score
            </p>
            <p className="mt-0.5 text-3xl font-black text-red-500">{score}%</p>
            <p className="text-text-muted mt-1 text-[11px] font-medium">
              {correct} / {total} correct
            </p>
          </div>
          <div className="border-border-soft my-2 self-stretch border-l"></div>
          <div className="flex flex-col justify-center pl-6">
            <p className="text-text-placeholder text-[10px] font-bold tracking-wider uppercase">
              Passing score
            </p>
            <p className="text-text-primary mt-0.5 text-3xl font-black">{PASS_THRESHOLD}%</p>
            <p className="text-text-muted mt-1 text-[11px] font-medium">{gap}% away</p>
          </div>
        </div>
      </div>

      {/* Main Container splits into main comparison area (left) and floating panel (right) */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Main Area: Review & Coach */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-text-primary text-xl font-bold">Review your answers</h3>
            {showCoach && (
              <h3 className="hidden text-xl font-bold text-indigo-600 md:block">
                Mistake Coach Feedback
              </h3>
            )}
          </div>

          <div className="space-y-4">
            {data.questions.map((q, i) => {
              const isMcq = q.type === 'MULTIPLE_CHOICE'
              const correct = isQuestionCorrect(q)
              const chosen = q.options?.find((o) => o._id === q.userAnswer?.selectedOptionId)
              const answerText = isMcq ? chosen?.content : q.userAnswer?.userInput

              // Find corresponding AI explanation
              const explanation = explain.data?.explanations.find((e) => e.questionId === q._id)

              return (
                <div
                  key={q._id}
                  className={`bg-bg-card rounded-2xl border p-6 shadow-sm transition-all duration-200 ${
                    showCoach ? 'grid grid-cols-1 gap-6 md:grid-cols-2' : 'block'
                  }`}
                >
                  {/* Left Column/Span: Answer Review */}
                  <div
                    className={`space-y-3 ${showCoach ? 'md:border-border-soft md:border-r md:pr-6' : ''}`}
                  >
                    <div className="text-text-primary text-base leading-relaxed font-bold">
                      Q{i + 1}. <QuestionContent text={q.content} />
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        correct
                          ? 'border border-green-200 bg-green-50 text-green-700'
                          : 'border border-red-200 bg-red-50 text-red-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${correct ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                      {correct ? 'Correct' : 'Incorrect'}
                    </div>

                    <div className="text-text-secondary text-sm font-medium">
                      <span className="text-text-placeholder">Your Answer:</span>{' '}
                      {answerText ? (
                        <span className="text-text-primary font-semibold">
                          "{isMcq ? <QuestionContent text={answerText} /> : answerText}"
                        </span>
                      ) : (
                        <span className="text-text-muted italic">Not answered</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column/Span: Coach Explanation (visible only when enabled) */}
                  {showCoach && (
                    <div className="space-y-3">
                      {explain.isPending && (
                        <div className="animate-pulse space-y-2 py-2">
                          <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                          <div className="h-4 w-5/6 rounded bg-slate-200"></div>
                          <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                        </div>
                      )}

                      {explain.isError && (
                        <div className="py-2 text-sm font-medium text-red-500">
                          Failed to load explanation for this question.
                        </div>
                      )}

                      {explanation && (
                        <div className="animate-fade-in space-y-3">
                          <div>
                            <p className="text-text-placeholder text-[10px] font-bold tracking-wider uppercase">
                              Why it was incorrect
                            </p>
                            <div className="text-text-secondary mt-1 text-sm leading-relaxed font-medium">
                              <QuestionContent text={explanation.why} />
                            </div>
                          </div>

                          <div className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                            <FiBookOpen className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                            <div>
                              <p className="text-[10px] font-bold tracking-wider text-indigo-800 uppercase">
                                Recommended Review
                              </p>
                              <div className="mt-0.5 text-xs leading-relaxed font-medium text-indigo-900">
                                <QuestionContent text={explanation.reviewHint} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!explain.isPending && !explain.isError && !explanation && (
                        <div className="text-text-muted py-2 text-sm italic">
                          {correct
                            ? 'No explanation needed (Question answered correctly).'
                            : 'No explanation available.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Curated Resources Section */}
          {showCoach && explain.data && explain.data.resources.length > 0 && (
            <div className="bg-bg-card animate-fade-in mt-8 rounded-2xl border p-6 shadow-sm">
              <p className="text-text-placeholder mb-3 text-xs font-bold tracking-wider uppercase">
                Curated resources for this section
              </p>
              <ul className="flex flex-wrap gap-2">
                {explain.data.resources
                  .filter((r) => /^https?:\/\//i.test(r.url))
                  .map((r) => (
                    <li key={`${r.title}|${r.url}`}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-border-soft bg-bg-card text-text-secondary focus-visible:ring-brand-purple-300 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors duration-200 hover:border-indigo-300 hover:text-indigo-700 focus-visible:ring-2 focus-visible:outline-none"
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

        {/* Sidebar Panel */}
        <div className="w-full shrink-0 space-y-6 lg:w-80">
          {/* Reassurance Banner */}
          <div className="border-border-soft bg-bg-card flex items-start gap-4 rounded-2xl border p-5 shadow-sm">
            <div className="mt-1 shrink-0 rounded-full bg-green-50 p-2 text-green-600">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary font-bold">Don't worry</p>
              <p className="text-text-muted mt-1 text-sm leading-relaxed font-medium">
                Your attempt was recorded. Review the questions and retry when you're ready.
              </p>
            </div>
          </div>

          {/* Enable/Disable Coach Toggle Button */}
          <div className="bg-bg-card space-y-3 rounded-2xl border p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <TbSparkles className="h-5 w-5 animate-pulse text-indigo-600" />
              <h4 className="text-text-primary font-bold">AI Mistake Coach</h4>
            </div>
            <p className="text-text-muted text-xs leading-relaxed font-medium">
              Understand why your answers were incorrect and get guided review tips tailored to your
              performance.
            </p>
            <button
              onClick={handleToggleCoach}
              disabled={explain.isPending}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 focus-visible:ring-2 ${
                showCoach
                  ? 'bg-border-soft text-text-secondary hover:bg-bg-section border'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {explain.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Generating Feedback...
                </>
              ) : showCoach ? (
                'Hide Coach Feedback'
              ) : (
                'Enable AI Coach'
              )}
            </button>
          </div>

          {/* Retry & Back Buttons stacked */}
          <div className="bg-bg-card space-y-3 rounded-2xl border p-5 shadow-sm">
            <button
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 focus-visible:ring-2 ${
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
              <FiRefreshCw className="h-4 w-4" />
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
              className="border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors duration-200 focus-visible:ring-2"
            >
              Back to topic
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
