import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { startSessionSync } from '@/lib/session-sync'
import { useAuthStore } from '@/stores/auth-store'
import { useWizardStore } from '@/features/onboarding/onboarding-store'
import { useQuizStore } from '@/features/quiz/quiz-store'

const userA = { id: 'A', email: 'a@x.com', username: 'a' }
const userB = { id: 'B', email: 'b@x.com', username: 'b' }

describe('startSessionSync (cross-user leak guard)', () => {
  let stop: () => void

  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().setAuth(null, null)
    useWizardStore.getState().resetWizard()
    useQuizStore.getState().reset()
    stop = startSessionSync()
  })

  afterEach(() => stop())

  it('clears persisted onboarding + quiz state when the user changes', () => {
    useAuthStore.getState().setAuth('tokA', userA)
    useWizardStore.getState().setAnswer('role', 'frontend')
    useWizardStore.getState().goToStep(3)
    useQuizStore.getState().initAttempt('a1', 't', [{ id: 'q1', type: 'mcq', content: 'q1' }])

    // Log out then in as a different learner on the same browser.
    useAuthStore.getState().setAuth('tokB', userB)

    expect(useWizardStore.getState().answers).toEqual({})
    expect(useWizardStore.getState().step).toBe(1)
    expect(useQuizStore.getState().attemptId).toBeNull()
  })

  it('does not reset when the same user re-authenticates (token refresh)', () => {
    useAuthStore.getState().setAuth('tokA', userA)
    useWizardStore.getState().setAnswer('role', 'frontend')

    useAuthStore.getState().setAuth('tokA2', userA) // same id, new token

    expect(useWizardStore.getState().answers).toEqual({ role: 'frontend' })
  })
})
