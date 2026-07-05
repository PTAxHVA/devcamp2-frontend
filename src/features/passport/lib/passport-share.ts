/** Absolute public passport URL for a share token on the given site origin. */
export const buildPassportUrl = (origin: string, shareToken: string): string =>
  `${origin.replace(/\/+$/, '')}/p/${shareToken}`

/** LinkedIn "share offsite" URL for a passport link. */
export const buildLinkedInShareUrl = (passportUrl: string): string =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(passportUrl)}`

/** Toast copy shown right after a section quiz pass. Generic when the topic name is unknown. */
export const buildPassportNudge = (topicName?: string | null): string =>
  topicName ? `You just verified a skill in “${topicName}”!` : 'You just verified a new skill!'

/** Completion percentage for the passport gauge — zero-safe integer 0–100. */
export const calcPassportCompletionPct = (completedCount: number, totalCount: number): number =>
  totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

/** "BEGINNER" → "Beginner" for display chips. */
export const formatSkillLevel = (level: string): string =>
  level.length > 0 ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase() : level

const NUDGE_STORAGE_PREFIX = 'vora:passport-nudge:'

/** True once the nudge toast was shown for this attempt in this tab session —
 *  reopening the same /result/pass URL must not re-toast. */
export const hasNudgedAttempt = (attemptId: string): boolean => {
  try {
    return sessionStorage.getItem(NUDGE_STORAGE_PREFIX + attemptId) === '1'
  } catch {
    return false
  }
}

export const markNudgedAttempt = (attemptId: string): void => {
  try {
    sessionStorage.setItem(NUDGE_STORAGE_PREFIX + attemptId, '1')
  } catch {
    // Storage unavailable (e.g. blocked) — the nudge may repeat, harmless.
  }
}
