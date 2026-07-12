import { describe, it, expect } from 'vitest'
import { reorderAfterSwap } from '../lib/reorder-after-swap'

const node = (id: string) => ({ id })
const ids = (arr: { id: string }[]) => arr.map((n) => n.id)

describe('reorderAfterSwap', () => {
  it('splices the incoming path into the slot the removed node vacated (not the bottom)', () => {
    // Node → Express → MongoDB → Auth, switching MongoDB → PostgreSQL.
    const nodes = ['node', 'express', 'mongo', 'auth'].map(node)
    const result = reorderAfterSwap(nodes, new Set(['mongo']), [node('pg')])
    expect(ids(result)).toEqual(['node', 'express', 'pg', 'auth'])
  })

  it('takes the head slot when the first node is removed', () => {
    const nodes = ['a', 'b', 'c'].map(node)
    const result = reorderAfterSwap(nodes, new Set(['a']), [node('x')])
    expect(ids(result)).toEqual(['x', 'b', 'c'])
  })

  it('inserts a multi-node branch at the first removed position, keeping order', () => {
    const nodes = ['a', 'b', 'c', 'd', 'e'].map(node)
    const result = reorderAfterSwap(nodes, new Set(['b', 'd']), [node('x'), node('y')])
    expect(ids(result)).toEqual(['a', 'x', 'y', 'c', 'e'])
  })

  it('appends when nothing is removed (no slot to fill)', () => {
    const nodes = ['a', 'b'].map(node)
    expect(ids(reorderAfterSwap(nodes, new Set(), [node('x')]))).toEqual(['a', 'b', 'x'])
    expect(ids(reorderAfterSwap(nodes, new Set(['zzz']), [node('x')]))).toEqual(['a', 'b', 'x'])
  })

  it('does not mutate the input arrays', () => {
    const nodes = ['a', 'b', 'c'].map(node)
    const incoming = [node('x')]
    const before = ids(nodes)
    reorderAfterSwap(nodes, new Set(['b']), incoming)
    expect(ids(nodes)).toEqual(before)
    expect(incoming).toHaveLength(1)
  })
})
