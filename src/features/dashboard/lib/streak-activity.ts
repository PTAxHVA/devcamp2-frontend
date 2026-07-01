const DAY_MS = 24 * 60 * 60 * 1000

/** Local calendar day index (days since epoch, local time) — DST-safe. */
export function localDayNumber(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS
}

/** Weekday index with Monday = 0 … Sunday = 6. */
export function mondayFirstWeekdayIndex(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

/**
 * Activity for the *current* week (Monday…Sunday), derived from a rolling streak.
 * A weekday is active when its calendar date falls inside the streak window
 * [lastActivity − (currentStreak − 1), lastActivity] and is not in the future.
 *
 * Used only as a fallback when the API does not return per-day counts; when it
 * does, those Monday…Sunday booleans are rendered directly. We deliberately do
 * NOT try to reconstruct a rolling "last 7 days" view, because current-week data
 * cannot represent prior-week days and would blank a real streak early in the week.
 */
export function deriveCurrentWeekActivity(
  currentStreak: number,
  lastActivityDate: string | null,
  today = new Date(),
): boolean[] {
  if (!lastActivityDate || currentStreak <= 0) return Array(7).fill(false)

  const last = new Date(lastActivityDate)
  if (Number.isNaN(last.getTime())) return Array(7).fill(false)

  const lastDay = localDayNumber(last)
  const todayDay = localDayNumber(today)
  const streakStartDay = lastDay - (currentStreak - 1)
  const mondayDay = todayDay - mondayFirstWeekdayIndex(today)

  return Array.from({ length: 7 }, (_, i) => {
    const day = mondayDay + i
    return day <= todayDay && day >= streakStartDay && day <= lastDay
  })
}
