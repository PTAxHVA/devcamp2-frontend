import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { QuestionContent } from '@/features/quiz/components/question-content'

interface FillQuestionProps {
  question: {
    id: string
    content: string
  }
  value: string
  onChange: (val: string) => void
}

export function FillQuestion({ question, value, onChange }: FillQuestionProps) {
  const hasValue = value.trim().length > 0
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-500">
      <div className="text-base-content mb-6 text-xl leading-relaxed font-bold break-words">
        <QuestionContent text={question.content} />
      </div>
      <div className="flex flex-col gap-3">
        <label
          className={`focus-within:ring-brand-purple-300 flex cursor-text items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 focus-within:shadow-md focus-within:ring-2 hover:shadow-md ${
            hasValue
              ? 'border-primary bg-primary/10 scale-[1.02] shadow-sm'
              : 'border-base-300 hover:border-primary/40'
          }`}
        >
          <div className="relative flex flex-1 items-center">
            <HiOutlinePencilSquare
              className={`mr-3 h-6 w-6 transition-colors duration-200 ${hasValue ? 'text-primary' : 'text-base-content/40'}`}
            />
            <input
              type="text"
              placeholder="Enter your answer..."
              className="placeholder:text-base-content/30 w-full bg-transparent text-base font-medium outline-none"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </label>
      </div>
    </div>
  )
}
