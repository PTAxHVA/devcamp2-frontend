import { describe, expect, it } from 'vitest'
import { buildGhostBranches } from '@/features/roadmap/lib/build-ghost-branches'
import type { ForkableBranch } from '@/features/roadmap/lib/branch-selection'
import type { BEGraphTopic, BEGraphEdge } from '@/features/roadmap/hooks/use-roadmap-detail'
import type { BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'

const topic = (id: string, name: string, orderIndex: number): BEGraphTopic => ({
  masterTopicId: id,
  userTopicId: null,
  name,
  status: 'available',
  orderIndex,
  estimatedHours: 5,
  sectionTotal: 5,
  sectionCompleted: 0,
  prerequisiteTopicIds: [],
})

// Frontend-shaped fixture: core (dev, ts) + UI Framework fork {React | Vue | Angular}
// + Styling fork {Tailwind | Bootstrap}. Vue carries two topics to exercise the
// intra-branch dashed edge.
const masterGraph: { topics: BEGraphTopic[]; edges: BEGraphEdge[] } = {
  topics: [
    topic('dev', 'Dev Setup', 0),
    topic('ts', 'TypeScript', 1),
    topic('react', 'React', 2),
    topic('vue', 'Vue', 2),
    topic('vuex', 'Vue Router', 3),
    topic('angular', 'Angular', 2),
    topic('tailwind', 'Tailwind CSS', 3),
    topic('bootstrap', 'Bootstrap', 3),
  ],
  edges: [
    { source: 'dev', target: 'ts' },
    { source: 'ts', target: 'react' },
    { source: 'ts', target: 'vue' },
    { source: 'vue', target: 'vuex' },
    { source: 'ts', target: 'angular' },
    { source: 'ts', target: 'tailwind' },
    { source: 'ts', target: 'bootstrap' },
  ],
}

const branches: ForkableBranch[] = [
  { _id: 'b-core', name: 'Core', isMandatory: true, topicIds: ['dev', 'ts'] },
  { _id: 'b-react', name: 'React', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['react'] }, // prettier-ignore
  { _id: 'b-vue', name: 'Vue', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['vue', 'vuex'] }, // prettier-ignore
  { _id: 'b-angular', name: 'Angular', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 2, topicIds: ['angular'] }, // prettier-ignore
  { _id: 'b-tailwind', name: 'Tailwind CSS', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['tailwind'] }, // prettier-ignore
  { _id: 'b-bootstrap', name: 'Bootstrap', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['bootstrap'] }, // prettier-ignore
]

// Learner enrolled the React + Tailwind path (plus core).
const canvas = ['dev', 'ts', 'react', 'tailwind']

const dataOf = (n: { data: unknown }) => n.data as BaseNodeData

describe('buildGhostBranches', () => {
  it('ghosts every unchosen branch of each exclusive group, not the chosen one', () => {
    const overlay = buildGhostBranches({ masterGraph, canvasTopicIds: canvas, branches })
    const ids = overlay.nodes.map((n) => n.id).sort()

    // Vue (2 topics) + Angular + Bootstrap are ghosted; React + Tailwind are on canvas.
    expect(ids).toEqual(['ghost:angular', 'ghost:bootstrap', 'ghost:vue', 'ghost:vuex'])
    expect(ids).not.toContain('ghost:react')
    expect(ids).not.toContain('ghost:tailwind')
  })

  it('marks ghost nodes clickable and tags them with their branch', () => {
    const overlay = buildGhostBranches({ masterGraph, canvasTopicIds: canvas, branches })
    const vue = overlay.nodes.find((n) => n.id === 'ghost:vue')!
    expect(dataOf(vue).variant).toBe('ghost')
    expect(dataOf(vue).clickable).toBe(true)
    expect(dataOf(vue).branchId).toBe('b-vue')
    expect(dataOf(vue).branchName).toBe('Vue')
    // Not selectable/draggable — it is an inert overlay affordance.
    expect(vue.selectable).toBe(false)
  })

  it('draws a fork edge from the enrolled predecessor and intra-branch edges', () => {
    const overlay = buildGhostBranches({ masterGraph, canvasTopicIds: canvas, branches })
    // Fork cue: ts (on canvas) -> ghost:vue head.
    expect(overlay.edges).toContainEqual(
      expect.objectContaining({ source: 'ts', target: 'ghost:vue' }),
    )
    // Intra-branch: ghost:vue -> ghost:vuex (both inside the Vue branch).
    expect(overlay.edges).toContainEqual(
      expect.objectContaining({ source: 'ghost:vue', target: 'ghost:vuex' }),
    )
  })

  it('drops a branch from the overlay once its topics are on the canvas', () => {
    // Learner added Vue in parallel — vue + vuex are now on the canvas.
    const withVue = [...canvas, 'vue', 'vuex']
    const overlay = buildGhostBranches({ masterGraph, canvasTopicIds: withVue, branches })
    const ids = overlay.nodes.map((n) => n.id)
    expect(ids).not.toContain('ghost:vue')
    expect(ids).toContain('ghost:angular')
    expect(ids).toContain('ghost:bootstrap')
  })

  it('returns an empty overlay for a non-forked roadmap or before data loads', () => {
    const ungrouped: ForkableBranch[] = [{ _id: 'b1', name: 'Core', topicIds: ['dev', 'ts'] }]
    expect(buildGhostBranches({ masterGraph, canvasTopicIds: canvas, branches: ungrouped }).nodes).toEqual([]) // prettier-ignore
    expect(buildGhostBranches({ masterGraph: undefined, canvasTopicIds: canvas, branches }).nodes).toEqual([]) // prettier-ignore
    expect(buildGhostBranches({ masterGraph, canvasTopicIds: canvas, branches: undefined }).nodes).toEqual([]) // prettier-ignore
  })
})
