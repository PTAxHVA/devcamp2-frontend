import { HiOutlinePencilSquare } from 'react-icons/hi2'

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
      <h3 className="text-base-content mb-6 text-xl leading-relaxed font-bold">
        {question.content}
      </h3>
      <div className="flex flex-col gap-3">
        <label
          className={`flex cursor-text items-center gap-4 rounded-xl border-2 p-4 transition-all duration-300 focus-within:shadow-md hover:shadow-md ${
            hasValue
              ? 'border-primary bg-primary/10 scale-[1.02] shadow-sm'
              : 'border-base-300 hover:border-primary/40'
          }`}
        >
          <div className="relative flex flex-1 items-center">
            <HiOutlinePencilSquare
              className={`mr-3 h-6 w-6 transition-colors duration-300 ${hasValue ? 'text-primary' : 'text-base-content/40'}`}
            />
            <input
              type="text"
              placeholder="Nhập câu trả lời của bạn..."
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
