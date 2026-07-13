import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import SupportPage from '../support-page'

const renderPage = () =>
  render(
    <MemoryRouter>
      <SupportPage />
    </MemoryRouter>,
  )

describe('SupportPage', () => {
  it('renders the hero heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: /how can we help/i })).toBeInTheDocument()
  })

  it('links quick actions to the real routes', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /browse roadmaps/i })).toHaveAttribute(
      'href',
      '/roadmaps',
    )
    expect(screen.getByRole('link', { name: /skill passport/i })).toHaveAttribute(
      'href',
      '/passport',
    )
    expect(screen.getByRole('link', { name: /career goals/i })).toHaveAttribute('href', '/goals')
    expect(screen.getByRole('link', { name: /back to dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard',
    )
  })

  it('shows every FAQ group and a grounded answer', () => {
    renderPage()
    expect(screen.getByText('Getting started')).toBeInTheDocument()
    expect(screen.getByText('Quizzes, progress & streak')).toBeInTheDocument()
    expect(screen.getByText('Roadmaps & customization')).toBeInTheDocument()
    expect(screen.getByText('Signature features')).toBeInTheDocument()
    expect(screen.getByText('AI & troubleshooting')).toBeInTheDocument()
    expect(screen.getByText(/Progress is quiz-verified/i)).toBeInTheDocument()
  })

  it('is self-help only — no contact form or email', () => {
    renderPage()
    expect(screen.queryByText(/contact us/i)).toBeNull()
    expect(screen.queryByRole('textbox')).toBeNull()
  })
})
