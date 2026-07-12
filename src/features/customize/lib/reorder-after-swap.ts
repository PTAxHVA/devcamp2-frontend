/**
 * Reorder the editor canvas after a fork-path switch.
 *
 * A switch removes the current branch's nodes and adds the alternative's. The
 * naive `[...remaining, ...incoming]` appends the incoming branch to the BOTTOM
 * of the canvas, which reads as if the switched-in path comes last. Instead,
 * splice the incoming nodes into the slot the FIRST removed node occupied, so
 * the new path lands where the old one was.
 *
 * Purely visual — the backend re-derives canonical order on Save — but it keeps
 * the canvas stable so the learner isn't confused by a reshuffle. Pure +
 * immutable: returns a new array, never mutates the inputs.
 */
export function reorderAfterSwap<T extends { id: string }>(
  nodes: readonly T[],
  removeIds: ReadonlySet<string>,
  incoming: readonly T[],
): T[] {
  const insertAt = nodes.findIndex((n) => removeIds.has(n.id))
  const kept = nodes.filter((n) => !removeIds.has(n.id))
  // No removed node (nothing to replace) → append, preserving prior behavior.
  if (insertAt < 0) return [...kept, ...incoming]
  // Every node before the first removed one is kept, so `kept.slice(0, insertAt)`
  // is exactly those leading nodes — the incoming branch takes the vacated slot.
  return [...kept.slice(0, insertAt), ...incoming, ...kept.slice(insertAt)]
}
