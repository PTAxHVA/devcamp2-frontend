import { describe, expect, it } from 'vitest'
import { alignCurrentWeekActivityToLastSevenDays } from '@/features/dashboard/lib/streak-activity'

describe('alignCurrentWeekActivityToLastSevenDays', () => {
  const week = [true, false, true, false, true, false, true]

  it('maps Monday-Sunday API data directly on Sunday', () => {
    expect(alignCurrentWeekActivityToLastSevenDays(week, new Date(2026, 6, 5))).toEqual(week)
  })

  it('does not fabricate prior-week activity in a rolling view', () => {
    expect(alignCurrentWeekActivityToLastSevenDays(week, new Date(2026, 6, 1))).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
      true,
    ])
  })

  it('rejects malformed weekly data', () => {
    expect(alignCurrentWeekActivityToLastSevenDays([true], new Date(2026, 6, 1))).toEqual(
      Array(7).fill(false),
    )
  })
})
