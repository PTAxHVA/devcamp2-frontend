import { beforeEach, describe, expect, it } from 'vitest'
import { useWizardStore } from '@/features/onboarding/onboarding-store'

const KEY = 'vora-onboarding'

describe('useWizardStore persistence (N1)', () => {
  beforeEach(() => {
    localStorage.clear()
    useWizardStore.getState().resetWizard()
  })

  it('persists step + answers so an accidental reload can resume', () => {
    useWizardStore.getState().setAnswer('role', 'frontend')
    useWizardStore.getState().goToStep(4)

    const saved = JSON.parse(localStorage.getItem(KEY)!)
    expect(saved.state.step).toBe(4)
    expect(saved.state.answers.role).toBe('frontend')
    // The suggestion is re-derived at the generating step — never persisted.
    expect(saved.state.suggestion).toBeUndefined()
  })

  it('rehydrates saved answers but clamps the step to the last input step', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        state: { step: 7, answers: { role: 'backend', level: 'beginner' } },
        version: 1,
      }),
    )

    await useWizardStore.persist.rehydrate()

    const state = useWizardStore.getState()
    expect(state.answers).toEqual({ role: 'backend', level: 'beginner' })
    expect(state.step).toBe(5) // 7 (gate) clamped so generation re-runs
    expect(state.suggestion).toBeNull()
  })

  it('resetWizard clears the persisted state (used on enroll + user change)', () => {
    useWizardStore.getState().setAnswer('role', 'frontend')
    useWizardStore.getState().resetWizard()

    const saved = JSON.parse(localStorage.getItem(KEY)!)
    expect(saved.state.step).toBe(1)
    expect(saved.state.answers).toEqual({})
  })
})
