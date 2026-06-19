import { useState, useEffect } from 'react'

export function useCooldownTimer(targetDate: string | Date | null) {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (!targetDate) return

    const target = new Date(targetDate).getTime()

    const tick = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((target - now) / 1000))
      setSecondsLeft(remaining)
    }

    // Chạy ngay lập tức lần đầu để UI không bị delay 1s
    tick()
    const id = setInterval(tick, 1000)

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
