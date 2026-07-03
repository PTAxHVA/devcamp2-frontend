import { apiClient, extractApiError } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate, useLocation } from 'react-router'

interface LoginVars {
  email: string
  password: string
}

interface AuthPayload {
  token: string
  user: { id: string; email: string; username: string }
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    // POST /auth/login → data.data = { token, user }
    mutationFn: async (input: LoginVars): Promise<AuthPayload> => {
      const { data } = await apiClient.post('/auth/login', input)
      return data.data // unwrap 2 lớp .data
    },
    onSuccess: async (payload) => {
      setAuth(payload.token, payload.user)
      // Return the user to the page they were bounced from (M7), unless it was an
      // auth page. Keep the full path (search + hash) so deep links like
      // /my-learning/topics/t/sections/s?roadmapId=r survive login. Onboarding-
      // incomplete users always finish onboarding first.
      const fromLoc = (
        location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null
      )?.from
      const fromPathname = fromLoc?.pathname
      const from =
        fromPathname && fromPathname !== '/login' && fromPathname !== '/signup'
          ? `${fromPathname}${fromLoc?.search ?? ''}${fromLoc?.hash ?? ''}`
          : null
      try {
        const { data } = await apiClient.get('/onboarding/status')
        const completed = data?.data?.completed ?? true
        if (!completed) navigate('/onboarding')
        else navigate(from ?? '/dashboard')
      } catch {
        navigate(from ?? '/dashboard')
      }
    },
    onError: (err) => {
      const { message } = extractApiError(err)
      toast.error(message ?? 'Something went wrong')
    },
  })
}
