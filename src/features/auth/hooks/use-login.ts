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
    onSuccess: (payload) => {
      setAuth(payload.token, payload.user)
      // Returning user -> dashboard (new user vào onboarding qua signup).
      // TODO: khi onboarding đã POST /onboarding/questionnaire (persist `completed`),
      // đổi sang điều hướng theo GET /onboarding/status để resume đúng chỗ.
      navigate('/dashboard')
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
      toast.error(msg ?? 'Có lỗi xảy ra')
    },
  })
}
