import { useAuthStore } from '@/stores/auth-store'
import { useWizardStore } from '@/features/onboarding/onboarding-store'
import { useQuizStore } from '@/features/quiz/quiz-store'

/**
 * Clear browser-persisted, per-user flow state whenever the signed-in user changes.
 *
 * The onboarding wizard and the in-progress quiz session persist to localStorage so
 * an accidental reload doesn't lose an answer. Without this guard that persistence
 * would outlive a logout on a shared machine and leak one learner's onboarding
 * answers into the next person's flow. Every auth change (login, logout, and the
 * 401 auto-logout) funnels through auth-store.setAuth, so resetting the transient
 * stores on any user-id change keeps the resume-after-reload win while scoping it
 * to a single session.
 *
 * Returns the unsubscribe fn (unused in the app; handy for tests).
 */
export function startSessionSync(): () => void {
  return useAuthStore.subscribe((state, prev) => {
    const nextUserId = state.user?.id ?? null
    const prevUserId = prev.user?.id ?? null
    if (nextUserId === prevUserId) return
    useWizardStore.getState().resetWizard()
    useQuizStore.getState().reset()
  })
}
