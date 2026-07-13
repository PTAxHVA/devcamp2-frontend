import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VoraMark, VoraWordmark } from '../vora-logo'

describe('VoraMark', () => {
  it('exposes an accessible label by default', () => {
    render(<VoraMark />)
    expect(screen.getByRole('img', { name: 'VORA' })).toBeInTheDocument()
  })

  it('is hidden from assistive tech when decorative', () => {
    const { container } = render(<VoraMark decorative />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('aria-label')
  })

  it('gives each instance a unique gradient id so marks never share a fill', () => {
    const { container } = render(
      <>
        <VoraMark />
        <VoraMark />
      </>,
    )
    const ids = Array.from(container.querySelectorAll('linearGradient')).map((g) => g.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})

describe('VoraWordmark', () => {
  it('renders the VORA wordmark text', () => {
    render(<VoraWordmark />)
    expect(screen.getByText('VORA')).toBeInTheDocument()
  })
})
