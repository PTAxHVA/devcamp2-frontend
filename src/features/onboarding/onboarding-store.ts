import { create } from 'zustand'

type AnswerValue = string | number | boolean | string[] | null | undefined
interface WizardAnswers {
  [key: string]: AnswerValue
}

/** One topic of the AI-suggested order (display + enroll only need id + name). */
export interface SuggestedTopic {
  id: string
  name: string
}

/**
 * Result of POST /ai/roadmap-suggest captured at the generating step so the
 * gate's enroll can reuse the exact AI order. masterRoadmapId + branchIds pin
 * the suggestion to the roadmap it was computed for — enroll drops a stale
 * suggestion (e.g. the user went back and changed role) instead of sending it.
 */
export interface RoadmapSuggestion {
  masterRoadmapId: string
  branchIds: string[]
  orderedTopicIds: string[]
  topics: SuggestedTopic[]
  explanation: string
  /** 'fallback' = server degraded (Gemini down) — the reveal shows default copy instead. */
  source?: 'ai' | 'fallback'
}

interface WizardStore {
  step: number
  answers: WizardAnswers
  suggestion: RoadmapSuggestion | null

  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void

  setAnswer: (key: string, value: AnswerValue) => void
  setSuggestion: (suggestion: RoadmapSuggestion | null) => void
  resetWizard: () => void
}
export const useWizardStore = create<WizardStore>((set) => ({
  // Initial State
  step: 1,
  answers: {},
  suggestion: null,

  // Navigation
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  goToStep: (step) => set({ step }),

  // Answers
  setAnswer: (key, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [key]: value,
      },
    })),

  // AI suggestion (pinned when the learner leaves the generating step)
  setSuggestion: (suggestion) => set({ suggestion }),

  // Reset
  resetWizard: () => set({ step: 1, answers: {}, suggestion: null }),
}))
