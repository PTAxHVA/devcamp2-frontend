import { describe, it, expect } from 'vitest'
import { weeklyChartMax } from '../weekly-progress-chart.utils'

describe('weeklyChartMax', () => {
  it('defaults to a 0–10 scale for a quiet or empty week', () => {
    expect(weeklyChartMax([0, 0, 0, 0, 0, 0, 0])).toBe(10)
    expect(weeklyChartMax([])).toBe(10)
  })

  it('stays at 10 while no single day exceeds 10', () => {
    expect(weeklyChartMax([1, 3, 2, 5, 0, 0, 8])).toBe(10)
    expect(weeklyChartMax([10, 0, 0, 0, 0, 0, 0])).toBe(10)
  })

  it('grows to the next even ceiling above the busiest day', () => {
    expect(weeklyChartMax([0, 0, 11, 0, 0, 0, 0])).toBe(12)
    expect(weeklyChartMax([0, 0, 0, 0, 0, 0, 13])).toBe(14)
    expect(weeklyChartMax([17])).toBe(18)
  })

  it('always returns an even value (ticks divide evenly by 2)', () => {
    for (const peak of [0, 1, 7, 10, 11, 25, 100]) {
      expect(weeklyChartMax([peak]) % 2).toBe(0)
    }
  })
})
