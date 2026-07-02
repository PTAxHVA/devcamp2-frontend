import { describe, expect, it } from 'vitest'
import { enrolledMasterRoadmapIds } from '@/features/roadmap/lib/enrolled-roadmaps'

describe('enrolledMasterRoadmapIds', () => {
  it('collects master ids by roadmapId, so Browse can match its _id against them', () => {
    // Browse roadmaps key on the MASTER id; a my-roadmap exposes that as roadmapId.
    const ids = enrolledMasterRoadmapIds([
      { roadmapId: 'master-frontend' },
      { roadmapId: 'master-backend' },
    ])
    expect(ids.has('master-frontend')).toBe(true)
    expect(ids.has('master-backend')).toBe(true)
    expect(ids.has('master-data')).toBe(false)
    expect(ids.size).toBe(2)
  })

  it('returns an empty set while roadmaps are still loading (undefined) or empty', () => {
    expect(enrolledMasterRoadmapIds(undefined).size).toBe(0)
    expect(enrolledMasterRoadmapIds([]).size).toBe(0)
  })
})
