import { describe, it, expect } from 'vitest'
import { getSectionStatus } from '../section-status'

describe('getSectionStatus', () => {
  it('returns not_started when no progress row exists for the section', () => {
    expect(getSectionStatus([], 'section-1')).toBe('not_started')
  })

  it('returns not_started when only other sections have a progress row', () => {
    const rows = [{ sectionId: 'section-2', isCompleted: true }]
    expect(getSectionStatus(rows, 'section-1')).toBe('not_started')
  })

  it('returns in_progress when the row exists but isCompleted is false (submitted, failed)', () => {
    const rows = [{ sectionId: 'section-1', isCompleted: false }]
    expect(getSectionStatus(rows, 'section-1')).toBe('in_progress')
  })

  it('returns completed when the row exists and isCompleted is true (passed >= 80%)', () => {
    const rows = [{ sectionId: 'section-1', isCompleted: true }]
    expect(getSectionStatus(rows, 'section-1')).toBe('completed')
  })

  it('picks the matching row by sectionId out of several rows', () => {
    const rows = [
      { sectionId: 'section-1', isCompleted: true },
      { sectionId: 'section-2', isCompleted: false },
      { sectionId: 'section-3', isCompleted: true },
    ]
    expect(getSectionStatus(rows, 'section-2')).toBe('in_progress')
    expect(getSectionStatus(rows, 'section-3')).toBe('completed')
  })
})
