import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

const reduced = vi.fn(() => false)
vi.mock('../../lib/use-prefers-reduced-motion', () => ({
  usePrefersReducedMotion: () => reduced(),
}))

import { SignatureFeaturesSection } from '../signature-features-section'

describe('SignatureFeaturesSection', () => {
  beforeEach(() => {
    reduced.mockReset()
  })

  it('renders a seamless marquee (each card duplicated) when motion is allowed', () => {
    reduced.mockReturnValue(false)
    const { container, getAllByText } = render(<SignatureFeaturesSection />)
    expect(container.querySelector('.animate-marquee')).not.toBeNull()
    // 3 features × 2 sets → each title appears twice
    expect(getAllByText('Verified Skill Passport')).toHaveLength(2)
  })

  it('renders a static grid (single set, no marquee) under reduced motion', () => {
    reduced.mockReturnValue(true)
    const { container, getAllByText } = render(<SignatureFeaturesSection />)
    expect(container.querySelector('.animate-marquee')).toBeNull()
    expect(getAllByText('Verified Skill Passport')).toHaveLength(1)
  })
})
