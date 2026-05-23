import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import RoadmapNode from './roadmap-node'

const nodeTypes = {
  roadmapNode: RoadmapNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'roadmapNode',
    position: { x: 300, y: 50 },
    data: { number: '1', label: 'Web Fundamentals', status: 'done' },
  },
  {
    id: '2',
    type: 'roadmapNode',
    position: { x: 100, y: 180 },
    data: { number: '2', label: 'HTML & CSS', status: 'done' },
  },
  {
    id: '3',
    type: 'roadmapNode',
    position: { x: 500, y: 180 },
    data: { number: '3', label: 'JavaScript Basics', status: 'current' },
  },
  {
    id: '4',
    type: 'roadmapNode',
    position: { x: 300, y: 310 },
    data: { number: '4', label: 'DOM & Events', status: 'upcoming' },
  },
  {
    id: '5',
    type: 'roadmapNode',
    position: { x: 50, y: 440 },
    data: { number: '5', label: 'Git & GitHub', status: 'upcoming' },
  },
  {
    id: '6',
    type: 'roadmapNode',
    position: { x: 300, y: 440 },
    data: { number: '6', label: 'React Basics', status: 'upcoming' },
  },
  {
    id: '7',
    type: 'roadmapNode',
    position: { x: 550, y: 440 },
    data: { number: '7', label: 'Components', status: 'upcoming' },
  },
]

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
  {
    id: 'e4-7',
    source: '4',
    target: '7',
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
  },
]

const Roadmap = () => {
  return (
    <div className="w-full h-full bg-base-100">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E8F0" gap={16} />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export default Roadmap
