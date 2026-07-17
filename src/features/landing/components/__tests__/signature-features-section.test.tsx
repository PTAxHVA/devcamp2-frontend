import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { render, fireEvent } from '@testing-library/react'

const reduced = vi.fn(() => false)
vi.mock('../../lib/use-prefers-reduced-motion', () => ({
  usePrefersReducedMotion: () => reduced(),
}))

import { SignatureFeaturesSection } from '../signature-features-section'

// jsdom doesn't implement the Pointer Events capture API the drag handlers call.
beforeAll(() => {
  Element.prototype.setPointerCapture = vi.fn()
})

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

  it('a plain click/tap (no movement) does not leave the marquee frozen', () => {
    reduced.mockReturnValue(false)
    const { container } = render(<SignatureFeaturesSection />)
    const track = container.querySelector('.animate-marquee') as HTMLElement

    fireEvent.pointerDown(track, { clientX: 100, pointerId: 1 })
    fireEvent.pointerUp(track, { clientX: 100, pointerId: 1 })

    expect(track.classList.contains('animate-marquee')).toBe(true)
    expect(track.classList.contains('is-paused')).toBe(false)
  })

  it('a pointercancel before the drag threshold (vertical scroll start) does not freeze it', () => {
    reduced.mockReturnValue(false)
    const { container } = render(<SignatureFeaturesSection />)
    const track = container.querySelector('.animate-marquee') as HTMLElement

    fireEvent.pointerDown(track, { clientX: 100, pointerId: 1 })
    fireEvent.pointerCancel(track, { pointerId: 1 })

    expect(track.classList.contains('animate-marquee')).toBe(true)
    expect(track.classList.contains('is-paused')).toBe(false)
  })

  it('a horizontal drag past the threshold commits to manual mode and stays paused after release', () => {
    reduced.mockReturnValue(false)
    const { container } = render(<SignatureFeaturesSection />)
    const track = container.querySelector('.animate-marquee') as HTMLElement

    fireEvent.pointerDown(track, { clientX: 100, pointerId: 1 })
    fireEvent.pointerMove(track, { clientX: 88, pointerId: 1 }) // 12px, past the threshold
    // Manual mode engaged — the CSS loop class drops off in favor of the inline transform.
    expect(track.classList.contains('animate-marquee')).toBe(false)

    fireEvent.pointerUp(track, { clientX: 88, pointerId: 1 })
    // Releasing a real drag leaves it paused (Play hands control back) — unchanged behavior.
    expect(track.classList.contains('animate-marquee')).toBe(false)
  })

  it('does not resume an explicitly paused marquee on a plain tap', () => {
    reduced.mockReturnValue(false)
    const { container, getByRole } = render(<SignatureFeaturesSection />)
    const track = container.querySelector('.animate-marquee') as HTMLElement
    fireEvent.click(getByRole('button', { name: /pause/i }))
    expect(track.classList.contains('is-paused')).toBe(true)

    fireEvent.pointerDown(track, { clientX: 50, pointerId: 2 })
    fireEvent.pointerUp(track, { clientX: 50, pointerId: 2 })

    expect(track.classList.contains('is-paused')).toBe(true)
  })
})
