import { HiOutlineCheckCircle } from 'react-icons/hi2'

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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold mb-6 text-base-content leading-relaxed">
        {question.content}
      </h3>
      <div className="flex flex-col gap-3">
        {question.options?.map((option) => {
          const isSelected = selectedId === option.id
          return (
            <label
              key={option.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm scale-[1.02]'
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
              <span className="text-base font-medium flex-1">{option.content}</span>

              {isSelected && (
                <HiOutlineCheckCircle className="w-7 h-7 text-primary animate-bounce" />
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
