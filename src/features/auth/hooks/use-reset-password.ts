import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
import axios from 'axios'

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (vars: { token: string; newPassword: string }) => {
      const { data } = await apiClient.post('/auth/reset-password', vars)
      return data.data
    },
    onSuccess: () => {
      navigate('/auth/reset-password/success')
    },
    onError: (err) => {
      const code = axios.isAxiosError(err) ? err.response?.data?.error?.code : null
      if (code === 'INVALID_RESET_TOKEN') {
        toast.error('Link đặt lại không hợp lệ hoặc đã hết hạn')
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      }
    },
  })
}
