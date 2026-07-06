import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface MistakeExplanation {
  questionId: string
  why: string
  reviewHint: string
}

export interface SectionResourceLink {
  title: string
  url: string
  type: string
}

/** Response of POST /ai/explain-mistakes. */
export interface ExplainMistakesResult {
  attemptId: string
  sectionName: string
  /** 'fallback' = Gemini was down/invalid — BE served correct answers + curated resources. */
  source: 'ai' | 'fallback'
  explanations: MistakeExplanation[]
  resources: SectionResourceLink[]
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

/** On-demand post-quiz mistake review — never auto-called, one Gemini call per click. */
export function useExplainMistakes() {
  return useMutation({
    mutationFn: async (attemptId: string) =>
      (
        await apiClient.post<ApiEnvelope<ExplainMistakesResult>>('/ai/explain-mistakes', {
          attemptId,
        })
      ).data.data,
  })
}
