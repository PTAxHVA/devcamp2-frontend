import { describe, it, expect } from 'vitest'
import { computeMembershipDiff, canRemoveTopic, resolveAddBlocker } from '../membership-ops'
import type { ForkableBranch } from '@/features/roadmap/lib/branch-selection'

describe('computeMembershipDiff', () => {
  it('reports added ids (present now, absent originally)', () => {
    expect(computeMembershipDiff(new Set(['a', 'b']), new Set(['a', 'b', 'c']))).toEqual({
      addTopicIds: ['c'],
      removeTopicIds: [],
    })
  })

  it('reports removed ids (present originally, absent now)', () => {
    expect(computeMembershipDiff(new Set(['a', 'b', 'c']), new Set(['a', 'b']))).toEqual({
      addTopicIds: [],
      removeTopicIds: ['c'],
    })
  })

  it('reports both when a fork branch is swapped', () => {
    expect(computeMembershipDiff(new Set(['a', 'mongo']), new Set(['a', 'pg']))).toEqual({
      addTopicIds: ['pg'],
      removeTopicIds: ['mongo'],
    })
  })

  it('is empty when membership is back to the original (Save stays disabled)', () => {
    expect(computeMembershipDiff(new Set(['a', 'b']), new Set(['b', 'a']))).toEqual({
      addTopicIds: [],
      removeTopicIds: [],
    })
  })
})

describe('canRemoveTopic', () => {
  // b requires a; c requires b.
  const prereqs: Record<string, string[]> = { a: [], b: ['a'], c: ['b'] }
  const prerequisitesOf = (id: string) => prereqs[id]
  const noProgress = () => false

  it('allows removing a leaf topic with no progress', () => {
    expect(
      canRemoveTopic({
        topicId: 'c',
        membership: new Set(['a', 'b', 'c']),
        hasProgress: noProgress,
        prerequisitesOf,
      }),
    ).toEqual({ ok: true })
  })

  it('blocks a topic the learner has already started', () => {
    expect(
      canRemoveTopic({
        topicId: 'b',
        membership: new Set(['a', 'b', 'c']),
        hasProgress: (id) => id === 'b',
        prerequisitesOf,
      }),
    ).toEqual({ ok: false, reason: 'has-progress' })
  })

  it('blocks a topic another ENROLLED topic requires, naming the dependents', () => {
    expect(
      canRemoveTopic({
        topicId: 'a',
        membership: new Set(['a', 'b', 'c']),
        hasProgress: noProgress,
        prerequisitesOf,
      }),
    ).toEqual({ ok: false, reason: 'required-by', dependentIds: ['b'] })
  })

  it('allows removing a required topic once its dependent is no longer enrolled', () => {
    // c (which requires b) has been removed already — b is now safe to remove.
    expect(
      canRemoveTopic({
        topicId: 'b',
        membership: new Set(['a', 'b']),
        hasProgress: noProgress,
        prerequisitesOf,
      }),
    ).toEqual({ ok: true })
  })

  it('blocks removing the last remaining topic', () => {
    expect(
      canRemoveTopic({
        topicId: 'a',
        membership: new Set(['a']),
        hasProgress: noProgress,
        prerequisitesOf,
      }),
    ).toEqual({ ok: false, reason: 'last-topic' })
  })
})

describe('resolveAddBlocker', () => {
  // Core (dev, ts) + UI Framework {React[react, nextjs] | Vue[vue]}.
  const branches: ForkableBranch[] = [
    { _id: 'b-core', name: 'Core', isMandatory: true, topicIds: ['dev', 'ts'] },
    { _id: 'b-react', name: 'React', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['react', 'nextjs'] }, // prettier-ignore
    { _id: 'b-vue', name: 'Vue', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['vue'] }, // prettier-ignore
  ]

  it('blocks a continuation topic on its in-branch predecessor when not enrolled', () => {
    expect(resolveAddBlocker('nextjs', branches, new Set(['dev', 'ts']))).toBe('react')
  })

  it('allows a continuation once its predecessor is enrolled', () => {
    expect(resolveAddBlocker('nextjs', branches, new Set(['dev', 'ts', 'react']))).toBeUndefined()
  })

  it('never blocks a fork head — incl. a parallel sibling (Vue while on React)', () => {
    expect(resolveAddBlocker('react', branches, new Set(['dev', 'ts']))).toBeUndefined()
    expect(resolveAddBlocker('vue', branches, new Set(['dev', 'ts', 'react']))).toBeUndefined()
  })

  it('never blocks a core topic or an unknown topic', () => {
    expect(resolveAddBlocker('ts', branches, new Set(['dev']))).toBeUndefined()
    expect(resolveAddBlocker('mystery', branches, new Set(['dev']))).toBeUndefined()
  })

  it('returns undefined when there are no branches', () => {
    expect(resolveAddBlocker('nextjs', undefined, new Set())).toBeUndefined()
  })
})
