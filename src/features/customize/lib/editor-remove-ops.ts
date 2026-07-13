/**
 * Pure helpers backing the Customize editor's "Remove topic" flow: the prerequisite
 * guard (you can't drop a topic another ENROLLED topic still requires) and resolving
 * a topic's still-enrolled prerequisite names for the details panel. Kept
 * side-effect-free so the rules are unit-tested without rendering the React Flow canvas.
 */

/**
 * Enrolled topics that list `topicId` as one of their prerequisites.
 *
 * @param enrolledTopicIds ids currently enrolled (the membership set)
 * @param prerequisiteIdsOf resolves a topic id to its prerequisite ids (undefined ⇒ none)
 * @param topicId the topic being removed
 * @returns the dependents' ids (empty ⇒ safe to remove)
 */
export function findDependentTopicIds(
  enrolledTopicIds: readonly string[],
  prerequisiteIdsOf: (topicId: string) => readonly string[] | undefined,
  topicId: string,
): string[] {
  return enrolledTopicIds.filter(
    (id) => id !== topicId && (prerequisiteIdsOf(id) ?? []).includes(topicId),
  )
}

/**
 * Names of a topic's prerequisites that are STILL enrolled. A prereq that isn't
 * currently enrolled is dropped, so the details panel never shows a not-in-path
 * topic as a present "locked" prerequisite.
 *
 * @param prerequisiteIds the selected topic's prerequisite ids (undefined ⇒ none)
 * @param isEnrolled whether a topic id is currently enrolled (in the membership set)
 * @param nameOf resolves a topic id to its display name (undefined ⇒ unknown, dropped)
 */
export function resolveOnCanvasPrereqNames(
  prerequisiteIds: readonly string[] | undefined,
  isEnrolled: (id: string) => boolean,
  nameOf: (id: string) => string | undefined,
): string[] {
  return (prerequisiteIds ?? [])
    .filter((id) => isEnrolled(id))
    .map((id) => nameOf(id))
    .filter((name): name is string => !!name)
}
