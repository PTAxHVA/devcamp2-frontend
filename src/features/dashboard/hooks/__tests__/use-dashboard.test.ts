import { describe, expect, it } from 'vitest'
import {
  deriveWeeklyCountsFromStreak,
  normalizeWeeklyProgressCounts,
} from '@/features/dashboard/hooks/use-dashboard'

/**
 * This is the gate that decides whether the dashboard Weekly Progress chart shows.
 * The backend now returns a 7-day `weeklyProgress` array; the chart must render for
 * a valid one and stay hidden (never fabricate bars) for a malformed one.
 */
describe('normalizeWeeklyProgressCounts', () => {
  it('accepts a 7-length numeric array (the BE weeklyProgress shape)', () => {
    expect(normalizeWeeklyProgressCounts([0, 1, 2, 0, 3, 0, 5])).toEqual([0, 1, 2, 0, 3, 0, 5])
  })

  it('accepts the { counts } envelope shape', () => {
    expect(normalizeWeeklyProgressCounts({ counts: [1, 0, 0, 0, 0, 0, 0] })).toEqual([
      1, 0, 0, 0, 0, 0, 0,
    ])
  })

  it('rejects wrong-length arrays so the chart stays hidden', () => {
    expect(normalizeWeeklyProgressCounts([1, 2, 3])).toBeUndefined()
    expect(normalizeWeeklyProgressCounts([0, 0, 0, 0, 0, 0, 0, 0])).toBeUndefined()
  })

  it('rejects non-numeric / negative entries rather than coercing them', () => {
    expect(normalizeWeeklyProgressCounts([0, 1, null, 2, 3, 4, 5])).toBeUndefined()
    expect(normalizeWeeklyProgressCounts([0, -1, 0, 0, 0, 0, 0])).toBeUndefined()
    expect(normalizeWeeklyProgressCounts(undefined)).toBeUndefined()
  })
})

/**
 * Fallback used when the BE returns no usable `weeklyProgress` (older deploy /
 * cold-start race). It keeps the Weekly Progress chart consistent with the streak
 * calendar instead of leaving the chart empty while the calendar shows "today".
 */
describe('deriveWeeklyCountsFromStreak', () => {
  it('marks the streak window this week as 1s (matches the streak calendar)', () => {
    // Wednesday 2026-07-08, 3-day streak ending today → Mon, Tue, Wed active.
    expect(deriveWeeklyCountsFromStreak(3, '2026-07-08', new Date(2026, 6, 8))).toEqual([
      1, 1, 1, 0, 0, 0, 0,
    ])
  })

  it('marks only today when the streak is a single day', () => {
    // Monday 2026-07-06, streak of 1 → only Monday active.
    expect(deriveWeeklyCountsFromStreak(1, '2026-07-06', new Date(2026, 6, 6))).toEqual([
      1, 0, 0, 0, 0, 0, 0,
    ])
  })

  it('returns undefined when there is no activity so the chart stays hidden', () => {
    expect(deriveWeeklyCountsFromStreak(0, null)).toBeUndefined()
    expect(deriveWeeklyCountsFromStreak(3, 'invalid', new Date(2026, 6, 8))).toBeUndefined()
  })
})
