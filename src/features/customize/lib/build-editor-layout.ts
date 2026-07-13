import type { Edge, Node } from '@xyflow/react'
import type { BaseNodeData, NodeStatus } from '@/features/roadmap/components/base-roadmap-node'
import { groupBranches, type ForkableBranch } from '@/features/roadmap/lib/branch-selection'

const COLUMN_X = 0
const ROW_GAP = 140 // vertical gap between column rows
const PILL_GAP = 74 // the "choose one" pill sits this far above its fork row
const BRANCH_COLUMN_WIDTH = 300 // horizontal gap between a fork group's parallel branches
const EDGE_COLOR = '#CBD5E1'
const EDGE_COLOR_DONE = '#10b981'
const SOLID_EDGE = { stroke: EDGE_COLOR, strokeWidth: 2 }
const DONE_EDGE = { stroke: EDGE_COLOR_DONE, strokeWidth: 2.5 }
const GHOST_EDGE = { stroke: EDGE_COLOR, strokeWidth: 2, strokeDasharray: '6 4' }

/** One master topic fed to the editor layout — the FULL graph, every branch. */
export interface EditorTopic {
  id: string
  label: string
  orderIndex: number
}

export interface EditorLayout {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
}

/** The current end(s) of the vertical spine the next topic branches off. */
interface SpineSource {
  id: string
  status: NodeStatus
  enrolled: boolean
}

// An edge is dashed when it leads INTO a not-enrolled (greyed) topic, emerald when
// its source topic is completed, plain otherwise.
const edgeStyleFor = (targetEnrolled: boolean, sourceStatus: NodeStatus) =>
  !targetEnrolled ? GHOST_EDGE : sourceStatus === 'completed' ? DONE_EDGE : SOLID_EDGE

/**
 * Full-master-graph layout for the Customize editor.
 *
 * The node set is the WHOLE roadmap (every parallel branch), FIXED. `membership`
 * (the enrolled topic ids) is only an OVERLAY: an enrolled topic renders in its
 * real status/colour, a not-enrolled topic renders greyed but in the SAME slot —
 * so adding/removing a topic never moves it, it just flips grey ↔ solid in place.
 *
 * Layout: core topics form a vertical spine; each mutually-exclusive group becomes
 * a horizontal band of parallel branch columns under a "Choose one · {group}" pill;
 * after the band the spine rejoins from the enrolled branch tails. Pure + derived
 * from the topics + branches, so a roadmap with no exclusive fork group (or before
 * branches load) renders as a plain vertical column.
 */
export function buildEditorLayout(params: {
  topics: readonly EditorTopic[]
  branches: ForkableBranch[] | undefined
  membership: ReadonlySet<string>
  statusOf: (id: string) => NodeStatus
}): EditorLayout {
  const { topics, branches, membership, statusOf } = params
  const nodes: Node<BaseNodeData>[] = []
  const edges: Edge[] = []

  const groups = branches ? groupBranches(branches).groups : []
  const groupBySelectionGroup = new Map(groups.map((g) => [g.selectionGroup, g]))
  // topicId -> the exclusive branch it belongs to (fork topics only).
  const branchByTopicId = new Map<string, ForkableBranch>()
  for (const group of groups) {
    for (const branch of group.branches) {
      for (const id of branch.topicIds ?? []) branchByTopicId.set(id, branch)
    }
  }

  const ordered = [...topics].sort((a, b) => a.orderIndex - b.orderIndex)
  const topicById = new Map(ordered.map((t) => [t.id, t]))
  // Stable 1-based step number per topic (orderIndex order) — cosmetic hint only.
  const numberById = new Map(ordered.map((t, i) => [t.id, String(i + 1)]))

  const nodeFor = (
    topic: EditorTopic,
    x: number,
    yPos: number,
    badge?: string,
  ): Node<BaseNodeData> => {
    const enrolled = membership.has(topic.id)
    return {
      id: topic.id,
      type: 'roadmapNode',
      position: { x, y: yPos },
      draggable: false,
      data: {
        number: numberById.get(topic.id),
        label: topic.label,
        status: enrolled ? statusOf(topic.id) : 'upcoming',
        greyed: !enrolled,
        badge,
      },
    }
  }

  let y = 0
  let spineSources: SpineSource[] = []
  const emitted = new Set<string>() // selectionGroups already given a band

  const connectFromSpine = (targetId: string) => {
    for (const s of spineSources) {
      edges.push({
        id: `e-${s.id}-${targetId}`,
        source: s.id,
        target: targetId,
        type: 'smoothstep',
        style: edgeStyleFor(membership.has(targetId), s.status),
      })
    }
  }

  for (const topic of ordered) {
    const branch = branchByTopicId.get(topic.id)
    const group = branch?.selectionGroup
      ? groupBySelectionGroup.get(branch.selectionGroup)
      : undefined

    if (!group) {
      // Core spine topic.
      connectFromSpine(topic.id)
      nodes.push(nodeFor(topic, COLUMN_X, y))
      const enrolled = membership.has(topic.id)
      spineSources = [
        { id: topic.id, status: enrolled ? statusOf(topic.id) : 'upcoming', enrolled },
      ]
      y += ROW_GAP
      continue
    }

    if (emitted.has(group.selectionGroup)) continue // band already laid at first occurrence
    emitted.add(group.selectionGroup)

    // Fork band: a "choose one" pill, then each branch as a parallel column.
    nodes.push({
      id: `fork-label:${group.selectionGroup}`,
      type: 'roadmapNode',
      position: { x: COLUMN_X, y },
      selectable: false,
      draggable: false,
      data: {
        label: `Choose one · ${group.selectionGroup}`,
        status: 'upcoming',
        variant: 'fork-label',
      },
    })
    const bandTop = y + PILL_GAP
    let maxLen = 0
    const branchTails: SpineSource[] = []

    group.branches.forEach((br, bi) => {
      const x = COLUMN_X + bi * BRANCH_COLUMN_WIDTH
      const brTopics = (br.topicIds ?? [])
        .map((id) => topicById.get(id))
        .filter((t): t is EditorTopic => !!t)
      let by = bandTop
      let prev: SpineSource | undefined
      brTopics.forEach((t, ti) => {
        const enrolled = membership.has(t.id)
        const status: NodeStatus = enrolled ? statusOf(t.id) : 'upcoming'
        // Badge the enrolled branch HEAD so the chosen path reads at a glance.
        nodes.push(nodeFor(t, x, by, ti === 0 && enrolled ? 'Selected' : undefined))
        if (ti === 0) {
          connectFromSpine(t.id) // fork edge(s) from the pre-fork predecessor
        } else if (prev) {
          edges.push({
            id: `e-${prev.id}-${t.id}`,
            source: prev.id,
            target: t.id,
            type: 'smoothstep',
            style: edgeStyleFor(membership.has(t.id), prev.status),
          })
        }
        prev = { id: t.id, status, enrolled }
        by += ROW_GAP
      })
      maxLen = Math.max(maxLen, brTopics.length)
      if (prev) branchTails.push(prev)
    })

    // Spine rejoins from the enrolled branch tails (fallback: all tails).
    const enrolledTails = branchTails.filter((s) => s.enrolled)
    spineSources = enrolledTails.length > 0 ? enrolledTails : branchTails
    y = bandTop + Math.max(maxLen, 1) * ROW_GAP
  }

  return { nodes, edges }
}
