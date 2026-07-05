import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadinessGauge } from '../readiness-gauge'
import type { JobReadinessResult } from '../../types'

const baseResult: JobReadinessResult = {
  role: 'Junior Frontend Developer',
  readinessPct: 62,
  source: 'ai',
  verified: [{ topicId: 't1', name: 'HTML', estimatedHours: 2 }],
  inProgress: [{ topicId: 't2', name: 'CSS', estimatedHours: 2 }],
  missing: [{ topicId: 't3', name: 'React', estimatedHours: 4 }],
}

describe('ReadinessGauge', () => {
  it('shows the readiness percentage and role verdict', () => {
    render(<ReadinessGauge result={baseResult} />)
    expect(screen.getByText('62%')).toBeInTheDocument()
    expect(screen.getByText('62% ready for Junior Frontend Developer')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '62')
    expect(screen.getByText('1 verified · 1 in progress · 1 missing')).toBeInTheDocument()
  })

  it('flags the curated fallback when the AI was unavailable', () => {
    render(<ReadinessGauge result={{ ...baseResult, source: 'fallback' }} />)
    expect(screen.getByText(/showing our curated checklist/i)).toBeInTheDocument()
  })

  it('hides the fallback note for a live AI answer', () => {
    render(<ReadinessGauge result={baseResult} />)
    expect(screen.queryByText(/curated checklist/i)).not.toBeInTheDocument()
  })

  it('shows the ETA line only when the backend sent one', () => {
    const { rerender } = render(<ReadinessGauge result={{ ...baseResult, etaWeeks: 2 }} />)
    expect(screen.getByText(/~2 weeks of learning/i)).toBeInTheDocument()
    rerender(<ReadinessGauge result={baseResult} />)
    expect(screen.queryByText(/of learning to close the gap/i)).not.toBeInTheDocument()
  })
})
