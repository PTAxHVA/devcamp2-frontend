import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'

const mockUser = { id: '1', email: 'test@example.com', username: 'TestUser' }

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ token: null, user: null })
  })

  it('initial state is null when localStorage is empty', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('setAuth saves token and user to localStorage', () => {
    const { setAuth } = useAuthStore.getState()
    setAuth('my-token', mockUser)

    expect(localStorage.getItem('token')).toBe('my-token')
    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toEqual(mockUser)
    expect(useAuthStore.getState().token).toBe('my-token')
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('setAuth(null, null) clears token and user', () => {
    const { setAuth } = useAuthStore.getState()
    setAuth('my-token', mockUser)
    setAuth(null, null)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('replaces existing token on new setAuth', () => {
    const { setAuth } = useAuthStore.getState()
    setAuth('old-token', mockUser)
    setAuth('new-token', { ...mockUser, username: 'NewUser' })

    expect(useAuthStore.getState().token).toBe('new-token')
    expect(useAuthStore.getState().user?.username).toBe('NewUser')
  })
})
