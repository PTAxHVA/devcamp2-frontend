import type { Edge, Node } from '@xyflow/react'
import { type BaseNodeData } from './base-roadmap-node'
import { RoadmapGraph } from './roadmap-graph'

const initialNodes: Node<BaseNodeData>[] = [
  {
    id: '1',
    type: 'roadmapNode',
    position: { x: 300, y: 50 },
    data: { number: '1', label: 'Web Fundamentals', status: 'completed', variant: 'onboarding' },
  },
  {
    id: '2',
    type: 'roadmapNode',
    position: { x: 100, y: 180 },
    data: { number: '2', label: 'HTML & CSS', status: 'completed', variant: 'onboarding' },
  },
  {
    id: '3',
    type: 'roadmapNode',
    position: { x: 500, y: 180 },
    data: { number: '3', label: 'JavaScript Basics', status: 'current', variant: 'onboarding' },
  },
  {
    id: '4',
    type: 'roadmapNode',
    position: { x: 300, y: 310 },
    data: { number: '4', label: 'DOM & Events', status: 'upcoming', variant: 'onboarding' },
  },
  {
    id: '5',
    type: 'roadmapNode',
    position: { x: 50, y: 440 },
    data: { number: '5', label: 'Git & GitHub', status: 'upcoming', variant: 'onboarding' },
  },
  {
    id: '6',
    type: 'roadmapNode',
    position: { x: 300, y: 440 },
    data: { number: '6', label: 'React Basics', status: 'upcoming', variant: 'onboarding' },
  },
  {
    id: '7',
    type: 'roadmapNode',
    position: { x: 550, y: 440 },
    data: { number: '7', label: 'Components', status: 'upcoming', variant: 'onboarding' },
  },
]

const edgeStyle = { stroke: '#CBD5E1', strokeWidth: 2 }
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', style: edgeStyle },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', style: edgeStyle },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', style: edgeStyle },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: edgeStyle },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', style: edgeStyle },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', style: edgeStyle },
  { id: 'e4-7', source: '4', target: '7', type: 'smoothstep', style: edgeStyle },
]

interface RoadmapProps {
  nodes?: Node<BaseNodeData>[]
  edges?: Edge[]
}

const Roadmap = ({ nodes = initialNodes, edges = initialEdges }: RoadmapProps) => {
  return (
    <div className="h-full w-full bg-base-100">
      <RoadmapGraph nodes={nodes} edges={edges} isReadOnly={true} withUI={false} />
    </div>
  )
}

export default Roadmap
