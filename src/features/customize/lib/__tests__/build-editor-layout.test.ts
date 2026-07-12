import { describe, expect, it } from 'vitest'
import { buildEditorLayout, type EditorCanvasTopic } from '../build-editor-layout'
import type { ForkableBranch } from '@/features/roadmap/lib/branch-selection'
import type { BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'

const dataOf = (n: { data: unknown }) => n.data as BaseNodeData

// Frontend-shaped fixture: core (dev, ts) + UI Framework fork {React(+Next.js) |
// Vue | Angular} + Styling fork {Tailwind | Bootstrap}. Learner is on React + Tailwind.
const branches: ForkableBranch[] = [
  { _id: 'b-core', name: 'Core', isMandatory: true, topicIds: ['dev', 'ts'] },
  { _id: 'b-react', name: 'React', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['react', 'nextjs'] }, // prettier-ignore
  { _id: 'b-vue', name: 'Vue', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['vue'] }, // prettier-ignore
  { _id: 'b-angular', name: 'Angular', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 2, topicIds: ['angular'] }, // prettier-ignore
  { _id: 'b-tailwind', name: 'Tailwind CSS', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 0, topicIds: ['tailwind'] }, // prettier-ignore
  { _id: 'b-bootstrap', name: 'Bootstrap', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 1, topicIds: ['bootstrap'] }, // prettier-ignore
]

const canvas: EditorCanvasTopic[] = [
  { id: 'dev', label: 'Dev Setup', status: 'completed' },
  { id: 'ts', label: 'TypeScript', status: 'current' },
  { id: 'react', label: 'React', status: 'upcoming' },
  { id: 'nextjs', label: 'Next.js', status: 'upcoming' },
  { id: 'tailwind', label: 'Tailwind CSS', status: 'upcoming' },
]

const ids = (nodes: { id: string }[]) => nodes.map((n) => n.id)
const node = (layout: { nodes: { id: string }[] }, id: string) =>
  layout.nodes.find((n) => n.id === id)!

describe('buildEditorLayout — non-forked roadmap', () => {
  it('renders a plain vertical column with no fork labels, ghosts or badges', () => {
    const layout = buildEditorLayout({ canvasTopics: canvas, branches: undefined })
    expect(layout.nodes).toHaveLength(5)
    expect(layout.nodes.every((n) => dataOf(n).variant === undefined)).toBe(true)
    expect(layout.nodes.every((n) => dataOf(n).badge === undefined)).toBe(true)
    expect(layout.nodes.every((n) => n.position.x === 0)).toBe(true)
    // 4 solid column edges, none dashed.
    expect(layout.edges).toHaveLength(4)
    expect(layout.edges.every((e) => !(e.style as { strokeDasharray?: string }).strokeDasharray)).toBe(true) // prettier-ignore
  })

  it('renders a plain column when branches carry no exclusive group', () => {
    const ungrouped: ForkableBranch[] = [{ _id: 'b1', name: 'Core', topicIds: ['dev', 'ts'] }]
    const layout = buildEditorLayout({ canvasTopics: canvas, branches: ungrouped })
    expect(layout.nodes).toHaveLength(5)
    expect(layout.nodes.some((n) => n.id.startsWith('fork-label:'))).toBe(false)
    expect(layout.nodes.some((n) => n.id.startsWith('ghost:'))).toBe(false)
  })
})

describe('buildEditorLayout — forked roadmap', () => {
  const layout = buildEditorLayout({ canvasTopics: canvas, branches })

  it('badges only the chosen fork HEAD (React), not the branch continuation (Next.js)', () => {
    expect(dataOf(node(layout, 'react')).badge).toBe('Selected')
    expect(dataOf(node(layout, 'nextjs')).badge).toBeUndefined() // continuation = plain node
    expect(dataOf(node(layout, 'tailwind')).badge).toBe('Selected')
    expect(dataOf(node(layout, 'dev')).badge).toBeUndefined()
  })

  it('adds one "Choose one" pill per fork group', () => {
    expect(dataOf(node(layout, 'fork-label:UI Framework')).variant).toBe('fork-label')
    expect(dataOf(node(layout, 'fork-label:UI Framework')).label).toContain('UI Framework')
    expect(node(layout, 'fork-label:Styling')).toBeDefined()
  })

  it('ghosts every UNCHOSEN branch inline, tagged clickable + branch id', () => {
    expect(
      ids(layout.nodes)
        .filter((id) => id.startsWith('ghost:'))
        .sort(),
    ).toEqual(['ghost:b-angular', 'ghost:b-bootstrap', 'ghost:b-vue'])
    const vue = node(layout, 'ghost:b-vue')
    expect(dataOf(vue).variant).toBe('ghost')
    expect(dataOf(vue).clickable).toBe(true)
    expect(dataOf(vue).branchId).toBe('b-vue')
    expect(dataOf(vue).branchName).toBe('Vue')
    expect(vue.selectable).toBe(false)
    expect(vue.position.x).toBeGreaterThan(0) // inline, to the right of the column
  })

  it('does NOT ghost the chosen branches (React / Tailwind)', () => {
    expect(node(layout, 'ghost:b-react')).toBeUndefined()
    expect(ids(layout.nodes)).not.toContain('ghost:b-tailwind')
  })

  it('draws solid column edges and dashed ghost edges from the fork predecessor', () => {
    // Fork cue: the UI Framework ghosts branch off TypeScript (the topic before React).
    const vueEdge = layout.edges.find((e) => e.target === 'ghost:b-vue')!
    expect(vueEdge.source).toBe('ts')
    expect((vueEdge.style as { strokeDasharray?: string }).strokeDasharray).toBe('6 4')
    // Column edge react -> nextjs is solid.
    const columnEdge = layout.edges.find((e) => e.source === 'react' && e.target === 'nextjs')!
    expect((columnEdge.style as { strokeDasharray?: string }).strokeDasharray).toBeUndefined()
  })
})

describe('buildEditorLayout — add-in-parallel', () => {
  it('drops a branch from the ghosts once one of its topics is on the canvas', () => {
    const withVue: EditorCanvasTopic[] = [
      ...canvas,
      { id: 'vue', label: 'Vue', status: 'upcoming' },
    ]
    const layout = buildEditorLayout({ canvasTopics: withVue, branches })
    expect(layout.nodes.some((n) => n.id === 'ghost:b-vue')).toBe(false)
    expect(layout.nodes.some((n) => n.id === 'ghost:b-angular')).toBe(true)
    // Vue is now a real (non-head) column node, not badged and not a ghost.
    expect(dataOf(node(layout, 'vue')).variant).toBeUndefined()
    expect(dataOf(node(layout, 'vue')).badge).toBeUndefined()
  })
})
