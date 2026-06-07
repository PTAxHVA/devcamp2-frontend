import type { Edge, Node } from '@xyflow/react'
import type { DemoRoadmap, RoadmapTopicStatus } from '../types'

/** Visual states supported by RoadmapNode. */
type NodeStatus = 'done' | 'current' | 'upcoming'

/** Backend 4-state status -> RoadmapNode 3-state visual status. */
const STATUS_MAP: Record<RoadmapTopicStatus, NodeStatus> = {
  completed: 'done',
  in_progress: 'current',
  available: 'current',
  locked: 'upcoming',
}

const VERTICAL_GAP = 140
const COLUMN_X = 0
const EDGE_COLOR = '#CBD5E1'

export interface FlowGraph {
  nodes: Node[]
  edges: Edge[]
}

/**
 * Pure transform: backend roadmap graph -> React Flow nodes + edges.
 * Layout is a single vertical column ordered by `orderIndex` (the backend
 * does not send coordinates). Edges follow the prerequisite graph as-is.
 */
export function buildFlowGraph(data: DemoRoadmap): FlowGraph {
  const ordered = [...data.topics].sort((a, b) => a.orderIndex - b.orderIndex)

  const nodes: Node[] = ordered.map((topic, index) => ({
    id: topic.masterTopicId,
    type: 'roadmapNode',
    position: { x: COLUMN_X, y: index * VERTICAL_GAP },
    data: {
      number: String(index + 1),
      label: topic.name,
      status: STATUS_MAP[topic.status],
    },
  }))

  const edges: Edge[] = data.edges.map((edge) => ({
    id: `e-${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    style: { stroke: EDGE_COLOR, strokeWidth: 2 },
  }))

  return { nodes, edges }
}
