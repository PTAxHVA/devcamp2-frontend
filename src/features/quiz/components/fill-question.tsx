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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold mb-6 text-base-content leading-relaxed">
        {question.content}
      </h3>
      <div className="flex flex-col gap-3">
        <label
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-text transition-all duration-300 hover:shadow-md focus-within:shadow-md ${
            hasValue
              ? 'border-primary bg-primary/10 shadow-sm scale-[1.02]'
              : 'border-base-300 hover:border-primary/40'
          }`}
        >
          <div className="relative flex-1 flex items-center">
            <HiOutlinePencilSquare
              className={`w-6 h-6 mr-3 transition-colors duration-300 ${hasValue ? 'text-primary' : 'text-base-content/40'}`}
            />
            <input
              type="text"
              placeholder="Nhập câu trả lời của bạn..."
              className="bg-transparent outline-none w-full text-base font-medium placeholder:text-base-content/30"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </label>
      </div>
    </div>
  )
}
