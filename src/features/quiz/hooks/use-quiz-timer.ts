import { useState, useEffect } from 'react'

export function calculateSecondsLeft(
  initialSeconds: number,
  startedAt: string | null,
  nowMs: number,
): number {
  const safeDuration = Number.isFinite(initialSeconds) ? Math.max(0, Math.floor(initialSeconds)) : 0
  if (!startedAt) return safeDuration

  const startedAtMs = Date.parse(startedAt)
  if (!Number.isFinite(startedAtMs)) return safeDuration

  return Math.min(
    safeDuration,
    Math.max(0, Math.ceil((startedAtMs + safeDuration * 1000 - nowMs) / 1000)),
  )
}

export function useQuizTimer(
  initialSeconds: number,
  enabled = true,
  startedAt: string | null = null,
) {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return

    // Derive from the backend start time instead of decrementing local state.
    // This stays correct after a suspended tab, refresh, or resumed attempt.
    const updateNow = () => setNowMs(Date.now())
    updateNow()
    const id = setInterval(updateNow, 250)
    document.addEventListener('visibilitychange', updateNow)
    window.addEventListener('focus', updateNow)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', updateNow)
      window.removeEventListener('focus', updateNow)
    }
  }, [enabled])

  const secondsLeft = calculateSecondsLeft(initialSeconds, startedAt, nowMs)

  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60

  return {
    formatted: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    isUrgent: secondsLeft <= 30 && secondsLeft > 0,
    isExpired: secondsLeft === 0,
  }
}
