import { describe, expect, it } from 'vitest'
import { normalizeWeeklyProgressCounts } from '@/features/dashboard/hooks/use-dashboard'

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
