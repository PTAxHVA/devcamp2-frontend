import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { PublicOnlyRoute } from '../public-only-route'
import { useAuthStore } from '@/stores/auth-store'

const user = { id: 'u1', email: 'u1@vora.dev', username: 'u1' }

const renderAt = (entry: string | { pathname: string; state?: unknown }) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<div>login page</div>} />
        </Route>
        <Route path="/dashboard" element={<div>dashboard page</div>} />
        <Route path="/settings" element={<div>settings page</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('PublicOnlyRoute', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ token: null, user: null })
  })

  it('renders the public page when signed out', () => {
    renderAt('/login')
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('redirects a signed-in visitor to the dashboard', () => {
    useAuthStore.setState({ token: 't', user })
    renderAt('/login')
    expect(screen.getByText('dashboard page')).toBeInTheDocument()
  })

  it('honors state.from so deep links survive the gate', () => {
    useAuthStore.setState({ token: 't', user })
    renderAt({
      pathname: '/login',
      state: { from: { pathname: '/settings', search: '', hash: '' } },
    })
    expect(screen.getByText('settings page')).toBeInTheDocument()
  })

  it('is not frozen at first render (B2: /login after logout must show the form)', () => {
    // App "mounted while signed in": the gate redirects away from /login…
    useAuthStore.setState({ token: 't', user })
    const first = renderAt('/login')
    expect(screen.getByText('dashboard page')).toBeInTheDocument()
    first.unmount()

    // …and after signing out (nav-bar handleLogout does setAuth(null, null) then
    // navigate('/login')), rendering /login again must show the real form. The old
    // inline isAuthenticated() elements were evaluated once at app mount, stayed
    // <Navigate/> forever, and left the page blank.
    act(() => useAuthStore.getState().setAuth(null, null))
    renderAt('/login')
    expect(screen.getByText('login page')).toBeInTheDocument()
  })
})
