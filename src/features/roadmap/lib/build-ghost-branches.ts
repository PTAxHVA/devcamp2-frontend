import type { Edge, Node } from '@xyflow/react'
import type { BaseNodeData } from '../components/base-roadmap-node'
import type { BEGraphTopic, BEGraphEdge } from '../hooks/use-roadmap-detail'
import type { ForkableBranch } from './branch-selection'
import { groupBranches } from './branch-selection'

const VERTICAL_GAP = 140
const COLUMN_X = 0
const GHOST_COLUMN_WIDTH = 320
const GHOST_EDGE_STYLE = { stroke: '#CBD5E1', strokeWidth: 2, strokeDasharray: '6 4' }

export interface GhostOverlay {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
}

interface MasterGraph {
  topics: BEGraphTopic[]
  edges: BEGraphEdge[]
}

/**
 * Build the "ghost" overlay for the Customize editor: for every mutually-exclusive
 * branch the learner did NOT enroll (e.g. Vue/Angular while on React, Bootstrap while
 * on Tailwind), draw its topics as inert dashed nodes in a column beside the chosen
 * path — so the learner SEES the parallel options and can click one to add it in
 * parallel. Returns an empty overlay for a non-forked roadmap (nothing to ghost) or
 * before the master graph loads, so the editor renders exactly as before.
 *
 * Pure + derived: takes the all-branches master graph, the topic ids currently on the
 * canvas (enrolled + already-added), and the roadmap's branches. Because it keys off
 * `canvasTopicIds`, a ghost branch disappears the instant its topics land on the canvas.
 *
 * Ghost node ids are prefixed `ghost:` so the editor can tell a ghost click (add the
 * branch in parallel) from a real topic click (select it). Each ghost node carries its
 * `branchId`/`branchName` so the click handler knows which branch to add.
 */
export function buildGhostBranches(params: {
  masterGraph: MasterGraph | undefined
  canvasTopicIds: readonly string[]
  branches: ForkableBranch[] | undefined
}): GhostOverlay {
  const { masterGraph, canvasTopicIds, branches } = params
  if (!masterGraph || !branches?.length) return { nodes: [], edges: [] }

  const onCanvas = new Set(canvasTopicIds)
  const topicById = new Map(masterGraph.topics.map((t) => [t.masterTopicId, t]))

  const nodes: Node<BaseNodeData>[] = []
  const edges: Edge[] = []
  let ghostColumn = 0

  for (const group of groupBranches(branches).groups) {
    // Ghost every branch of the exclusive group whose topics are NOT on the canvas —
    // i.e. the alternatives the learner did not choose.
    for (const branch of group.branches) {
      const branchTopics = (branch.topicIds ?? [])
        .map((id) => topicById.get(id))
        .filter((t): t is BEGraphTopic => !!t && !onCanvas.has(t.masterTopicId))
        .sort((a, b) => a.orderIndex - b.orderIndex)
      if (branchTopics.length === 0) continue

      ghostColumn += 1
      const x = COLUMN_X + ghostColumn * GHOST_COLUMN_WIDTH
      const branchTopicIds = new Set(branchTopics.map((t) => t.masterTopicId))

      branchTopics.forEach((topic, i) => {
        nodes.push({
          id: `ghost:${topic.masterTopicId}`,
          type: 'roadmapNode',
          position: { x, y: i * VERTICAL_GAP },
          selectable: false,
          draggable: false,
          data: {
            label: topic.name,
            status: 'upcoming',
            variant: 'ghost',
            clickable: true,
            branchId: branch._id,
            branchName: branch.name,
            hint: `Add ${branch.name} — learn in parallel`,
          },
        })
      })

      // Intra-branch dashed edges so the ghost column reads as a connected sub-path.
      for (const edge of masterGraph.edges) {
        if (branchTopicIds.has(edge.source) && branchTopicIds.has(edge.target)) {
          edges.push({
            id: `e-ghost-${edge.source}-${edge.target}`,
            source: `ghost:${edge.source}`,
            target: `ghost:${edge.target}`,
            type: 'smoothstep',
            style: GHOST_EDGE_STYLE,
          })
        }
      }

      // Fork cue: a dashed edge from the enrolled predecessor (the fork point already
      // on the canvas) to this ghost branch's head, so it reads as branching off.
      const head = branchTopics[0]
      const predecessor = masterGraph.edges.find(
        (e) => e.target === head.masterTopicId && onCanvas.has(e.source),
      )
      if (predecessor) {
        edges.push({
          id: `e-ghost-fork-${predecessor.source}-${head.masterTopicId}`,
          source: predecessor.source,
          target: `ghost:${head.masterTopicId}`,
          type: 'smoothstep',
          style: GHOST_EDGE_STYLE,
        })
      }
    }
  }

  return { nodes, edges }
}
