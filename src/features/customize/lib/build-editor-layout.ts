import type { Edge, Node } from '@xyflow/react'
import type { BaseNodeData, NodeStatus } from '@/features/roadmap/components/base-roadmap-node'
import { groupBranches, type ForkableBranch } from '@/features/roadmap/lib/branch-selection'

const COLUMN_X = 0
const ROW_GAP = 140 // vertical gap between column rows
const PILL_GAP = 74 // the "choose one" pill sits this far above its fork row
const GHOST_COLUMN_WIDTH = 300 // horizontal gap between a fork's inline siblings
const EDGE_COLOR = '#CBD5E1'
const EDGE_COLOR_DONE = '#10b981'
const SOLID_EDGE = { stroke: EDGE_COLOR, strokeWidth: 2 }
const DONE_EDGE = { stroke: EDGE_COLOR_DONE, strokeWidth: 2.5 }
const GHOST_EDGE = { stroke: EDGE_COLOR, strokeWidth: 2, strokeDasharray: '6 4' }

/** One real topic on the editor canvas, in column order. */
export interface EditorCanvasTopic {
  id: string
  label: string
  status: NodeStatus
}

export interface EditorLayout {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
}

const columnEdge = (
  source: string,
  target: string,
  sourceStatus: NodeStatus | undefined,
): Edge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  style: sourceStatus === 'completed' ? DONE_EDGE : SOLID_EDGE,
})

/**
 * Fork-aware layout for the Customize editor. Lays the enrolled topics as a
 * vertical column; at each mutually-exclusive fork group, the branch the learner
 * is on stays IN the column (with a "Selected" badge) while the branches they did
 * NOT choose sit inline to its right as dashed "+ Add" ghosts, under a
 * "Choose one · {group}" pill. Clicking a ghost adds that whole branch in
 * parallel (the caller reads the node's branchId/branchName).
 *
 * Pure + derived from the canvas topics + the roadmap's branches:
 * - Only the FIRST canvas topic of a group is the "fork head" (badge + pill +
 *   ghosts); later topics of the chosen branch (e.g. Next.js after React) are
 *   plain column nodes.
 * - A branch is ghosted only while NONE of its topics are on the canvas, so a
 *   ghost disappears the moment its branch is added in parallel.
 * - A roadmap with no exclusive fork group (or before branches load) produces a
 *   plain vertical column identical to the pre-fork editor.
 */
export function buildEditorLayout(params: {
  canvasTopics: readonly EditorCanvasTopic[]
  branches: ForkableBranch[] | undefined
}): EditorLayout {
  const { canvasTopics, branches } = params
  const nodes: Node<BaseNodeData>[] = []
  const edges: Edge[] = []

  const groups = branches ? groupBranches(branches).groups : []
  const groupBySelectionGroup = new Map(groups.map((g) => [g.selectionGroup, g]))
  // topicId -> the exclusive branch it belongs to.
  const branchByTopicId = new Map<string, ForkableBranch>()
  for (const group of groups) {
    for (const branch of group.branches) {
      for (const topicId of branch.topicIds ?? []) branchByTopicId.set(topicId, branch)
    }
  }
  const canvasIds = new Set(canvasTopics.map((t) => t.id))
  const forkHeadDone = new Set<string>() // selectionGroups already given a fork row

  let y = 0
  let prevColumnNodeId: string | undefined
  let prevColumnStatus: NodeStatus | undefined

  const pushColumnTopic = (topic: EditorCanvasTopic, index: number, badge?: string) => {
    if (prevColumnNodeId) edges.push(columnEdge(prevColumnNodeId, topic.id, prevColumnStatus))
    nodes.push({
      id: topic.id,
      type: 'roadmapNode',
      position: { x: COLUMN_X, y },
      draggable: false,
      data: { number: String(index + 1), label: topic.label, status: topic.status, badge },
    })
    prevColumnNodeId = topic.id
    prevColumnStatus = topic.status
    y += ROW_GAP
  }

  canvasTopics.forEach((topic, index) => {
    const branch = branchByTopicId.get(topic.id)
    const group = branch?.selectionGroup
      ? groupBySelectionGroup.get(branch.selectionGroup)
      : undefined

    if (!group || forkHeadDone.has(group.selectionGroup)) {
      // Plain column node: a core topic, or a non-head topic of the chosen branch.
      pushColumnTopic(topic, index)
      return
    }

    // Fork head: a "choose one" pill, the chosen topic (badged), and the unchosen
    // branches inline to its right as add-in-parallel ghosts.
    forkHeadDone.add(group.selectionGroup)
    const forkSource = prevColumnNodeId // the topic the fork branches off (may be undefined)

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
    y += PILL_GAP

    pushColumnTopic(topic, index, 'Selected')

    const ghostBranches = group.branches.filter(
      (b) => !(b.topicIds ?? []).some((id) => canvasIds.has(id)),
    )
    ghostBranches.forEach((ghostBranch, gi) => {
      const ghostId = `ghost:${ghostBranch._id}`
      nodes.push({
        id: ghostId,
        type: 'roadmapNode',
        position: { x: COLUMN_X + (gi + 1) * GHOST_COLUMN_WIDTH, y: y - ROW_GAP },
        selectable: false,
        draggable: false,
        data: {
          label: ghostBranch.name,
          status: 'upcoming',
          variant: 'ghost',
          clickable: true,
          branchId: ghostBranch._id,
          branchName: ghostBranch.name,
          hint: `Add ${ghostBranch.name} — learn in parallel`,
        },
      })
      edges.push({
        id: `e-ghost-${ghostId}`,
        source: forkSource ?? topic.id,
        target: ghostId,
        type: 'smoothstep',
        style: GHOST_EDGE,
      })
    })
  })

  return { nodes, edges }
}
