import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { McqQuestion } from '@/features/quiz/components/mcq-question'
import { QuestionContent } from '@/features/quiz/components/question-content'

describe('QuestionContent rendering', () => {
  it('renders MCQ question fences as pre blocks and option backticks as code chips', () => {
    const { container } = render(
      <McqQuestion
        question={{
          id: 'q1',
          content:
            'Which line below is incorrectly placed? ``` 1: <!DOCTYPE html> 2: <html lang="en"> 3: <head> ```',
          options: [{ id: 'o1', content: 'Line 4 - `<title>` should be inside `<head>`.' }],
        }}
        selectedId="o1"
        onSelect={vi.fn()}
      />,
    )

    const pre = container.querySelector('pre')
    const codes = container.querySelectorAll('code')

    expect(pre).toBeInTheDocument()
    expect(pre?.textContent).toContain('1: <!DOCTYPE html>')
    expect(pre?.textContent).toContain('\n2: <html lang="en">')
    expect(codes.length).toBeGreaterThanOrEqual(3)
    expect(screen.getByText('<title>')).toBeInTheDocument()
    expect(screen.getByText('<head>')).toBeInTheDocument()
    expect(container.textContent).not.toContain('```')
    expect(container.textContent).not.toContain('`<title>`')
  })

  it('escapes script-looking content inside fenced code instead of creating a script node', () => {
    const { container } = render(
      <QuestionContent text={'Inspect this: ```<script>alert(1)</script>```'} />,
    )

    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('pre')).toHaveTextContent('<script>alert(1)</script>')
  })
})
