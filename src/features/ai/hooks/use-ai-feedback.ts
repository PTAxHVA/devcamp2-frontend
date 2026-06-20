import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export function useAiFeedback() {
  return useMutation({
    // Type 'unknown' temporarily used for payload until backend defines the exact AI body
    mutationFn: async (payload: unknown) => {
      const res = await apiClient.post('/ai/roadmap-feedback/suggest', payload)
      return res.data.data
    },
    onError: (err: unknown) => {
      const e = err as { response?: { status?: number } }
      const status = e.response?.status

      // Task 24: Handle AI unavailability gracefully
      if (status === 503 || status === 429) {
        toast('AI suggestions are temporarily unavailable, but you can keep learning normally!', {
          icon: '🤖',
          style: { background: '#f8fafc', color: '#475569' },
        })
      } else {
        toast.error('An error occurred while connecting to AI. Please try again later.')
      }
    },
  })
}
