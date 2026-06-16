import { useParams, useNavigate } from 'react-router'
import { useQuizResult } from '@/features/quiz/hooks/use-quiz-result'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FiCheckCircle } from 'react-icons/fi'
interface ResultQuestion {
  id: string
  content: string
  isCorrect: boolean
}
export function QuizResultPassPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useQuizResult(attemptId || '')
  const qc = useQueryClient()

  useEffect(() => {
    qc.invalidateQueries({ queryKey: ['dashboard'] })
    qc.invalidateQueries({ queryKey: ['streak'] })
  }, [qc])

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    )
  if (!data) return null

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="card bg-green-50 shadow-xl border border-green-200 transition-all duration-500 hover:shadow-2xl">
        <div className="card-body items-center text-center">
          <FiCheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
          <h2 className="card-title text-3xl font-bold text-green-700 mt-4">You passed!</h2>
          <p className="text-xl mt-2 font-semibold">Score: {data.score}%</p>
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
        <h3 className="font-bold text-xl mb-4">Review Answers</h3>
        {data.questions?.map((q: ResultQuestion, i: number) => (
          <div key={q.id} className="p-4 rounded-lg bg-base-100 shadow border border-base-200">
            <p className="font-semibold">
              Question {i + 1}: {q.content}
            </p>
            <p className={`mt-2 text-sm ${q.isCorrect ? 'text-success' : 'text-error'}`}>
              {q.isCorrect ? 'Correct' : 'Incorrect'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
