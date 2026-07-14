import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoadmapArt } from '../roadmap-art'

describe('RoadmapArt', () => {
  it('renders a frontend roadmap with the purple accent', () => {
    render(<RoadmapArt title="Frontend Web Developer" />)
    const art = screen.getByRole('img', { name: /frontend web developer roadmap illustration/i })
    expect(art.querySelector('.text-brand-purple-500')).not.toBeNull()
  })

  it('renders a backend roadmap with the navy accent', () => {
    render(<RoadmapArt title="Backend Web Developer" />)
    const art = screen.getByRole('img', { name: /backend web developer roadmap illustration/i })
    expect(art.querySelector('.text-brand-navy-700')).not.toBeNull()
  })

  it('falls back to the neutral accent for an unrecognized role', () => {
    render(<RoadmapArt title="Personal Roadmap" />)
    const art = screen.getByRole('img', { name: /personal roadmap roadmap illustration/i })
    expect(art.querySelector('.text-text-placeholder')).not.toBeNull()
  })

  it('classifies by the explicit `role` prop over the title when both are given', () => {
    render(<RoadmapArt title="My Custom Roadmap" role="Backend Web Developer" />)
    const art = screen.getByRole('img', { name: /my custom roadmap roadmap illustration/i })
    expect(art.querySelector('.text-brand-navy-700')).not.toBeNull()
  })

  it('renders a shorter compact variant', () => {
    render(<RoadmapArt title="Frontend Web Developer" variant="compact" />)
    const art = screen.getByRole('img')
    expect(art.className).toContain('h-24')
    expect(art.className).not.toContain('h-36')
  })

  it('renders the full-size default variant', () => {
    render(<RoadmapArt title="Frontend Web Developer" />)
    const art = screen.getByRole('img')
    expect(art.className).toContain('h-36')
  })
})
