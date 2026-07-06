import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { apiClient, extractApiError } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import type { BrowseRoadmap } from '@/features/roadmap/hooks/use-browse-roadmaps'
import type { MasterRoadmapPreview } from '@/features/roadmap/hooks/use-master-roadmap'
import { resolveDefaultBranchSelection } from '@/features/roadmap/lib/branch-selection'
import { useWizardStore, type RoadmapSuggestion } from '../onboarding-store'
import { mapAnswersToQuestionnaire, matchMasterRoadmap } from '../lib/map-questionnaire'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

interface EnrollBody {
  masterRoadmapId: string
  branchSelections: string[]
  sourceType: 'SUGGESTED'
  orderedTopicIds?: string[]
}

/**
 * The AI order may only be attached when the suggestion was computed for this
 * exact roadmap + branch set — a stale suggestion (e.g. the user went back and
 * changed role after the generating step) must fall back to the default order.
 */
export function suggestionMatchesTarget(
  suggestion: RoadmapSuggestion | null,
  masterRoadmapId: string,
  branchSelections: string[],
): suggestion is RoadmapSuggestion {
  return (
    suggestion !== null &&
    suggestion.masterRoadmapId === masterRoadmapId &&
    suggestion.branchIds.length === branchSelections.length &&
    [...suggestion.branchIds].sort().join('|') === [...branchSelections].sort().join('|')
  )
}

const enroll = (body: EnrollBody) => apiClient.post<ApiEnvelope<{ _id: string }>>('/roadmaps', body)

/**
 * Final onboarding step. Persists the questionnaire and enrolls the user into
 * the master roadmap for their chosen role, then lands them on the dashboard.
 *
 * The AI personalization itself runs earlier, on the generating step (see
 * useRoadmapSuggestion): its topic order is pinned in the wizard store and
 * attached here as `orderedTopicIds` so the enrolled roadmap matches exactly
 * what the learner was shown. Every degraded path (no suggestion, stale
 * suggestion, server rejecting the order) enrolls with the server's default
 * order — the pre-AI behavior. Flow:
 *   1. resolve the master roadmap + its branches from the chosen role
 *   2. POST /onboarding/questionnaire  (idempotent upsert — the generating
 *      step already saved it; re-saving covers a failed suggestion run)
 *   3. POST /roadmaps                  (enroll → SUGGESTED roadmap)
 */
export function useCompleteOnboarding() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const answers = useWizardStore((s) => s.answers)
  const suggestion = useWizardStore((s) => s.suggestion)
  const resetWizard = useWizardStore((s) => s.resetWizard)

  return useMutation({
    mutationFn: async (mode: 'accept' | 'customize') => {
      // 1. Resolve which master roadmap matches the chosen role + its branches.
      const list = await apiClient.get<ApiEnvelope<BrowseRoadmap[]>>('/master-roadmaps')
      const master = matchMasterRoadmap(answers.role as string | undefined, list.data.data)
      if (!master) throw new Error('No master roadmap available to enroll into.')

      const detail = await apiClient.get<ApiEnvelope<MasterRoadmapPreview>>(
        `/master-roadmaps/${master._id}`,
      )
      // Default path per exclusive fork group — same resolution as
      // useRoadmapSuggestion, so the suggested branch set always matches here.
      const branchSelections = resolveDefaultBranchSelection(detail.data.data.branches)
      if (branchSelections.length === 0) throw new Error('Selected roadmap has no branches.')

      // 2. Persist the questionnaire (learner profile) before enrolling.
      const questionnaire = mapAnswersToQuestionnaire(answers, branchSelections)
      await apiClient.post('/onboarding/questionnaire', questionnaire)

      // 3. Enroll → the SUGGESTED roadmap, using the AI order when it applies.
      const base: EnrollBody = {
        masterRoadmapId: master._id,
        branchSelections,
        sourceType: 'SUGGESTED',
      }
      let enrollRes
      if (suggestionMatchesTarget(suggestion, master._id, branchSelections)) {
        try {
          enrollRes = await enroll({ ...base, orderedTopicIds: suggestion.orderedTopicIds })
        } catch (err) {
          // Never let the AI order block enrollment: if the server rejects it
          // (e.g. content changed since the suggestion was computed — rejected
          // before anything is written), retry once with the default order.
          if (extractApiError(err).code !== 'INVALID_TOPIC_ORDER') throw err
          logger.warn('onboarding', 'Suggested order rejected — enrolling with default order')
          enrollRes = await enroll(base)
        }
      } else {
        enrollRes = await enroll(base)
      }

      return { roleName: detail.data.data.roleName, userRoadmapId: enrollRes.data.data._id, mode }
    },
    onSuccess: async ({ userRoadmapId, mode }) => {
      resetWizard()
      await queryClient.invalidateQueries({ queryKey: ['my-roadmaps'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      // "Customize First" → the real, persistent editor (edits actually save);
      // "Accept" → straight to the dashboard.
      if (mode === 'customize' && userRoadmapId) {
        navigate(`/roadmaps/${userRoadmapId}/edit`)
      } else {
        navigate('/dashboard')
      }
    },
    onError: (err: unknown) => {
      const { code } = extractApiError(err)
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
