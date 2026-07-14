import { describe, it, expect } from 'vitest'
import { isRoadmapComplete } from '../lib/roadmap-completion'

describe('isRoadmapComplete', () => {
  it('returns false for an empty roadmap (all topics removed in the editor)', () => {
    expect(isRoadmapComplete([])).toBe(false)
  })

  it('returns false while any topic still has sections left', () => {
    expect(
      isRoadmapComplete([
        { sectionTotal: 2, sectionCompleted: 2 },
        { sectionTotal: 3, sectionCompleted: 1 },
      ]),
    ).toBe(false)
  })

  it('returns false for a topic with no sections (can never be verified done)', () => {
    expect(isRoadmapComplete([{ sectionTotal: 0, sectionCompleted: 0 }])).toBe(false)
  })

  it('returns true when every topic has all its sections complete', () => {
    expect(
      isRoadmapComplete([
        { sectionTotal: 2, sectionCompleted: 2 },
        { sectionTotal: 3, sectionCompleted: 3 },
      ]),
    ).toBe(true)
  })

  it('returns true for a single fully-completed topic (edit-to-100%)', () => {
    expect(isRoadmapComplete([{ sectionTotal: 4, sectionCompleted: 4 }])).toBe(true)
  })
})
