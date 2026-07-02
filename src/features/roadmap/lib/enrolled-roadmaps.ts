import type { RoadmapSummary } from '@/features/learning/types'

/**
 * The set of MASTER roadmap ids the user is already enrolled in. Browse / Add-role
 * pages cross-reference this to show a "Continue" button instead of a re-enroll one.
 *
 * Match key: a browse roadmap's `_id` (a master roadmap id) === a my-roadmap's
 * `roadmapId` (the master id its user-roadmap points at). NOT `_id` — on a
 * RoadmapSummary `_id` is the user-roadmap's own id, so matching on it would never
 * hit and every enrolled roadmap would still offer "Use roadmap".
 */
export function enrolledMasterRoadmapIds(
  myRoadmaps: Pick<RoadmapSummary, 'roadmapId'>[] | undefined,
): Set<string> {
  return new Set((myRoadmaps ?? []).map((r) => r.roadmapId))
}
