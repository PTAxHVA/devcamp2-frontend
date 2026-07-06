import { describe, it, expect } from 'vitest'
import {
  applyBranchToggle,
  computeBranchSwap,
  deriveForkContext,
  groupBranches,
  resolveDefaultBranchSelection,
  type ForkableBranch,
} from '../lib/branch-selection'

const core: ForkableBranch = {
  _id: 'core',
  name: 'Node + Express Core',
  isMandatory: true,
  orderIndex: 0,
  topicIds: ['a', 'b', 'tail'],
}
const mongo: ForkableBranch = {
  _id: 'mongo',
  name: 'MongoDB',
  selectionGroup: 'Database',
  isMutuallyExclusive: true,
  orderIndex: 1,
  topicIds: ['m'],
}
const pg: ForkableBranch = {
  _id: 'pg',
  name: 'PostgreSQL',
  selectionGroup: 'Database',
  isMutuallyExclusive: true,
  orderIndex: 2,
  topicIds: ['p'],
}
const forked = [core, mongo, pg]

const ungroupedOnly: ForkableBranch[] = [
  { _id: 'b1', name: 'Branch 1', orderIndex: 0 },
  { _id: 'b2', name: 'Branch 2', orderIndex: 1 },
]

describe('groupBranches', () => {
  it('splits exclusive-group branches from ungrouped ones, sorted by orderIndex', () => {
    const { ungrouped, groups } = groupBranches([pg, core, mongo])
    expect(ungrouped.map((b) => b._id)).toEqual(['core'])
    expect(groups).toHaveLength(1)
    expect(groups[0].selectionGroup).toBe('Database')
    expect(groups[0].branches.map((b) => b._id)).toEqual(['mongo', 'pg'])
  })

  it('treats a grouped-but-not-exclusive branch as ungrouped', () => {
    const soft: ForkableBranch = { _id: 's', name: 'Soft', selectionGroup: 'X', orderIndex: 3 }
    const { ungrouped, groups } = groupBranches([soft, core])
    expect(groups).toHaveLength(0)
    expect(ungrouped.map((b) => b._id)).toEqual(['core', 's'])
  })
})

describe('resolveDefaultBranchSelection', () => {
  it('selects ALL branches when nothing is grouped (pre-fork behaviour, byte-identical)', () => {
    expect(resolveDefaultBranchSelection(ungroupedOnly)).toEqual(['b1', 'b2'])
  })

  it('selects ungrouped branches + the lowest-orderIndex branch per exclusive group', () => {
    expect(resolveDefaultBranchSelection(forked)).toEqual(['core', 'mongo'])
  })

  it('returns empty for no branches', () => {
    expect(resolveDefaultBranchSelection([])).toEqual([])
  })
})

describe('applyBranchToggle', () => {
  it('radio: selecting the sibling swaps it in and its group partner out', () => {
    const next = applyBranchToggle(forked, new Set(['core', 'mongo']), 'pg')
    expect([...next].sort()).toEqual(['core', 'pg'])
  })

  it('radio: clicking the already-selected branch keeps it selected', () => {
    const selected = new Set(['core', 'mongo'])
    const next = applyBranchToggle(forked, selected, 'mongo')
    expect([...next].sort()).toEqual(['core', 'mongo'])
    expect(next).not.toBe(selected) // immutable — always a new Set
  })

  it('checkbox: a mandatory branch cannot be toggled off', () => {
    const next = applyBranchToggle(forked, new Set(['core', 'mongo']), 'core')
    expect(next.has('core')).toBe(true)
  })

  it('checkbox: the last selected branch cannot be deselected (min 1)', () => {
    const next = applyBranchToggle(ungroupedOnly, new Set(['b1']), 'b1')
    expect(next.has('b1')).toBe(true)
  })

  it('checkbox: a non-mandatory branch toggles off while others stay selected', () => {
    const next = applyBranchToggle(ungroupedOnly, new Set(['b1', 'b2']), 'b2')
    expect([...next]).toEqual(['b1'])
  })

  it('ignores an unknown branch id', () => {
    const next = applyBranchToggle(forked, new Set(['core']), 'nope')
    expect([...next]).toEqual(['core'])
  })
})

describe('computeBranchSwap', () => {
  it('removes the outgoing branch topics and adds the incoming ones', () => {
    expect(computeBranchSwap(['a', 'b', 'm', 'tail'], mongo, pg)).toEqual({
      addTopicIds: ['p'],
      removeTopicIds: ['m'],
    })
  })

  it('never adds a topic already enrolled, nor removes one shared with the target', () => {
    const from: ForkableBranch = { ...mongo, topicIds: ['m', 'shared'] }
    const to: ForkableBranch = { ...pg, topicIds: ['p', 'shared'] }
    expect(computeBranchSwap(['a', 'm', 'shared', 'p'], from, to)).toEqual({
      addTopicIds: [],
      removeTopicIds: ['m'],
    })
  })
})

describe('deriveForkContext', () => {
  it('returns null when the roadmap has no exclusive group', () => {
    expect(deriveForkContext(ungroupedOnly, ['a'])).toBeNull()
  })

  it('single: reports current, alternative, fork topic and its predecessor', () => {
    const ctx = deriveForkContext(forked, ['a', 'b', 'm', 'tail'])
    expect(ctx).toMatchObject({
      state: 'single',
      selectionGroup: 'Database',
      forkTopicId: 'm',
      predecessorTopicId: 'b',
    })
    expect(ctx?.current?._id).toBe('mongo')
    expect(ctx?.alternative?._id).toBe('pg')
  })

  it('single: no predecessor when the fork topic is first in the roadmap', () => {
    const ctx = deriveForkContext(forked, ['m', 'tail'])
    expect(ctx?.state).toBe('single')
    expect(ctx?.predecessorTopicId).toBeUndefined()
  })

  it('both: a pre-fork enrollee holding both alternatives', () => {
    const ctx = deriveForkContext(forked, ['a', 'b', 'p', 'm', 'tail'])
    expect(ctx?.state).toBe('both')
  })

  it('none: neither alternative enrolled', () => {
    const ctx = deriveForkContext(forked, ['a', 'b', 'tail'])
    expect(ctx?.state).toBe('none')
  })
})
