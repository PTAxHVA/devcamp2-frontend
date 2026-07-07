import { describe, expect, it } from 'vitest'
import { parseQuestionContent } from '@/features/quiz/lib/question-content'

describe('parseQuestionContent', () => {
  it('returns a single text segment for normal text', () => {
    expect(parseQuestionContent('Which HTML tag creates a paragraph?')).toEqual([
      { type: 'text', value: 'Which HTML tag creates a paragraph?' },
    ])
  })

  it('parses an inline one-line fence as a code block without raw fences', () => {
    const raw = 'Which line is wrong? ``` 1: <!DOCTYPE html> 2: <html lang="en"> 3: <head> ```'

    expect(parseQuestionContent(raw)).toEqual([
      { type: 'text', value: 'Which line is wrong? ' },
      {
        type: 'code-block',
        value: '1: <!DOCTYPE html> 2: <html lang="en"> 3: <head>',
      },
    ])
  })

  it('keeps text before and after a fenced block in order', () => {
    const raw = 'Read this:\n```html\n<body>\n<title>Wrong</title>\n```\nPick the issue.'

    expect(parseQuestionContent(raw)).toEqual([
      { type: 'text', value: 'Read this:\n' },
      { type: 'code-block', value: '<body>\n<title>Wrong</title>' },
      { type: 'text', value: '\nPick the issue.' },
    ])
  })

  it('treats an unclosed fence as a code block through the end of the string', () => {
    expect(parseQuestionContent('Example: ```const answer = 42')).toEqual([
      { type: 'text', value: 'Example: ' },
      { type: 'code-block', value: 'const answer = 42' },
    ])
  })

  it('parses paired inline code and preserves a lone backtick as text', () => {
    expect(parseQuestionContent('Use `const` here and keep this ` marker.')).toEqual([
      { type: 'text', value: 'Use ' },
      { type: 'inline-code', value: 'const' },
      { type: 'text', value: ' here and keep this ` marker.' },
    ])
  })
})
