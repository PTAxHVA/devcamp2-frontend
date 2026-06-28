import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export function useCompleteSection() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (sectionId: string) => apiClient.post(`/sections/${sectionId}/complete`),
    onSuccess: (_, sectionId) => {
      qc.invalidateQueries({ queryKey: ['section-detail', sectionId] })
      qc.invalidateQueries({ queryKey: ['topic-detail'] })
      qc.invalidateQueries({ queryKey: ['roadmap-detail'] })
      qc.invalidateQueries({ queryKey: ['my-roadmaps'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['streak'] })
    },
    onError: () => toast.error('Failed to save progress. Please try again.'),
  })
}
