import { apiClient, extractApiError } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { type UseFormSetError } from 'react-hook-form'
import { useAuthStore } from '@/stores/auth-store'
import { type SignupInput } from '../auth-schemas'

interface SignupVars {
  username: string
  email: string
  password: string
}

interface AuthPayload {
  token: string
  user: { id: string; email: string; username: string }
}

export function useSignup(setError: UseFormSetError<SignupInput>) {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    // POST /auth/signup → data.data = { token, user }
    mutationFn: async (input: SignupVars): Promise<AuthPayload> => {
      const { data } = await apiClient.post('/auth/signup', input)
      return data.data
    },
    onSuccess: (payload) => {
      // KHÔI PHỤC LUỒNG HIGH: Tự động lưu session đăng nhập và đá thẳng user vào làm onboarding
      setAuth(payload.token, payload.user)
      toast.success('Account created successfully!')
      navigate('/onboarding')
    },
    onError: (err) => {
      // FIX CRITICAL 1: Bỏ object 'errors' bị lỗi, dùng trực tiếp 'code' và 'message' từ extractApiError
      const { code, message } = extractApiError(err)

      if (code === 'EMAIL_TAKEN') {
        setError('email', {
          type: 'server',
          message: 'Email is already in use',
        })
      } else {
        toast.error(message ?? 'Something went wrong during signup.')
      }
    },
  })
}
