import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import toast from 'react-hot-toast'
import { FiXCircle, FiRefreshCw } from 'react-icons/fi'

export function QuizResultFailPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuizResult(attemptId ?? '')

  // Toast on load failure as a side effect, never during render.
  useEffect(() => {
    if (isError) toast.error('Could not load quiz result. Please try again.')
  }, [isError])

  if (!attemptId) {
    return (
      <div className="flex flex-col items-center justify-center p-10 gap-4">
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
      <div className="flex flex-col items-center justify-center p-10 gap-4">
        <p className="text-error font-semibold">Failed to load result.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    )
  }

  const { quizAttempt } = data

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="card bg-red-50 shadow-xl border border-red-200 transition-all duration-500 hover:shadow-2xl">
        <div className="card-body items-center text-center">
          <FiXCircle className="w-20 h-20 text-red-500" />
          <h2 className="card-title text-3xl font-bold text-red-700 mt-4">
            You failed to meet the requirements
          </h2>
          <p className="text-xl mt-2 font-semibold">Score: {quizAttempt.score}%</p>
          <div className="card-actions mt-6 gap-4">
            <button
              className="btn btn-outline btn-error transition-transform hover:scale-105"
              onClick={() => navigate(-1)}
            >
              Review Weak Sections
            </button>
            <button
              className="btn btn-primary transition-transform hover:scale-105 flex items-center gap-2"
              onClick={() => navigate(`/quizzes/${quizAttempt.quizId}/attempt`)}
            >
              <FiRefreshCw /> Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
