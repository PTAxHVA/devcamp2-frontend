/**
 * Pure helpers for the Customize editor's membership model. The editor renders the
 * FULL master graph (every branch) and tracks a `membership` Set of enrolled topic
 * ids; adding/removing a topic only toggles that Set (nodes never move). These
 * helpers turn the Set into the save diff and enforce the remove rules — kept
 * side-effect-free so they are unit-tested without rendering React Flow.
 */
import { findDependentTopicIds } from './editor-remove-ops'

export interface MembershipDiff {
  addTopicIds: string[]
  removeTopicIds: string[]
}

/** Save diff: what to add/remove relative to the originally-enrolled set. */
export function computeMembershipDiff(
  original: ReadonlySet<string>,
  current: ReadonlySet<string>,
): MembershipDiff {
  const addTopicIds = [...current].filter((id) => !original.has(id))
  const removeTopicIds = [...original].filter((id) => !current.has(id))
  return { addTopicIds, removeTopicIds }
}

export type RemoveCheck =
  | { ok: true }
  | { ok: false; reason: 'has-progress' }
  | { ok: false; reason: 'last-topic' }
  | { ok: false; reason: 'required-by'; dependentIds: string[] }

/**
 * Whether an enrolled topic can be removed. Mirrors the backend guards so the UI
 * blocks with a clear reason BEFORE a save that would 4xx:
 * - has-progress : the learner already started it (backend refuses too)
 * - required-by  : another ENROLLED topic lists it as a prerequisite
 * - last-topic   : a roadmap must keep at least one topic
 */
export function canRemoveTopic(params: {
  topicId: string
  membership: ReadonlySet<string>
  hasProgress: (id: string) => boolean
  prerequisitesOf: (id: string) => readonly string[] | undefined
}): RemoveCheck {
  const { topicId, membership, hasProgress, prerequisitesOf } = params
  if (hasProgress(topicId)) return { ok: false, reason: 'has-progress' }
  // Only ENROLLED topics can break a prerequisite chain — check against membership.
  const dependentIds = findDependentTopicIds([...membership], prerequisitesOf, topicId)
  if (dependentIds.length > 0) return { ok: false, reason: 'required-by', dependentIds }
  if (membership.size <= 1) return { ok: false, reason: 'last-topic' }
  return { ok: true }
}
