import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { McqQuestion } from '@/features/quiz/components/mcq-question'
import { FillQuestion } from '@/features/quiz/components/fill-question'
import { useQuizStore } from '@/features/quiz/quiz-store'
import { useQuizAttempt } from '@/features/quiz/hooks/use-quiz-attempt'
import { useSubmitQuiz, type SubmitQuizResult } from '@/features/quiz/hooks/use-submit-quiz'
import toast from 'react-hot-toast'
import {
  HiMiniArrowLeft,
  HiMiniArrowRight,
  HiMiniPaperAirplane,
  HiOutlineLightBulb,
} from 'react-icons/hi2'

export function QuizAttemptPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()

  const { isLoading: attemptLoading, error: attemptError } = useQuizAttempt(quizId ?? '')

  const { attemptId, questions, currentIndex, answers, setAnswer, next, prev, reset } =
    useQuizStore()

  const submitMutation = useSubmitQuiz(attemptId ?? '')

  // Clean up store when leaving the quiz page
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // Surface start-attempt errors as a toast (side effect, never during render)
  useEffect(() => {
    if (!attemptError) return
    const axiosErr = attemptError as { response?: { data?: { error?: { code?: string } } } }
    const code = axiosErr?.response?.data?.error?.code
    if (code === 'QUIZ_ALREADY_STARTED') {
      toast.error('A quiz attempt is already in progress.')
    } else if (code === 'COOLDOWN_ACTIVE') {
      toast.error('You are in a cooldown period. Please try again later.')
    } else {
      toast.error('Failed to start the quiz.')
    }
  }, [attemptError])

  if (attemptLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (attemptError || !quizId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-error text-lg font-semibold">Failed to start the quiz.</p>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    )
  }

  if (questions.length === 0) return null

  const currentQuestion = questions[currentIndex]
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = currentIndex === questions.length - 1

  const handleAnswer = (val: string) => {
    setAnswer(currentQuestion.id, val)
  }

  const handleSubmit = () => {
    if (!attemptId) return

    const submitAnswers = questions
      .filter((q) => answers[q.id] !== undefined && answers[q.id] !== '')
      .map((q) => {
        const value = answers[q.id]!
        if (q.type === 'mcq') {
          return { questionId: q.id, selectedOptionId: value }
        }
        return { questionId: q.id, userInput: value }
      })

    if (submitAnswers.length === 0) {
      toast.error('Please answer at least 1 question before submitting.')
      return
    }

    submitMutation.mutate(submitAnswers, {
      onSuccess: (result: SubmitQuizResult) => {
        if (result.isPassed) {
          navigate(`/quizzes/${result.quizAttemptId}/result/pass`)
        } else {
          navigate(`/quizzes/${result.quizAttemptId}/result/fail`)
        }
      },
    })
  }

  return (
    <div className="bg-base-200/50 flex min-h-screen flex-col items-center px-4 py-12">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="space-y-4">
          <div className="text-base-content/70 flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-2">
              <HiOutlineLightBulb className="text-warning h-5 w-5 animate-pulse" />
              Question {currentIndex + 1} / {questions.length}
            </span>
            <span className="font-mono text-xs opacity-60">Quiz ID: {quizId}</span>
          </div>
          <progress
            className="progress progress-primary h-3 w-full transition-all duration-500"
            value={currentIndex + 1}
            max={questions.length}
          ></progress>
        </div>

        <div key={currentQuestion.id} className="card bg-base-100 border-base-200 border shadow-xl">
          <div className="card-body min-h-[300px] p-8">
            {currentQuestion.type === 'mcq' ? (
              <McqQuestion
                question={currentQuestion}
                selectedId={answers[currentQuestion.id]}
                onSelect={handleAnswer}
              />
            ) : (
              <FillQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id] ?? ''}
                onChange={handleAnswer}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            className="btn btn-ghost hover:bg-base-200"
            onClick={prev}
            disabled={isFirstQuestion}
          >
            <HiMiniArrowLeft className="h-5 w-5" /> Previous
          </button>

          {isLastQuestion ? (
            <button
              className="btn btn-primary hover:shadow-primary/50 px-8 shadow-lg transition-all active:scale-95"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Submit <HiMiniPaperAirplane className="h-5 w-5" />
                </>
              )}
            </button>
          ) : (
            <button
              className="btn btn-primary px-8 shadow-md transition-all active:scale-95"
              onClick={next}
            >
              Next <HiMiniArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
