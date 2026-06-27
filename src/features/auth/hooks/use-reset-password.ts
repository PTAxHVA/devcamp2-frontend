import { apiClient, extractApiError } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'

interface ResetPasswordVars {
  token: string
  newPassword: string
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: ResetPasswordVars) => {
      // Gọi lên endpoint cập nhật mật khẩu mới của Backend
      const { data } = await apiClient.post('/auth/reset-password', input)
      return data.data
    },
    onSuccess: () => {
      // Tách biệt logic: Thành công là nhảy hẳn sang trang thành công riêng biệt
      navigate('/auth/reset-password/success')
    },
    onError: (err) => {
      const { message } = extractApiError(err)
      toast.error(message ?? 'Failed to reset password. The link may be expired.')
    },
  })
}
