import type { Edge, Node } from '@xyflow/react'
import type { BERoadmapDetail, BEGraphTopic } from '../hooks/use-roadmap-detail'
import type { BaseNodeData, NodeStatus } from '../components/base-roadmap-node'
import type { ForkContext } from './branch-selection'

type BackendStatus = 'completed' | 'in_progress' | 'available' | 'locked'

/** Backend 4-state status -> RoadmapNode 4-state visual status. */
const STATUS_MAP: Record<BackendStatus, NodeStatus> = {
  completed: 'completed',
  in_progress: 'current',
  available: 'upcoming',
  locked: 'locked',
}

const isTopicCompleted = (t: BEGraphTopic) =>
  t.sectionTotal > 0 && t.sectionCompleted >= t.sectionTotal

/**
 * Derive each topic's 4-state status from SECTION progress + prerequisites,
 * independent of the backend `status` field — progress lives in section
 * completion (a section is completed when its quiz is passed). Mirrors the
 * backend graph builder so the FE owns its own status logic.
 * - completed   : has sections and every section is completed
 * - in_progress : at least one section completed, but not all
 * - available   : no section progress and every in-roadmap prerequisite is completed
 * - locked      : no section progress and at least one in-roadmap prerequisite is not completed
 */
export function deriveTopicStatuses(topics: BEGraphTopic[]): Map<string, BackendStatus> {
  const ordered = [...topics].sort((a, b) => a.orderIndex - b.orderIndex)
  const idSet = new Set(topics.map((t) => t.masterTopicId))
  const completed = new Set(topics.filter(isTopicCompleted).map((t) => t.masterTopicId))

  const result = new Map<string, BackendStatus>()
  for (let i = 0; i < ordered.length; i++) {
    const t = ordered[i]
    let status: BackendStatus
    if (isTopicCompleted(t)) {
      status = 'completed'
    } else if (t.sectionCompleted > 0) {
      status = 'in_progress'
    } else if (i === 0) {
      // Root topic is always available — nothing in the roadmap can block it.
      status = 'available'
    } else {
      const inRoadmapPrereqs = t.prerequisiteTopicIds.filter((id) => idSet.has(id))
      if (inRoadmapPrereqs.length > 0) {
        // Explicit prerequisite graph: available when all prereqs are done.
        status = inRoadmapPrereqs.every((id) => completed.has(id)) ? 'available' : 'locked'
      } else {
        // No prerequisites seeded: sequential unlock — only available after the
        // immediately preceding topic (by orderIndex) is completed.
        status = completed.has(ordered[i - 1].masterTopicId) ? 'available' : 'locked'
      }
    }
    result.set(t.masterTopicId, status)
  }
  return result
}

const VERTICAL_GAP = 140
const COLUMN_X = 0
const EDGE_COLOR = '#CBD5E1'

export interface FlowGraph {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
}

/**
 * Pure transform: backend roadmap graph -> React Flow nodes + edges.
 * Layout is a single vertical column ordered by `orderIndex` (the backend
 * does not send coordinates). Edges follow the prerequisite graph as-is.
 *
 * `synthesizeSequentialEdges` is an explicit opt-in for the demo roadmap (whose
 * seed has empty `dependsOn`): it chains topics by `orderIndex` so the graph reads
 * as a connected path. It is OFF by default so a genuinely flat authed roadmap is
 * never drawn with fabricated prerequisite arrows.
 *
 * `forkContext` (view page only) draws the roadmap's fork: one dashed, inert
 * "ghost" node for the NOT-chosen branch of the exclusive group, hanging off the
 * fork predecessor beside the chosen topic. Consumers that don't pass it (editor,
 * demo) render exactly as before.
 */
export function buildFlowGraph(
  data: BERoadmapDetail,
  opts: { synthesizeSequentialEdges?: boolean; forkContext?: ForkContext | null } = {},
): FlowGraph {
  const ordered = [...data.topics].sort((a, b) => a.orderIndex - b.orderIndex)
  const statusById = deriveTopicStatuses(data.topics)

  const nodes: Node<BaseNodeData>[] = ordered.map((topic, index) => ({
    id: topic.masterTopicId,
    type: 'roadmapNode',
    position: { x: COLUMN_X, y: index * VERTICAL_GAP },
    data: {
      number: String(index + 1),
      label: topic.name,
      status: STATUS_MAP[statusById.get(topic.masterTopicId) ?? topic.status],
    },
  }))

  const edges: Edge[] =
    data.edges.length > 0 || !opts.synthesizeSequentialEdges
      ? data.edges.map((edge) => ({
          id: `e-${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: 'smoothstep',
          style: { stroke: EDGE_COLOR, strokeWidth: 2 },
        }))
      : // Demo opt-in only: backend sent no prerequisite edges (demo seed has empty
        // dependsOn). Chain topics sequentially by orderIndex so the graph reads as a
        // connected path instead of disconnected nodes.
        ordered.slice(1).map((topic, index) => ({
          id: `e-seq-${index}-${ordered[index].masterTopicId}-${topic.masterTopicId}`,
          source: ordered[index].masterTopicId,
          target: topic.masterTopicId,
          type: 'smoothstep',
          style: { stroke: EDGE_COLOR, strokeWidth: 2 },
        }))

  // Fork indicator: a dashed ghost node for the not-chosen branch, next to the
  // chosen fork topic, fed by a dashed edge from the fork predecessor. Only when
  // exactly one side of the fork is enrolled AND the fork has a predecessor to
  // hang the ghost edge off (first-topic forks just get the page banner).
  const fork = opts.forkContext
  if (
    fork &&
    fork.state === 'single' &&
    fork.alternative &&
    fork.forkTopicId &&
    fork.predecessorTopicId
  ) {
    const forkIndex = ordered.findIndex((t) => t.masterTopicId === fork.forkTopicId)
    if (forkIndex >= 0) {
      const ghostId = `ghost:${fork.alternative._id}`
      nodes.push({
        id: ghostId,
        type: 'roadmapNode',
        position: { x: COLUMN_X + 320, y: forkIndex * VERTICAL_GAP },
        selectable: false,
        draggable: false,
        data: {
          label: fork.alternative.name,
          status: 'upcoming',
          variant: 'ghost',
          hint: `${fork.selectionGroup}: switch paths in Customize`,
        },
      })
      edges.push({
        id: `e-ghost-${fork.predecessorTopicId}-${ghostId}`,
        source: fork.predecessorTopicId,
        target: ghostId,
        type: 'smoothstep',
        style: { stroke: EDGE_COLOR, strokeWidth: 2, strokeDasharray: '6 4' },
      })
    }
  }

  return { nodes, edges }
}
