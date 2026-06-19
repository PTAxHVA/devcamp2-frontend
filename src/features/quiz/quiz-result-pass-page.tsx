import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import toast from 'react-hot-toast'
import { FiCheckCircle } from 'react-icons/fi'

export function QuizResultPassPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuizResult(attemptId ?? '')

  // Toast on load failure as a side effect, never during render.
  useEffect(() => {
    if (isError) toast.error('Could not load quiz result. Please try again.')
  }, [isError])

  if (!attemptId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <p className="text-error font-semibold">Invalid result link — no attempt ID found.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <p className="text-error font-semibold">Failed to load result.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    )
  }

  const { quizAttempt, questions } = data

  return (
    <div className="animate-fade-in mx-auto max-w-2xl p-6">
      <div className="card border border-green-200 bg-green-50 shadow-xl transition-all duration-500 hover:shadow-2xl">
        <div className="card-body items-center text-center">
          <FiCheckCircle className="h-20 w-20 animate-bounce text-green-500" />
          <h2 className="card-title mt-4 text-3xl font-bold text-green-700">You passed!</h2>
          <p className="mt-2 text-xl font-semibold">Score: {quizAttempt.score}%</p>
          <div className="card-actions mt-6">
            <button
              className="btn btn-primary transition-transform hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              Learn Next Section
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="mb-4 text-xl font-bold">Review Answers</h3>
        {questions.map((q, i) => {
          const selectedId = q.userAnswer?.selectedOptionId
          const userInput = q.userAnswer?.userInput
          const correctOption = q.options?.find((o) => o.isCorrect)
          const chosen = q.options?.find((o) => o._id === selectedId)
          const isCorrect =
            q.type === 'MULTIPLE_CHOICE' ? selectedId === correctOption?._id : undefined

          return (
            <div key={q._id} className="bg-base-100 border-base-200 rounded-lg border p-4 shadow">
              <p className="font-semibold">
                Question {i + 1}: {q.content}
              </p>
              {q.type === 'MULTIPLE_CHOICE' && (
                <p className={`mt-2 text-sm ${isCorrect ? 'text-success' : 'text-error'}`}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                  {chosen ? ` — your answer: "${chosen.content}"` : ''}
                </p>
              )}
              {q.type === 'FILL_IN_BLANK' && userInput !== undefined && (
                <p className="text-base-content/70 mt-2 text-sm">Your answer: "{userInput}"</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
