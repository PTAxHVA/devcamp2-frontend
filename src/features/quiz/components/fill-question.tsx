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
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold mb-6 text-base-content leading-relaxed">
        {question.content}
      </h3>
      <div className="relative form-control w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-primary">
          <HiOutlinePencilSquare className="w-6 h-6 text-base-content/40 group-focus-within:text-primary" />
        </div>
        <input
          type="text"
          placeholder="Nhập câu trả lời của bạn..."
          className="input input-bordered input-lg w-full pl-12 focus:input-primary transition-all duration-300 focus:shadow-lg bg-base-100 hover:border-primary/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
