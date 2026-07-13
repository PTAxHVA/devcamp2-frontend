import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeeklyProgressChart } from '../weekly-progress-chart'

describe('WeeklyProgressChart (always-shown behavior)', () => {
  it('shows an empty-week hint when there is no activity', () => {
    render(<WeeklyProgressChart counts={[0, 0, 0, 0, 0, 0, 0]} />)
    expect(screen.getByText(/no sections completed this week yet/i)).toBeInTheDocument()
  })

  it('hides the hint once there is activity', () => {
    render(<WeeklyProgressChart counts={[1, 0, 2, 0, 0, 0, 0]} />)
    expect(screen.queryByText(/no sections completed this week yet/i)).not.toBeInTheDocument()
  })

  it('fires onViewFull when the View full button is clicked', async () => {
    const onViewFull = vi.fn()
    const user = userEvent.setup()
    render(<WeeklyProgressChart counts={[1, 0, 0, 0, 0, 0, 0]} onViewFull={onViewFull} />)
    await user.click(screen.getByRole('button', { name: /view full/i }))
    expect(onViewFull).toHaveBeenCalledOnce()
  })

  it('omits the View full button when no handler is provided', () => {
    render(<WeeklyProgressChart counts={[1, 0, 0, 0, 0, 0, 0]} />)
    expect(screen.queryByRole('button', { name: /view full/i })).not.toBeInTheDocument()
  })
})
