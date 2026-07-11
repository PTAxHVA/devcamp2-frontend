import type { RoadmapSummary } from '@/features/learning/types'

/**
 * Map of MASTER roadmap id -> the user's own user-roadmap id, for every roadmap the
 * user is enrolled in. Browse / Add-role pages cross-reference a browse roadmap's `_id`
 * (a master id) to know both:
 *  - whether the user is enrolled (`.has`) — show "Continue" instead of "Use roadmap", and
 *  - which user-roadmap to open in the editor (`.get` -> /roadmaps/:userRoadmapId/edit).
 *
 * Match key: a browse roadmap's `_id` (a master id) === a my-roadmap's `roadmapId`.
 * The value is the my-roadmap's own `_id` (the user-roadmap id we navigate with). If the
 * same master appears twice (e.g. a re-enrolled roadmap), the first entry wins.
 */
export function enrolledMasterToUserRoadmapId(
  myRoadmaps: Pick<RoadmapSummary, '_id' | 'roadmapId'>[] | undefined,
): Map<string, string> {
  const map = new Map<string, string>()
  for (const r of myRoadmaps ?? []) {
    if (!map.has(r.roadmapId)) map.set(r.roadmapId, r._id)
  }
  return map
}
