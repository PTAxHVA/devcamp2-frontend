import { describe, expect, it } from 'vitest'
import { enrolledMasterToUserRoadmapId } from '@/features/roadmap/lib/enrolled-roadmaps'

describe('enrolledMasterToUserRoadmapId', () => {
  it('maps each master roadmapId to the user-roadmap _id, so Browse can open the editor', () => {
    // Browse roadmaps key on the MASTER id; a my-roadmap exposes that as roadmapId,
    // while its own _id is the user-roadmap id we navigate to /roadmaps/:id/edit with.
    const map = enrolledMasterToUserRoadmapId([
      { _id: 'ur-frontend', roadmapId: 'master-frontend' },
      { _id: 'ur-backend', roadmapId: 'master-backend' },
    ])
    expect(map.has('master-frontend')).toBe(true)
    expect(map.get('master-frontend')).toBe('ur-frontend')
    expect(map.get('master-backend')).toBe('ur-backend')
    expect(map.has('master-data')).toBe(false)
    expect(map.size).toBe(2)
  })

  it('keeps the first user-roadmap when the same master appears twice', () => {
    const map = enrolledMasterToUserRoadmapId([
      { _id: 'ur-1', roadmapId: 'master-frontend' },
      { _id: 'ur-2', roadmapId: 'master-frontend' },
    ])
    expect(map.get('master-frontend')).toBe('ur-1')
    expect(map.size).toBe(1)
  })

  it('returns an empty map while roadmaps are still loading (undefined) or empty', () => {
    expect(enrolledMasterToUserRoadmapId(undefined).size).toBe(0)
    expect(enrolledMasterToUserRoadmapId([]).size).toBe(0)
  })
})
