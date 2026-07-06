/**
 * Pure helpers for mutually-exclusive branch groups (the roadmap "fork").
 *
 * A master roadmap may carry branches tagged with a `selectionGroup` +
 * `isMutuallyExclusive` (e.g. Database: MongoDB vs PostgreSQL). The backend
 * rejects enrolling more than one branch per exclusive group
 * (BRANCH_GROUP_CONFLICT), so every enroll caller resolves its selection
 * through these helpers. Branches without a group behave exactly as before —
 * on pre-fork data (one ungrouped branch per roadmap) the default selection
 * is byte-identical to the old "all branches" payload.
 */

export interface ForkableBranch {
  _id: string
  name: string
  description?: string
  selectionGroup?: string | null
  isMutuallyExclusive?: boolean
  isMandatory?: boolean
  orderIndex?: number
  topicCount?: number
  /** Ordered master-topic ids of this branch (fork UIs map enrollment to a branch with these). */
  topicIds?: string[]
}

export interface BranchGroup<T extends ForkableBranch = ForkableBranch> {
  selectionGroup: string
  /** Members sorted by orderIndex — the first one is the default choice. */
  branches: T[]
}

const byOrderIndex = (a: ForkableBranch, b: ForkableBranch) =>
  (a.orderIndex ?? 0) - (b.orderIndex ?? 0)

const isExclusive = (branch: ForkableBranch): boolean =>
  Boolean(branch.selectionGroup && branch.isMutuallyExclusive)

/** Split branches into ungrouped (checkbox semantics) and exclusive groups (radio semantics). */
export function groupBranches<T extends ForkableBranch>(
  branches: T[],
): {
  ungrouped: T[]
  groups: BranchGroup<T>[]
} {
  const ungrouped = branches.filter((b) => !isExclusive(b)).sort(byOrderIndex)
  const byGroup = new Map<string, T[]>()
  for (const branch of branches) {
    if (!isExclusive(branch)) continue
    const key = branch.selectionGroup as string
    byGroup.set(key, [...(byGroup.get(key) ?? []), branch])
  }
  const groups: BranchGroup<T>[] = [...byGroup.entries()]
    .map(([selectionGroup, members]) => ({
      selectionGroup,
      branches: [...members].sort(byOrderIndex),
    }))
    .sort((a, b) => byOrderIndex(a.branches[0]!, b.branches[0]!))
  return { ungrouped, groups }
}

/**
 * Default enroll selection: every ungrouped branch + the lowest-orderIndex
 * branch of each exclusive group. Used by onboarding (no fork UI), the browse
 * card quick-enroll and the preview modal's initial state.
 */
export function resolveDefaultBranchSelection(branches: ForkableBranch[]): string[] {
  const { ungrouped, groups } = groupBranches(branches)
  return [...ungrouped.map((b) => b._id), ...groups.map((g) => g.branches[0]!._id)]
}

/**
 * Apply a click on a branch row. Immutable — returns a new Set.
 * - Exclusive-group branch: radio semantics — selecting swaps out its group
 *   siblings; clicking the selected one keeps it (a radio can't deselect).
 * - Ungrouped branch: checkbox semantics — mandatory branches can't be
 *   toggled off, and the last selected branch can't be deselected (min 1).
 */
export function applyBranchToggle(
  branches: ForkableBranch[],
  selected: ReadonlySet<string>,
  branchId: string,
): Set<string> {
  const branch = branches.find((b) => b._id === branchId)
  if (!branch) return new Set(selected)

  if (isExclusive(branch)) {
    if (selected.has(branchId)) return new Set(selected)
    const siblings = branches.filter(
      (b) => isExclusive(b) && b.selectionGroup === branch.selectionGroup,
    )
    const next = new Set(selected)
    for (const sibling of siblings) next.delete(sibling._id)
    next.add(branchId)
    return next
  }

  const next = new Set(selected)
  if (selected.has(branchId)) {
    if (!branch.isMandatory && selected.size > 1) next.delete(branchId)
  } else {
    next.add(branchId)
  }
  return next
}

/** Topic-id diff that moves an enrollment from one fork branch to its sibling. */
export function computeBranchSwap(
  enrolledTopicIds: readonly string[],
  fromBranch: ForkableBranch,
  toBranch: ForkableBranch,
): { addTopicIds: string[]; removeTopicIds: string[] } {
  const enrolled = new Set(enrolledTopicIds)
  const toIds = toBranch.topicIds ?? []
  const toSet = new Set(toIds)
  const fromIds = fromBranch.topicIds ?? []
  return {
    addTopicIds: toIds.filter((id) => !enrolled.has(id)),
    removeTopicIds: fromIds.filter((id) => enrolled.has(id) && !toSet.has(id)),
  }
}

export interface ForkContext {
  /** single = exactly one side of the fork is enrolled; both = pre-fork enrollee holds both sides. */
  state: 'single' | 'both' | 'none'
  selectionGroup: string
  current?: ForkableBranch
  alternative?: ForkableBranch
  /** First enrolled topic that belongs to the current fork branch. */
  forkTopicId?: string
  /** Enrolled topic right before the fork topic (dashed ghost edge source). */
  predecessorTopicId?: string
}

/**
 * Map an enrollment onto the roadmap's (first) exclusive group. Returns null
 * when the master roadmap has no fork, so callers can skip all fork UI.
 *
 * Demo-scale: `alternative` is the first OTHER branch of the group — with a
 * 3-way fork the ghost node + switch panel would surface only one alternative
 * (the preview radio already handles N branches). Extend if a group ever
 * ships more than two branches.
 */
export function deriveForkContext(
  branches: ForkableBranch[],
  enrolledTopicIdsInOrder: readonly string[],
): ForkContext | null {
  const group = groupBranches(branches).groups.find((g) => g.branches.length >= 2)
  if (!group) return null

  const enrolled = new Set(enrolledTopicIdsInOrder)
  const matched = group.branches.filter((b) => (b.topicIds ?? []).some((id) => enrolled.has(id)))

  if (matched.length === 0) return { state: 'none', selectionGroup: group.selectionGroup }
  if (matched.length > 1) return { state: 'both', selectionGroup: group.selectionGroup }

  const current = matched[0]!
  const alternative = group.branches.find((b) => b._id !== current._id)
  const currentTopicIds = new Set(current.topicIds ?? [])
  const forkTopicIndex = enrolledTopicIdsInOrder.findIndex((id) => currentTopicIds.has(id))
  return {
    state: 'single',
    selectionGroup: group.selectionGroup,
    current,
    alternative,
    forkTopicId: enrolledTopicIdsInOrder[forkTopicIndex],
    predecessorTopicId:
      forkTopicIndex > 0 ? enrolledTopicIdsInOrder[forkTopicIndex - 1] : undefined,
  }
}
