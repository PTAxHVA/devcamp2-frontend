import { useState, useEffect } from 'react'

export function useQuizTimer(initialSeconds: number, enabled = true) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (!enabled) return

    // One interval for the whole countdown; the functional update avoids
    // re-subscribing a new interval on every tick.
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [enabled])

  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60

  return {
    formatted: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    isUrgent: secondsLeft <= 30 && secondsLeft > 0,
    isExpired: secondsLeft === 0,
  }
}
