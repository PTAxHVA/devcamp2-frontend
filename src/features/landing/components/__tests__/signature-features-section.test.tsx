import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'

const reduced = vi.fn(() => false)
vi.mock('../../lib/use-prefers-reduced-motion', () => ({
  usePrefersReducedMotion: () => reduced(),
}))

import { SignatureFeaturesSection } from '../signature-features-section'

describe('SignatureFeaturesSection', () => {
  beforeEach(() => {
    reduced.mockReset()
  })

  it('renders a seamless marquee: one accessible set + one aria-hidden duplicate set', () => {
    reduced.mockReturnValue(false)
    const { container, getAllByText } = render(<SignatureFeaturesSection />)
    expect(container.querySelector('.animate-marquee')).not.toBeNull()
    // 3 features × 2 sets → 6 card wrappers in the track.
    const cards = container.querySelectorAll('.animate-marquee > div')
    expect(cards).toHaveLength(6)
    // Only the duplicate (2nd) set is hidden from assistive tech (no double announcement).
    expect(container.querySelectorAll('.animate-marquee > div[aria-hidden="true"]')).toHaveLength(3)
    expect(getAllByText('Verified Skill Passport')).toHaveLength(2)
  })

  it('renders a static grid (single set, no marquee) under reduced motion', () => {
    reduced.mockReturnValue(true)
    const { container, getAllByText } = render(<SignatureFeaturesSection />)
    expect(container.querySelector('.animate-marquee')).toBeNull()
    expect(getAllByText('Verified Skill Passport')).toHaveLength(1)
  })

  it('pauses/resumes the marquee via the accessible Pause/Play control', () => {
    reduced.mockReturnValue(false)
    const { container, getByRole } = render(<SignatureFeaturesSection />)
    const track = container.querySelector('.animate-marquee') as HTMLElement
    expect(track.classList.contains('is-paused')).toBe(false)

    fireEvent.click(getByRole('button', { name: /pause/i }))
    expect(track.classList.contains('is-paused')).toBe(true)
    expect(getByRole('button', { name: /play/i })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(getByRole('button', { name: /play/i }))
    expect(track.classList.contains('is-paused')).toBe(false)
  })
})
