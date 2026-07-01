import { describe, expect, it } from 'vitest'
import { normalizeBrowseRoadmapFilters } from '@/features/roadmap/hooks/use-browse-roadmaps'

describe('normalizeBrowseRoadmapFilters', () => {
  it('omits default and blank values instead of sending fake filters', () => {
    expect(
      normalizeBrowseRoadmapFilters({
        role: ' all ',
        difficulty: 'ALL',
        duration: '  ',
        search: '',
      }),
    ).toEqual({})
  })

  it('preserves real difficulty and duration values', () => {
    expect(
      normalizeBrowseRoadmapFilters({
        difficulty: ' Beginner ',
        duration: '8-10 weeks',
      }),
    ).toEqual({ difficulty: 'Beginner', duration: '8-10 weeks' })
  })
})
