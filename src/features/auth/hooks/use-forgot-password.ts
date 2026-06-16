import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await apiClient.post('/auth/request-password-reset', { email })
      return data.data
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
    // onSuccess không toast — BE luôn trả 200 kể cả email không tồn tại
    // UI tự hiện message "nếu email tồn tại..." qua isSuccess
  })
}
