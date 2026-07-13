import { describe, expect, it } from 'vitest'
import { buildEditorLayout, type EditorTopic, type EditorLayout } from '../build-editor-layout'
import type { ForkableBranch } from '@/features/roadmap/lib/branch-selection'
import type { BaseNodeData, NodeStatus } from '@/features/roadmap/components/base-roadmap-node'

const dataOf = (n: { data: unknown }) => n.data as BaseNodeData

// Frontend-shaped fixture: core (dev, ts) + UI Framework fork {React(+Next.js) |
// Vue | Angular} + Styling fork {Tailwind | Bootstrap}.
const branches: ForkableBranch[] = [
  { _id: 'b-core', name: 'Core', isMandatory: true, topicIds: ['dev', 'ts'] },
  { _id: 'b-react', name: 'React', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['react', 'nextjs'] }, // prettier-ignore
  { _id: 'b-vue', name: 'Vue', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['vue'] }, // prettier-ignore
  { _id: 'b-angular', name: 'Angular', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 2, topicIds: ['angular'] }, // prettier-ignore
  { _id: 'b-tailwind', name: 'Tailwind CSS', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['tailwind'] }, // prettier-ignore
  { _id: 'b-bootstrap', name: 'Bootstrap', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['bootstrap'] }, // prettier-ignore
]

// The FULL master graph — every branch's topics, in orderIndex order.
const allTopics: EditorTopic[] = [
  { id: 'dev', label: 'Dev Setup', orderIndex: 0 },
  { id: 'ts', label: 'TypeScript', orderIndex: 1 },
  { id: 'react', label: 'React', orderIndex: 2 },
  { id: 'nextjs', label: 'Next.js', orderIndex: 3 },
  { id: 'vue', label: 'Vue', orderIndex: 4 },
  { id: 'angular', label: 'Angular', orderIndex: 5 },
  { id: 'tailwind', label: 'Tailwind CSS', orderIndex: 6 },
  { id: 'bootstrap', label: 'Bootstrap', orderIndex: 7 },
]

// Learner is enrolled on React + Tailwind.
const enrolled = new Set(['dev', 'ts', 'react', 'nextjs', 'tailwind'])
const statusOf = (id: string): NodeStatus =>
  id === 'dev' ? 'completed' : id === 'ts' ? 'current' : 'upcoming'

const node = (layout: EditorLayout, id: string) => layout.nodes.find((n) => n.id === id)!
const ids = (nodes: EditorLayout['nodes']) => nodes.map((n) => n.id)

describe('buildEditorLayout — non-forked roadmap', () => {
  it('renders a plain vertical column, no fork labels, nothing greyed when all enrolled', () => {
    const layout = buildEditorLayout({
      topics: allTopics.slice(0, 2), // dev, ts
      branches: undefined,
      membership: new Set(['dev', 'ts']),
      statusOf,
    })
    expect(layout.nodes).toHaveLength(2)
    expect(layout.nodes.some((n) => n.id.startsWith('fork-label:'))).toBe(false)
    expect(layout.nodes.every((n) => n.position.x === 0)).toBe(true)
    expect(layout.nodes.every((n) => dataOf(n).greyed === false)).toBe(true)
    expect(layout.edges).toHaveLength(1) // dev -> ts
  })
})

describe('buildEditorLayout — full master graph', () => {
  const layout = buildEditorLayout({ topics: allTopics, branches, membership: enrolled, statusOf })

  it('keeps EVERY branch topic on the canvas (nothing disappears)', () => {
    for (const t of allTopics) expect(node(layout, t.id)).toBeDefined()
    expect(node(layout, 'fork-label:UI Framework')).toBeDefined()
    expect(node(layout, 'fork-label:Styling')).toBeDefined()
  })

  it('greys the NOT-enrolled topics and leaves enrolled ones solid', () => {
    expect(dataOf(node(layout, 'vue')).greyed).toBe(true)
    expect(dataOf(node(layout, 'angular')).greyed).toBe(true)
    expect(dataOf(node(layout, 'bootstrap')).greyed).toBe(true)
    expect(dataOf(node(layout, 'react')).greyed).toBe(false)
    expect(dataOf(node(layout, 'nextjs')).greyed).toBe(false)
    expect(dataOf(node(layout, 'tailwind')).greyed).toBe(false)
  })

  it('badges the enrolled fork HEAD as Selected, not greyed siblings or continuations', () => {
    expect(dataOf(node(layout, 'react')).badge).toBe('Selected')
    expect(dataOf(node(layout, 'tailwind')).badge).toBe('Selected')
    expect(dataOf(node(layout, 'nextjs')).badge).toBeUndefined() // continuation
    expect(dataOf(node(layout, 'vue')).badge).toBeUndefined() // greyed sibling
  })

  it('spreads a fork group as parallel columns side by side', () => {
    expect(node(layout, 'react').position.x).toBe(0)
    expect(node(layout, 'vue').position.x).toBeGreaterThan(0)
    expect(node(layout, 'angular').position.x).toBeGreaterThan(node(layout, 'vue').position.x)
    // React's continuation stays in React's column, below it.
    expect(node(layout, 'nextjs').position.x).toBe(0)
    expect(node(layout, 'nextjs').position.y).toBeGreaterThan(node(layout, 'react').position.y)
  })

  it('draws a dashed fork edge into a greyed branch head, solid into the enrolled one', () => {
    const vueEdge = layout.edges.find((e) => e.target === 'vue')!
    expect(vueEdge.source).toBe('ts') // branches off the pre-fork predecessor
    expect((vueEdge.style as { strokeDasharray?: string }).strokeDasharray).toBe('6 4')
    const reactEdge = layout.edges.find((e) => e.target === 'react')!
    expect((reactEdge.style as { strokeDasharray?: string }).strokeDasharray).toBeUndefined()
  })
})

describe('buildEditorLayout — add stays in place (does not move to the bottom)', () => {
  it('un-greys the added topic in the SAME slot; the others stay greyed', () => {
    const before = buildEditorLayout({
      topics: allTopics,
      branches,
      membership: enrolled,
      statusOf,
    })
    const after = buildEditorLayout({
      topics: allTopics,
      branches,
      membership: new Set([...enrolled, 'vue']), // add Vue in parallel
      statusOf,
    })
    // Vue is now solid, Angular still greyed — only the added topic changed.
    expect(dataOf(node(after, 'vue')).greyed).toBe(false)
    expect(dataOf(node(after, 'angular')).greyed).toBe(true)
    // Its position is IDENTICAL — the node did not move to the bottom of the column.
    expect(node(after, 'vue').position).toEqual(node(before, 'vue').position)
    // Every node keeps its slot; the node set is unchanged.
    expect(ids(after.nodes)).toEqual(ids(before.nodes))
    for (const t of allTopics) {
      expect(node(after, t.id).position).toEqual(node(before, t.id).position)
    }
  })
})

describe('buildEditorLayout — rejoin after a branch tail is removed', () => {
  it('rejoins the next band from the last ENROLLED topic, not a greyed tail', () => {
    // React enrolled but Next.js removed (greyed); Tailwind still enrolled.
    const membership = new Set(['dev', 'ts', 'react', 'tailwind'])
    const layout = buildEditorLayout({ topics: allTopics, branches, membership, statusOf })
    const tailwindEdge = layout.edges.find((e) => e.target === 'tailwind')!
    expect(tailwindEdge.source).toBe('react') // the enrolled tail, not greyed Next.js
    expect((tailwindEdge.style as { strokeDasharray?: string }).strokeDasharray).toBeUndefined()
  })
})
