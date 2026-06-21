import type { Edge, Node } from '@xyflow/react'
import type { BERoadmapDetail, BEGraphTopic } from '../hooks/use-roadmap-detail'
import type { BaseNodeData, NodeStatus } from '../components/base-roadmap-node'

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
  const idSet = new Set(topics.map((t) => t.masterTopicId))
  const completed = new Set(topics.filter(isTopicCompleted).map((t) => t.masterTopicId))

  const result = new Map<string, BackendStatus>()
  for (const t of topics) {
    let status: BackendStatus
    if (isTopicCompleted(t)) {
      status = 'completed'
    } else if (t.sectionCompleted > 0) {
      status = 'in_progress'
    } else {
      const prereqs = t.prerequisiteTopicIds.filter((id) => idSet.has(id))
      status = prereqs.every((id) => completed.has(id)) ? 'available' : 'locked'
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
 */
export function buildFlowGraph(data: BERoadmapDetail): FlowGraph {
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
    data.edges.length > 0
      ? data.edges.map((edge) => ({
          id: `e-${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: 'smoothstep',
          style: { stroke: EDGE_COLOR, strokeWidth: 2 },
        }))
      : // Backend sent no prerequisite edges (e.g. the demo roadmap, whose seed has
        // empty dependsOn). Chain topics sequentially by orderIndex so the graph reads
        // as a connected path instead of disconnected nodes.
        ordered.slice(1).map((topic, index) => ({
          id: `e-seq-${ordered[index].masterTopicId}-${topic.masterTopicId}`,
          source: ordered[index].masterTopicId,
          target: topic.masterTopicId,
          type: 'smoothstep',
          style: { stroke: EDGE_COLOR, strokeWidth: 2 },
        }))

  return { nodes, edges }
}
