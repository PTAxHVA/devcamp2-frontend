import { describe, it, expect } from 'vitest'
import { findDependentTopicIds, resolveOnCanvasPrereqNames } from '../lib/editor-remove-ops'

describe('findDependentTopicIds', () => {
  // b requires a; c requires b.
  const prereqs: Record<string, string[]> = { a: [], b: ['a'], c: ['b'] }
  const prereqsOf = (id: string) => prereqs[id]

  it('returns the on-canvas topics that require the target', () => {
    expect(findDependentTopicIds(['a', 'b', 'c'], prereqsOf, 'a')).toEqual(['b'])
  })

  it('is empty when nothing depends on the target', () => {
    expect(findDependentTopicIds(['a', 'b', 'c'], prereqsOf, 'c')).toEqual([])
  })

  it('excludes the target itself even if self-referential', () => {
    expect(findDependentTopicIds(['x'], () => ['x'], 'x')).toEqual([])
  })

  it('only counts dependents still on the canvas', () => {
    // c requires b, but c has been removed — b is now safe to remove.
    expect(findDependentTopicIds(['a', 'b'], prereqsOf, 'b')).toEqual([])
  })

  it('treats an unknown/undefined prerequisite list as no dependency', () => {
    expect(findDependentTopicIds(['a', 'b'], () => undefined, 'a')).toEqual([])
  })
})

describe('resolveOnCanvasPrereqNames', () => {
  const names: Record<string, string> = { a: 'HTML', b: 'CSS', c: 'JavaScript' }
  const nameOf = (id: string) => names[id]

  it('names prerequisites that are on the canvas', () => {
    const onCanvas = (id: string) => ['a', 'b', 'c'].includes(id)
    expect(resolveOnCanvasPrereqNames(['a', 'b'], onCanvas, nameOf)).toEqual(['HTML', 'CSS'])
  })

  it('drops a prerequisite that is no longer on the canvas (removed leaf, then dependent added)', () => {
    // 'a' was removed as a leaf; a later-added topic still lists it as a prerequisite.
    const onCanvas = (id: string) => id !== 'a'
    expect(resolveOnCanvasPrereqNames(['a', 'b'], onCanvas, nameOf)).toEqual(['CSS'])
  })

  it('drops an unknown id (no name resolvable)', () => {
    const onCanvas = () => true
    expect(resolveOnCanvasPrereqNames(['a', 'zzz'], onCanvas, nameOf)).toEqual(['HTML'])
  })

  it('returns empty for undefined or empty prerequisite lists', () => {
    expect(resolveOnCanvasPrereqNames(undefined, () => true, nameOf)).toEqual([])
    expect(resolveOnCanvasPrereqNames([], () => true, nameOf)).toEqual([])
  })
})
