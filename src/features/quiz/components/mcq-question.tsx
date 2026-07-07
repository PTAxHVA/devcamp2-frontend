import { HiOutlineCheckCircle } from 'react-icons/hi2'
import { QuestionContent } from '@/features/quiz/components/question-content'

interface McqQuestionProps {
  question: {
    id: string
    content: string
    options?: Array<{ id: string; content: string }>
  }
  selectedId?: string
  onSelect: (id: string) => void
}

export function McqQuestion({ question, selectedId, onSelect }: McqQuestionProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-500">
      <div className="text-base-content mb-6 text-xl leading-relaxed font-bold">
        <QuestionContent text={question.content} />
      </div>
      <div className="flex flex-col gap-3">
        {question.options?.map((option) => {
          const isSelected = selectedId === option.id
          return (
            <label
              key={option.id}
              className={`focus-within:ring-brand-purple-300 flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 focus-within:ring-2 hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-sm'
                  : 'border-base-300 hover:border-primary/40'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                className="radio radio-primary"
                checked={isSelected}
                onChange={() => onSelect(option.id)}
              />
              <div className="flex-1 text-base font-medium">
                <QuestionContent text={option.content} />
              </div>

              {isSelected && (
                <HiOutlineCheckCircle className="text-primary h-7 w-7 animate-bounce" />
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
