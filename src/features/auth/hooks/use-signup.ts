import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from 'react-router'
import type { UseFormSetError } from 'react-hook-form'
import type { SignupInput } from '@/features/auth/auth-schemas'

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
    // POST /auth/signup body { username, email, password }
    // → 201, data.data = { token, user }
    mutationFn: async (input: SignupVars): Promise<AuthPayload> => {
      const { data } = await apiClient.post('/auth/signup', input)
      return data.data // unwrap 2 lớp .data
    },
    onSuccess: (payload) => {
      setAuth(payload.token, payload.user)
      navigate('/onboarding') // new user → always onboarding
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.error?.code
        const message = err.response?.data?.error?.message

        if (code === 'EMAIL_TAKEN') {
          // inline error under email field, NOT a toast
          setError('email', { message: 'This email is already in use' })
        } else {
          toast.error(message ?? 'Something went wrong. Please try again.')
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })
}
