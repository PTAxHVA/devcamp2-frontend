import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from 'react-router'

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

  return useMutation({
    // POST /auth/login → data.data = { token, user }
    mutationFn: async (input: LoginVars): Promise<AuthPayload> => {
      const { data } = await apiClient.post('/auth/login', input)
      return data.data // unwrap 2 lớp .data
    },
    onSuccess: async (payload) => {
      setAuth(payload.token, payload.user)

      // /onboarding/status chưa ship — mock tạm; xoá mock khi BE xong
      // const { data } = await apiClient.get('/onboarding/status')
      // navigate(data.data.onboardingCompleted ? '/dashboard' : '/onboarding')
      const mock = { data: { onboardingCompleted: false } }
      navigate(mock.data.onboardingCompleted ? '/dashboard' : '/onboarding')
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
      toast.error(msg ?? 'Có lỗi xảy ra')
    },
  })
}
