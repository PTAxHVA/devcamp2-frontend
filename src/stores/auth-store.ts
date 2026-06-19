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
  return raw ? (JSON.parse(raw) as AuthUser) : null
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
