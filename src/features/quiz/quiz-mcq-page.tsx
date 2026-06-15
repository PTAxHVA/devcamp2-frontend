import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { McqQuestion } from '@/features/quiz/components/mcq-question'
import { FillQuestion } from '@/features/quiz/components/fill-question'
import {
  HiMiniArrowLeft,
  HiMiniArrowRight,
  HiMiniPaperAirplane,
  HiOutlineLightBulb,
} from 'react-icons/hi2'

type Question = {
  id: string
  type: 'mcq' | 'fill'
  content: string
  options?: Array<{ id: string; content: string }>
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    content: 'TypeScript là gì?',
    options: [
      { id: 'o1', content: 'Một framework của JavaScript' },
      { id: 'o2', content: 'Một superset của JavaScript có định kiểu tĩnh' },
      { id: 'o3', content: 'Một cơ sở dữ liệu NoSQL' },
    ],
  },
  {
    id: 'q2',
    type: 'fill',
    content: 'Hook nào trong React dùng để quản lý state cục bộ?',
  },
]

export function QuizMCQPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestion = MOCK_QUESTIONS[currentIndex]
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = currentIndex === MOCK_QUESTIONS.length - 1

  const handleAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }))
  }

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (!isFirstQuestion) setCurrentIndex((prev) => prev - 1)
  }

  const handleSubmit = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-base-200/50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-bold text-base-content/70">
            <span className="flex items-center gap-2">
              <HiOutlineLightBulb className="w-5 h-5 text-warning animate-pulse" />
              Câu hỏi {currentIndex + 1} / {MOCK_QUESTIONS.length}
            </span>
            <span className="opacity-60 font-mono text-xs">Quiz ID: {quizId}</span>
          </div>
          <progress
            className="progress progress-primary w-full h-3 transition-all duration-500"
            value={currentIndex + 1}
            max={MOCK_QUESTIONS.length}
          ></progress>
        </div>

        <div key={currentQuestion.id} className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-8 min-h-[300px]">
            {currentQuestion.type === 'mcq' ? (
              <McqQuestion
                question={currentQuestion}
                selectedId={answers[currentQuestion.id]}
                onSelect={handleAnswer}
              />
            ) : (
              <FillQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id] || ''}
                onChange={handleAnswer}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            className="btn btn-ghost hover:bg-base-200"
            onClick={handlePrev}
            disabled={isFirstQuestion}
          >
            <HiMiniArrowLeft className="w-5 h-5" /> Quay lại
          </button>

          {isLastQuestion ? (
            <button
              className="btn btn-primary px-8 shadow-lg hover:shadow-primary/50 transition-all active:scale-95"
              onClick={handleSubmit}
            >
              Nộp bài <HiMiniPaperAirplane className="w-5 h-5" />
            </button>
          ) : (
            <button
              className="btn btn-primary px-8 shadow-md transition-all active:scale-95"
              onClick={handleNext}
            >
              Tiếp tục <HiMiniArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
