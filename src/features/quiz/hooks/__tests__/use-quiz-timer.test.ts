import { describe, expect, it } from 'vitest'
import { calculateSecondsLeft } from '@/features/quiz/hooks/use-quiz-timer'

describe('calculateSecondsLeft', () => {
  const startedAt = '2026-07-01T00:00:00.000Z'
  const startMs = Date.parse(startedAt)

  it('derives remaining time from the server start time', () => {
    expect(calculateSecondsLeft(600, startedAt, startMs + 123_001)).toBe(477)
  })

  it('expires after the full duration, including after a suspended tab', () => {
    expect(calculateSecondsLeft(600, startedAt, startMs + 900_000)).toBe(0)
  })

  it('never exceeds the configured duration when clocks are skewed', () => {
    expect(calculateSecondsLeft(600, startedAt, startMs - 10_000)).toBe(600)
  })

  it('handles missing, invalid, and non-finite inputs safely', () => {
    expect(calculateSecondsLeft(30.9, null, startMs)).toBe(30)
    expect(calculateSecondsLeft(30, 'invalid', startMs)).toBe(30)
    expect(calculateSecondsLeft(Number.NaN, startedAt, startMs)).toBe(0)
  })
})
