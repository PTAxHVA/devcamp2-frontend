import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Navbar } from '../nav-bar'
import { useMe } from '@/features/profile/hooks/use-profile'
import { useAuthStore } from '@/stores/auth-store'

vi.mock('@/features/profile/hooks/use-profile', () => ({ useMe: vi.fn() }))
vi.mock('@/stores/auth-store', () => ({ useAuthStore: vi.fn() }))
vi.mock('@/lib/query-client', () => ({ queryClient: { clear: vi.fn() } }))

const renderNavbar = (path = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>,
  )

describe('Navbar', () => {
  beforeEach(() => {
    ;(useMe as Mock).mockReturnValue({ data: { username: 'Thai' } })
    ;(useAuthStore as unknown as Mock).mockReturnValue(vi.fn())
  })

  it('shows the contextual page title and greeting', () => {
    renderNavbar('/dashboard')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/welcome back, thai/i)).toBeInTheDocument()
  })

  it('links the help shortcut to the support page', () => {
    renderNavbar('/dashboard')
    expect(screen.getByRole('link', { name: /help & support/i })).toHaveAttribute(
      'href',
      '/support',
    )
  })

  it('renders the account chip and menu', () => {
    renderNavbar('/dashboard')
    // No avatar set → the chip shows the silhouette fallback, not initials.
    expect(screen.getByRole('img', { name: /thai's avatar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/profile')
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })
})
