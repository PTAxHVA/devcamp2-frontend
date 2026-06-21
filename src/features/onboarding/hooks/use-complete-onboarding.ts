import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import type { BrowseRoadmap } from '@/features/roadmap/hooks/use-browse-roadmaps'
import type { MasterRoadmapPreview } from '@/features/roadmap/hooks/use-master-roadmap'
import { useWizardStore } from '../onboarding-store'
import { mapAnswersToQuestionnaire, matchMasterRoadmap } from '../lib/map-questionnaire'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/**
 * Final onboarding step. Persists the questionnaire and enrolls the user into
 * the master roadmap for their chosen role, then lands them on the dashboard.
 *
 * Order matters: the questionnaire (the learner profile) must exist before
 * enroll triggers AI suggest, otherwise the backend can't personalize the
 * roadmap. Flow:
 *   1. resolve the master roadmap + its branches from the chosen role
 *   2. POST /onboarding/questionnaire  (mapped answers + selected branch ids)
 *   3. POST /roadmaps                  (enroll → SUGGESTED roadmap)
 */
export function useCompleteOnboarding() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const answers = useWizardStore((s) => s.answers)
  const resetWizard = useWizardStore((s) => s.resetWizard)

  return useMutation({
    mutationFn: async () => {
      // 1. Resolve which master roadmap matches the chosen role + its branches.
      const list = await apiClient.get<ApiEnvelope<BrowseRoadmap[]>>('/master-roadmaps')
      const master = matchMasterRoadmap(answers.role as string | undefined, list.data.data)
      if (!master) throw new Error('No master roadmap available to enroll into.')

      const detail = await apiClient.get<ApiEnvelope<MasterRoadmapPreview>>(
        `/master-roadmaps/${master._id}`,
      )
      const branchSelections = detail.data.data.branches.map((b) => b._id)
      if (branchSelections.length === 0) throw new Error('Selected roadmap has no branches.')

      // 2. Persist the questionnaire (learner profile) before enrolling.
      const questionnaire = mapAnswersToQuestionnaire(answers, branchSelections)
      await apiClient.post('/onboarding/questionnaire', questionnaire)

      // 3. Enroll → backend builds the personalized (SUGGESTED) roadmap.
      await apiClient.post('/roadmaps', {
        masterRoadmapId: master._id,
        branchSelections,
        sourceType: 'SUGGESTED',
      })

      return { roleName: detail.data.data.roleName }
    },
    onSuccess: async () => {
      resetWizard()
      await queryClient.invalidateQueries({ queryKey: ['my-roadmaps'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate('/dashboard')
    },
    onError: (err: unknown) => {
      const code = (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data
        ?.error?.code
      logger.error('onboarding', 'Failed to complete onboarding', err)

      if (code === 'ROADMAP_ALREADY_ACTIVE') {
        // Questionnaire saved and a roadmap already exists — just move on.
        resetWizard()
        navigate('/dashboard')
        return
      }
      if (code === 'ROADMAP_CAP_REACHED') {
        toast.error('You have reached the limit of 2 active roadmaps.')
        return
      }
      toast.error('Could not finish setup. Please try again.')
    },
  })
}
