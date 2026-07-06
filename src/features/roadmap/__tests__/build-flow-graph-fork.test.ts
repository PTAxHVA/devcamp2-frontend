import { describe, it, expect } from 'vitest'
import { buildFlowGraph } from '../lib/build-flow-graph'
import type { BERoadmapDetail, BEGraphTopic } from '../hooks/use-roadmap-detail'
import type { ForkContext } from '../lib/branch-selection'

const topic = (id: string, orderIndex: number): BEGraphTopic => ({
  masterTopicId: id,
  userTopicId: `u-${id}`,
  name: id.toUpperCase(),
  status: 'available',
  orderIndex,
  estimatedHours: 2,
  sectionTotal: 3,
  sectionCompleted: 0,
  prerequisiteTopicIds: [],
})

const detail = (): BERoadmapDetail => ({
  roadmap: {
    userRoadmapId: 'ur1',
    masterRoadmapId: 'm1',
    roleName: 'Backend Web Developer',
    sourceType: 'SUGGESTED',
    isActive: true,
  },
  topics: [topic('a', 0), topic('b', 1), topic('m', 2), topic('tail', 3)],
  edges: [],
})

const singleFork: ForkContext = {
  state: 'single',
  selectionGroup: 'Database',
  current: { _id: 'mongo', name: 'MongoDB', topicIds: ['m'] },
  alternative: { _id: 'pg', name: 'PostgreSQL', topicIds: ['p'] },
  forkTopicId: 'm',
  predecessorTopicId: 'b',
}

describe('buildFlowGraph fork indicator', () => {
  it('renders exactly as before when no forkContext is passed', () => {
    const { nodes, edges } = buildFlowGraph(detail(), { synthesizeSequentialEdges: true })
    expect(nodes).toHaveLength(4)
    expect(edges).toHaveLength(3)
    expect(nodes.every((n) => !n.id.startsWith('ghost:'))).toBe(true)
  })

  it('appends one inert ghost node + one dashed edge for the not-chosen path', () => {
    const { nodes, edges } = buildFlowGraph(detail(), {
      synthesizeSequentialEdges: true,
      forkContext: singleFork,
    })

    expect(nodes).toHaveLength(5)
    const ghost = nodes.find((n) => n.id === 'ghost:pg')
    expect(ghost).toBeDefined()
    expect(ghost?.selectable).toBe(false)
    expect(ghost?.draggable).toBe(false)
    expect(ghost?.data.variant).toBe('ghost')
    expect(ghost?.data.label).toBe('PostgreSQL')
    // Beside the chosen fork topic (index 2 in the column), offset to the right.
    expect(ghost?.position).toEqual({ x: 320, y: 2 * 140 })

    expect(edges).toHaveLength(4)
    const ghostEdge = edges.find((e) => e.target === 'ghost:pg')
    expect(ghostEdge?.source).toBe('b')
    expect(ghostEdge?.style).toMatchObject({ strokeDasharray: '6 4' })
  })

  it('skips the ghost when the fork has no predecessor to hang the edge off', () => {
    const { nodes, edges } = buildFlowGraph(detail(), {
      synthesizeSequentialEdges: true,
      forkContext: { ...singleFork, predecessorTopicId: undefined },
    })
    expect(nodes).toHaveLength(4)
    expect(edges.every((e) => !String(e.target).startsWith('ghost:'))).toBe(true)
  })

  it('skips the ghost for both/none states (pre-fork enrollee, removed path)', () => {
    for (const state of ['both', 'none'] as const) {
      const { nodes } = buildFlowGraph(detail(), {
        forkContext: { state, selectionGroup: 'Database' },
      })
      expect(nodes).toHaveLength(4)
    }
  })
})
