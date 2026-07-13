import { describe, it, expect } from 'vitest'
import { buildActivityData, formatActivityDate } from '../build-activity-data'

describe('buildActivityData', () => {
  it('accumulates daily counts on top of the lifetime baseline', () => {
    const rows = buildActivityData(
      [
        { date: '2026-07-01', count: 2 },
        { date: '2026-07-02', count: 0 },
        { date: '2026-07-03', count: 3 },
      ],
      5,
    )
    expect(rows.map((r) => r.cumulative)).toEqual([7, 7, 10])
    expect(rows[2]).toEqual({ date: '2026-07-03', count: 3, cumulative: 10 })
  })

  it('starts the line from the baseline when the first day is empty', () => {
    const rows = buildActivityData([{ date: '2026-07-01', count: 0 }], 8)
    expect(rows[0].cumulative).toBe(8)
  })

  it('returns an empty array for an empty series', () => {
    expect(buildActivityData([], 3)).toEqual([])
  })
})

describe('formatActivityDate', () => {
  it('formats a YYYY-MM-DD date as a short UTC label', () => {
    expect(formatActivityDate('2026-07-08')).toBe('Jul 8')
  })

  it('returns the input unchanged when it is not a valid date', () => {
    expect(formatActivityDate('not-a-date')).toBe('not-a-date')
  })
})
