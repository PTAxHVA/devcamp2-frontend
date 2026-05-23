import { create } from 'zustand'

type AnswerValue = string | number | boolean | string[] | null | undefined
interface WizardAnswers {
  [key: string]: AnswerValue
}
interface WizardStore {
  step: number
  answers: WizardAnswers

  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void

  setAnswer: (key: string, value: AnswerValue) => void
  resetWizard: () => void
}
export const useWizardStore = create<WizardStore>((set) => ({
  // Initial State
  step: 1,
  answers: {},

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

  // Reset
  resetWizard: () => set({ step: 1, answers: {} }),
}))
