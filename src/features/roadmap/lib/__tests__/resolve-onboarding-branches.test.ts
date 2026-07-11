import { describe, expect, it } from 'vitest'
import { resolveBranchSelectionFromAnswers } from '@/features/roadmap/lib/resolve-onboarding-branches'
import { resolveDefaultBranchSelection } from '@/features/roadmap/lib/branch-selection'
import type { ForkableBranch } from '@/features/roadmap/lib/branch-selection'

const ex = (
  _id: string,
  name: string,
  selectionGroup: string,
  orderIndex: number,
): ForkableBranch => ({ _id, name, selectionGroup, isMutuallyExclusive: true, orderIndex })

const feBranches: ForkableBranch[] = [
  { _id: 'core', name: 'Frontend Core', isMandatory: true },
  ex('react', 'React', 'UI Framework', 0),
  ex('vue', 'Vue', 'UI Framework', 1),
  ex('angular', 'Angular', 'UI Framework', 2),
  ex('tailwind', 'Tailwind CSS', 'Styling', 0),
  ex('bootstrap', 'Bootstrap', 'Styling', 1),
]

const beBranches: ForkableBranch[] = [
  { _id: 'be-core', name: 'Node + Express Core', isMandatory: true },
  ex('mongo', 'MongoDB', 'Database', 0),
  ex('postgres', 'PostgreSQL', 'Database', 1),
  ex('mysql', 'MySQL (with Prisma)', 'Database', 2),
]

describe('resolveBranchSelectionFromAnswers', () => {
  it('maps framework + styling answers to their branches', () => {
    const ids = resolveBranchSelectionFromAnswers(feBranches, {
      learningFramework: 'vue',
      styling: 'bootstrap',
    })
    expect(ids).toEqual(['core', 'vue', 'bootstrap'])
  })

  it('matches a substring branch name (mysql -> "MySQL (with Prisma)")', () => {
    expect(resolveBranchSelectionFromAnswers(beBranches, { database: 'mysql' })).toEqual([
      'be-core',
      'mysql',
    ])
  })

  it('falls back to the group default for an unanswered or unmatched group', () => {
    // styling unanswered -> default Tailwind; framework "svelte" unmatched -> default React.
    expect(resolveBranchSelectionFromAnswers(feBranches, { learningFramework: 'react' })).toEqual([
      'core',
      'react',
      'tailwind',
    ])
    expect(resolveBranchSelectionFromAnswers(feBranches, { learningFramework: 'svelte' })).toEqual([
      'core',
      'react',
      'tailwind',
    ])
  })

  it('is byte-identical to the default resolution when no answer matches', () => {
    expect(resolveBranchSelectionFromAnswers(feBranches, {})).toEqual(
      resolveDefaultBranchSelection(feBranches),
    )
    // Pre-fork data (a single ungrouped branch) resolves to that branch, unchanged.
    const preFork: ForkableBranch[] = [{ _id: 'only', name: 'Frontend', isMandatory: true }]
    expect(resolveBranchSelectionFromAnswers(preFork, { learningFramework: 'vue' })).toEqual(
      resolveDefaultBranchSelection(preFork),
    )
  })

  it('does not cross-match a framework answer onto a styling/database branch', () => {
    // "react" must not select any Styling branch; that group still gets its default.
    const ids = resolveBranchSelectionFromAnswers(feBranches, { learningFramework: 'react' })
    expect(ids).toContain('tailwind')
    expect(ids).not.toContain('bootstrap')
  })
})
