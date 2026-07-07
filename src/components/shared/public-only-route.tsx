import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'

interface RedirectState {
  from?: { pathname?: string; search?: string; hash?: string }
}

/**
 * Layout route for signed-out-only pages (landing, login, signup).
 *
 * Reactive counterpart of ProtectedRoute: it subscribes to the auth store, unlike
 * the previous inline `isAuthenticated() ? <Navigate/> : <Page/>` elements, which
 * were evaluated once when AppRoutes rendered (app mount). If the app mounted
 * while signed in, /login stayed frozen as a redirect — after logout it ping-ponged
 * against ProtectedRoute and rendered a blank page until a manual reload (B2).
 *
 * Honors ProtectedRoute's `state.from` (full path, like use-login) so a signed-in
 * visitor bounced through /login still lands on the page they asked for.
 */
export function PublicOnlyRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (token) {
    const fromLoc = (location.state as RedirectState | null)?.from
    const from = fromLoc?.pathname
      ? `${fromLoc.pathname}${fromLoc.search ?? ''}${fromLoc.hash ?? ''}`
      : null
    return <Navigate to={from ?? '/dashboard'} replace />
  }
  return <Outlet />
}
