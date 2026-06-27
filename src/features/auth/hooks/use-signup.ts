import { apiClient, extractApiError } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { type UseFormSetError } from 'react-hook-form'
import { type SignupInput } from '../auth-schemas'

// Loại bỏ các trường chỉ dùng ở UI như confirmPassword và terms trước khi gửi lên API
type SignupVars = Omit<SignupInput, 'confirmPassword' | 'terms'>

export function useSignup(setError: UseFormSetError<SignupInput>) {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: SignupVars) => {
      const { data } = await apiClient.post('/auth/signup', input)
      return data.data
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please log in.')
      navigate('/login')
    },
    onError: (err) => {
      const { message, errors } = extractApiError(err)

      // Trường hợp 1: Backend trả về object lỗi chi tiết (Ví dụ: { email: "Email already taken" })
      if (errors && typeof errors === 'object') {
        Object.entries(errors).forEach(([key, val]) => {
          setError(key as keyof SignupInput, {
            // <-- Thay bằng keyof SignupInput
            type: 'server',
            message: Array.isArray(val) ? val[0] : String(val),
          })
        })
      }
      // Trường hợp 2: Fallback nếu Backend trả về chuỗi text chứa chữ "email"
      else if (message?.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message })
      }
      // Trường hợp 3: Gặp lỗi hệ thống khác thì báo Toast
      else {
        toast.error(message ?? 'Something went wrong during signup.')
      }
    },
  })
}
