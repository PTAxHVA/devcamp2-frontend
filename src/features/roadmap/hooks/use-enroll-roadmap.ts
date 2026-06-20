import { useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api-client'
import { roadmapSlug } from '@/features/learning/lib/roadmap-slug'

interface EnrollVars {
  masterRoadmapId: string
  roleName?: string
  branchSelections: string[]
}

/**
 * Enroll the user in a master roadmap, then send them to its My Learning page.
 * Shared by the roadmap card and the preview modal so both behave identically.
 */
export function useEnrollRoadmap() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ masterRoadmapId, branchSelections }: EnrollVars) => {
      if (branchSelections.length === 0) throw new Error('No branches available.')
      await apiClient.post('/roadmaps', {
        masterRoadmapId,
        branchSelections,
        sourceType: 'SUGGESTED',
      })
    },
    onSuccess: async (_data, vars) => {
      toast.success(`Enrolled in ${vars.roleName ?? 'roadmap'}!`)
      // Refresh the user's roadmap list so the new one is present before we land
      // on /my-learning/<slug>, then refresh the dashboard in the background.
      await queryClient.invalidateQueries({ queryKey: ['my-roadmaps'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate(`/my-learning/${roadmapSlug(vars.roleName)}`)
    },
    onError: (err: unknown, vars) => {
      const code = (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data
        ?.error?.code
      if (code === 'ROADMAP_ALREADY_ACTIVE') {
        // Already enrolled — just take them to the roadmap instead of erroring.
        navigate(`/my-learning/${roadmapSlug(vars.roleName)}`)
      } else if (code === 'ROADMAP_CAP_REACHED') {
        toast.error('You have reached the limit of 2 active roadmaps.')
      } else {
        toast.error('Cannot enroll right now. Please try again.')
      }
    },
  })
}
