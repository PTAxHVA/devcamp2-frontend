import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  // Remember where the user was headed so login can return them there (M7).
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
