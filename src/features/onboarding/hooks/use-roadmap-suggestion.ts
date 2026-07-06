import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { BrowseRoadmap } from '@/features/roadmap/hooks/use-browse-roadmaps'
import type { MasterRoadmapPreview } from '@/features/roadmap/hooks/use-master-roadmap'
import { resolveDefaultBranchSelection } from '@/features/roadmap/lib/branch-selection'
import { useWizardStore, type RoadmapSuggestion } from '../onboarding-store'
import { mapAnswersToQuestionnaire, matchMasterRoadmap } from '../lib/map-questionnaire'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/** The part of the POST /ai/roadmap-suggest response the wizard consumes. */
interface SuggestResponse {
  suggestedTopics: { id: string; name: string }[]
  explanation: string
  source?: 'ai' | 'fallback'
}

/**
 * Runs the real F13 personalization while the "generating" step is on screen:
 *   1. resolve the master roadmap + branches for the chosen role (same
 *      derivation as useCompleteOnboarding, so enroll targets the same set)
 *   2. upsert the questionnaire — the AI reads the learner profile server-side
 *   3. POST /ai/roadmap-suggest → AI-ordered topics + a short personal reason
 *
 * Keyed by the wizard answers: changing an answer re-personalizes, and once a
 * suggestion has succeeded, back-and-forward with unchanged answers reuses the
 * cached result (StrictMode double-mounts dedupe into a single request too).
 * retry: false — on failure the step degrades to a default message and enroll
 * falls back to the server's default topic order (the pre-suggestion
 * behavior); re-entering the step after a failure intentionally tries again.
 */
export function useRoadmapSuggestion() {
  const answers = useWizardStore((s) => s.answers)

  return useQuery<RoadmapSuggestion>({
    queryKey: ['onboarding-suggestion', JSON.stringify(answers)],
    retry: false,
    staleTime: Infinity,
    // The step renders its own degrade state — keep the global error toast out.
    meta: { suppressToast: true },
    queryFn: async () => {
      const list = await apiClient.get<ApiEnvelope<BrowseRoadmap[]>>('/master-roadmaps')
      const master = matchMasterRoadmap(answers.role as string | undefined, list.data.data)
      if (!master) throw new Error('No master roadmap available to personalize.')

      const detail = await apiClient.get<ApiEnvelope<MasterRoadmapPreview>>(
        `/master-roadmaps/${master._id}`,
      )
      // Default path per exclusive fork group — MUST match useCompleteOnboarding's
      // resolution exactly, or suggestionMatchesTarget drops the AI order.
      const branchIds = resolveDefaultBranchSelection(detail.data.data.branches)
      if (branchIds.length === 0) throw new Error('Selected roadmap has no branches.')

      // The AI reads the questionnaire server-side — it must be saved first.
      await apiClient.post(
        '/onboarding/questionnaire',
        mapAnswersToQuestionnaire(answers, branchIds),
      )

      const res = await apiClient.post<ApiEnvelope<SuggestResponse>>('/ai/roadmap-suggest', {
        masterRoadmapId: master._id,
        branchSelections: branchIds,
      })
      const { suggestedTopics, explanation, source } = res.data.data

      return {
        masterRoadmapId: master._id,
        branchIds,
        orderedTopicIds: suggestedTopics.map((t) => t.id),
        topics: suggestedTopics.map((t) => ({ id: t.id, name: t.name })),
        // Boundary guard: never trust the wire shape — a missing/null
        // explanation must degrade to the default copy, not crash the reveal.
        explanation: typeof explanation === 'string' ? explanation : '',
        source,
      }
    },
  })
}
