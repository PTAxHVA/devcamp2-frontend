import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  username: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string | null, user: AuthUser | null) => void
}

const readUser = (): AuthUser | null => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    // A corrupt/partial 'user' blob would otherwise throw here — and this runs
    // during module init (inside create()), before React mounts, so ErrorBoundary
    // can't catch it and the whole app renders a blank white screen. Drop the bad
    // value and boot logged-out instead.
    localStorage.removeItem('user')
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: readUser(),
  setAuth: (token, user) => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')

    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')

    set({ token, user })
  },
}))
