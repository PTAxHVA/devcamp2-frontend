/**
 * Pure helpers backing the Customize editor's "Remove topic" flow: the prerequisite
 * guard (you can't drop a topic another on-canvas topic still requires) and the undo
 * re-insertion (put a removed topic back exactly where it was). Kept side-effect-free
 * so the rules are unit-tested without rendering the React Flow canvas.
 */

/**
 * Topics still on the canvas that list `topicId` as one of their prerequisites.
 *
 * @param canvasTopicIds ids currently on the canvas, in column order
 * @param prerequisiteIdsOf resolves a topic id to its prerequisite ids (undefined ⇒ none)
 * @param topicId the topic being removed
 * @returns the dependents' ids (empty ⇒ safe to remove)
 */
export function findDependentTopicIds(
  canvasTopicIds: readonly string[],
  prerequisiteIdsOf: (topicId: string) => readonly string[] | undefined,
  topicId: string,
): string[] {
  return canvasTopicIds.filter(
    (id) => id !== topicId && (prerequisiteIdsOf(id) ?? []).includes(topicId),
  )
}

/**
 * Re-insert a removed item at its original column index, clamping to the current
 * length so it lands at the end if the canvas has since shrunk. Returns a new array;
 * the input is not mutated.
 */
export function insertAtIndex<T>(items: readonly T[], item: T, index: number): T[] {
  const next = [...items]
  next.splice(Math.min(Math.max(index, 0), next.length), 0, item)
  return next
}

/**
 * Names of a topic's prerequisites that are STILL on the canvas. A prereq that isn't
 * currently on the canvas is dropped, so the details panel never shows a stale/removed
 * topic as a present "locked" prerequisite. (A topic can gain a prereq that is no longer
 * on the canvas — e.g. it was removed as a leaf, then a branch topic that depends on it
 * is added in parallel; that off-canvas prereq must not be shown as satisfied.)
 *
 * @param prerequisiteIds the selected topic's prerequisite ids (undefined ⇒ none)
 * @param isOnCanvas whether a topic id is currently on the canvas
 * @param nameOf resolves a topic id to its display name (undefined ⇒ unknown, dropped)
 */
export function resolveOnCanvasPrereqNames(
  prerequisiteIds: readonly string[] | undefined,
  isOnCanvas: (id: string) => boolean,
  nameOf: (id: string) => string | undefined,
): string[] {
  return (prerequisiteIds ?? [])
    .filter((id) => isOnCanvas(id))
    .map((id) => nameOf(id))
    .filter((name): name is string => !!name)
}
