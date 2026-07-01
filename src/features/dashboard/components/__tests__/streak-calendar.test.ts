import { describe, expect, it } from 'vitest'
import {
  deriveCurrentWeekActivity,
  mondayFirstWeekdayIndex,
} from '@/features/dashboard/lib/streak-activity'

describe('mondayFirstWeekdayIndex', () => {
  it('maps Monday to 0 and Sunday to 6', () => {
    expect(mondayFirstWeekdayIndex(new Date(2026, 6, 6))).toBe(0) // Mon 2026-07-06
    expect(mondayFirstWeekdayIndex(new Date(2026, 6, 5))).toBe(6) // Sun 2026-07-05
  })
})

describe('deriveCurrentWeekActivity', () => {
  it('marks the streak window within the current week up to today', () => {
    // Wednesday 2026-07-08, 3-day streak ending today → Mon, Tue, Wed active.
    expect(deriveCurrentWeekActivity(3, '2026-07-08', new Date(2026, 6, 8))).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
    ])
  })

  it('never marks future weekdays active', () => {
    // Monday 2026-07-06, streak of 5 ending today → only Monday active this week.
    expect(deriveCurrentWeekActivity(5, '2026-07-06', new Date(2026, 6, 6))).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ])
  })

  it('excludes today when the last activity was yesterday', () => {
    // Wednesday 2026-07-08, last activity Tue 2026-07-07 → Mon, Tue active, Wed (today) not.
    expect(deriveCurrentWeekActivity(2, '2026-07-07', new Date(2026, 6, 8))).toEqual([
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ])
  })

  it('returns all-false for empty or malformed input', () => {
    expect(deriveCurrentWeekActivity(0, null)).toEqual(Array(7).fill(false))
    expect(deriveCurrentWeekActivity(3, 'invalid', new Date(2026, 6, 8))).toEqual(
      Array(7).fill(false),
    )
  })
})
