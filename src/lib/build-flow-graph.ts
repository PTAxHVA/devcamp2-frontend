import { type Node, type Edge } from '@xyflow/react'
import { type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
interface DomainTopic {
  id: string | number
  title: string
}
export const buildFlowGraph = (domainData: DomainTopic[]) => {
  const nodes: Node<BaseNodeData>[] = domainData.map((item, index) => ({
    id: item.id.toString(),
    type: 'roadmapNode',
    position: { x: 300, y: index * 130 + 50 },
    data: {
      label: item.title,
      number: (index + 1).toString(),
      status: 'upcoming',
      variant: 'onboarding',
    },
  }))

  const edges: Edge[] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    })
  }

  return { nodes, edges }
}
