import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'

const mockUser = { id: '1', email: 'test@example.com', username: 'TestUser' }

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ token: null, user: null })
  })

  it('initial state is null when localStorage is empty', () => {
    const { token, user } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(user).toBeNull()
  })

  it('setAuth saves token and user to localStorage', () => {
    useAuthStore.getState().setAuth('my-token', mockUser)

    expect(localStorage.getItem('token')).toBe('my-token')
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser)
    expect(useAuthStore.getState().token).toBe('my-token')
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('setAuth(null, null) clears token and user', () => {
    useAuthStore.getState().setAuth('my-token', mockUser)
    useAuthStore.getState().setAuth(null, null)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('replaces existing token on new setAuth', () => {
    useAuthStore.getState().setAuth('old-token', mockUser)
    useAuthStore.getState().setAuth('new-token', { ...mockUser, username: 'NewUser' })

    expect(useAuthStore.getState().token).toBe('new-token')
    expect(useAuthStore.getState().user?.username).toBe('NewUser')
  })
})
