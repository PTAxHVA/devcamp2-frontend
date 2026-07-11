import { groupBranches, type ForkableBranch } from './branch-selection'

/**
 * Map onboarding answers (framework / styling / database choices) onto a concrete
 * branch selection for the learner's first roadmap: one branch per exclusive fork
 * group, plus every ungrouped (mandatory core) branch.
 *
 * For each exclusive group, pick the branch whose name matches one of the learner's
 * answers by case-insensitive substring ('tailwind' → "Tailwind CSS", 'mysql' →
 * "MySQL (with Prisma)", 'vue' → "Vue"); if nothing matches, fall back to the group's
 * default (lowest orderIndex). Branch names are distinct across groups, so a framework
 * answer never matches a styling/database branch.
 *
 * Guarantees exactly one branch per group + all ungrouped — byte-compatible with
 * resolveDefaultBranchSelection when no answer matches. Every degraded path (missing
 * answers, unmatched value, pre-fork single-branch data) therefore enrolls the old
 * default and passes the backend's one-branch-per-group guard.
 */
export function resolveBranchSelectionFromAnswers(
  branches: ForkableBranch[],
  answers: Record<string, unknown>,
): string[] {
  const { ungrouped, groups } = groupBranches(branches)

  const choices = [answers.learningFramework, answers.framework, answers.styling, answers.database]
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.toLowerCase().trim())

  const pickForGroup = (candidates: ForkableBranch[]): ForkableBranch => {
    const matched = candidates.find((branch) => {
      const name = branch.name.toLowerCase()
      return choices.some((choice) => name.includes(choice) || choice.includes(name))
    })
    return matched ?? candidates[0]!
  }

  return [...ungrouped.map((b) => b._id), ...groups.map((g) => pickForGroup(g.branches)._id)]
}
