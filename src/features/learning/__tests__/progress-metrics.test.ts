import { describe, it, expect } from 'vitest'
import { computeOverallSectionProgress } from '../lib/progress-metrics'

describe('computeOverallSectionProgress (OBS-01)', () => {
  it('returns 0 for no topics', () => {
    expect(computeOverallSectionProgress([])).toBe(0)
  })

  it('returns 0 when there are sections but none completed', () => {
    expect(
      computeOverallSectionProgress([
        { sectionTotal: 5, sectionCompleted: 0 },
        { sectionTotal: 3, sectionCompleted: 0 },
      ]),
    ).toBe(0)
  })

  it('counts partial section progress, not just whole completed topics', () => {
    // 2 of 5 sections done in one topic, 0 of 5 in another → 2/10 = 20%.
    // The old topic-based math showed 0% here (no topic fully finished) — the OBS-01 bug.
    expect(
      computeOverallSectionProgress([
        { sectionTotal: 5, sectionCompleted: 2 },
        { sectionTotal: 5, sectionCompleted: 0 },
      ]),
    ).toBe(20)
  })

  it('rounds to the nearest percent', () => {
    expect(computeOverallSectionProgress([{ sectionTotal: 3, sectionCompleted: 1 }])).toBe(33)
  })

  it('returns 100 when every section is complete', () => {
    expect(
      computeOverallSectionProgress([
        { sectionTotal: 4, sectionCompleted: 4 },
        { sectionTotal: 2, sectionCompleted: 2 },
      ]),
    ).toBe(100)
  })

  it('ignores topics that have no sections', () => {
    expect(
      computeOverallSectionProgress([
        { sectionTotal: 0, sectionCompleted: 0 },
        { sectionTotal: 4, sectionCompleted: 2 },
      ]),
    ).toBe(50)
  })
})
