import { formatCodeBlock, parseQuestionContent } from '@/features/quiz/lib/question-content'

interface QuestionContentProps {
  text: string
}

export function QuestionContent({ text }: QuestionContentProps) {
  return (
    <>
      {parseQuestionContent(text).map((segment, index) => {
        if (segment.type === 'inline-code') {
          return (
            <code
              key={`${segment.type}-${index}`}
              className="bg-bg-section rounded px-1.5 py-0.5 font-mono text-[0.9em]"
            >
              {segment.value}
            </code>
          )
        }

        if (segment.type === 'code-block') {
          return (
            <pre
              key={`${segment.type}-${index}`}
              className="bg-bg-section my-2 overflow-x-auto rounded-lg p-3 font-mono text-sm whitespace-pre-wrap"
            >
              <code>{formatCodeBlock(segment.value)}</code>
            </pre>
          )
        }

        return <span key={`${segment.type}-${index}`}>{segment.value}</span>
      })}
    </>
  )
}
