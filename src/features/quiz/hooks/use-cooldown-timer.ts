import { useState, useEffect } from 'react'

/**
 * Whole seconds remaining until `target` (never negative). 0 when no target.
 * Rounded UP: with floor, isExpired flipped true up to ~1s before the server
 * deadline, so an immediate "Retry quiz" click was guaranteed to hit the
 * COOLDOWN_ACTIVE 409 and bounce back to the fail page (NEW-1).
 */
function secondsUntil(target: string | Date | null): number {
  if (!target) return 0
  return Math.max(0, Math.ceil((new Date(target).getTime() - Date.now()) / 1000))
}

/**
 * Counts down to `targetDate` (e.g. a quiz cooldown). Pass the real
 * `cooldownUntil` from the API; `null` means no cooldown (immediately expired).
 */
export function useCooldownTimer(targetDate: string | Date | null) {
  // Lazy init from the target so the first render already shows the real
  // remaining time — no "expired" flash before the first interval tick.
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(targetDate))

  useEffect(() => {
    // Reflect the current target right away (e.g. once cooldownUntil loads in),
    // then refresh every second.
    const sync = () => setSecondsLeft(secondsUntil(targetDate))
    sync()
    if (!targetDate) return
    const id = setInterval(sync, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60

  return {
    secondsLeft,
    formatted: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    isExpired: secondsLeft === 0,
  }
}
