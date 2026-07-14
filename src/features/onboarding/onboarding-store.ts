import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

// Last user-input step. Steps beyond this (6 = AI generating, 7 = gate) are driven
// by the AI suggestion, which is intentionally NOT persisted — so a reload never
// rehydrates straight into a half-generated state with no suggestion behind it.
const LAST_INPUT_STEP = 5

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
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
    }),
    {
      // Persist step + answers so an accidental reload mid-onboarding resumes where
      // the learner left off. The suggestion is re-derived at the generating step,
      // so it is deliberately left out.
      name: 'vora-onboarding',
      version: 1,
      partialize: (state) => ({ step: state.step, answers: state.answers }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<Pick<WizardStore, 'step' | 'answers'>>
        return {
          ...current,
          answers: saved.answers ?? current.answers,
          // Clamp the resumed step to the last input step: 6/7 need the (unpersisted)
          // suggestion, so resume on the last question and let generation re-run.
          step: Math.min(Math.max(1, saved.step ?? current.step), LAST_INPUT_STEP),
          suggestion: null,
        }
      },
    },
  ),
)
