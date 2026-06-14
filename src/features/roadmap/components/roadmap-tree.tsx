import React, { useMemo, useEffect } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { RiCheckLine, RiLockLine } from 'react-icons/ri'

import TopicNode, { type TopicNodeData } from './topic-node'

export interface RoadmapTreeProps {
  nodes: Node<TopicNodeData>[]
  edges: Edge[]
  onNodeClick?: (event: React.MouseEvent, node: Node) => void
}

const RoadmapTree = ({ nodes: apiNodes, edges: apiEdges, onNodeClick }: RoadmapTreeProps) => {
  const nodeTypes = useMemo(() => ({ roadmapNode: TopicNode }), [])

  const [nodes, setNodes, onNodesChange] = useNodesState(apiNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(apiEdges)
  useEffect(() => {
    setNodes(apiNodes)
    setEdges(apiEdges)
  }, [apiNodes, apiEdges, setNodes, setEdges])

  return (
    <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner">
      <div className="absolute left-6 top-6 z-10 flex items-center gap-5 rounded-xl border border-slate-100 bg-white/90 p-3 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
            <RiCheckLine className="text-[10px]" />
          </div>
          Completed
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-purple-600 bg-white">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
          </div>
          Current
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <RiLockLine className="text-base text-slate-400" />
          Locked
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={true}
      >
        <Controls className="!bottom-6 !left-6 !top-auto !flex !flex-col-reverse !gap-1 !border-none !shadow-sm [&>button]:!h-8 [&>button]:!w-8 [&>button]:!rounded-lg [&>button]:!border [&>button]:!border-slate-200 [&>button]:!bg-white" />

        <MiniMap
          className="!bottom-6 !right-6 !h-28 !w-40 !rounded-xl !border-2 !border-purple-100 !bg-white !shadow-sm"
          nodeColor={(node) => {
            const data = node.data as TopicNodeData
            if (data?.status === 'completed') return '#10b981'
            if (data?.status === 'in_progress') return '#7c3aed'
            return '#cbd5e1'
          }}
          maskColor="rgba(124, 58, 237, 0.04)"
        />

        <Background gap={16} size={1} color="#cbd5e1" />
      </ReactFlow>
    </div>
  )
}

export default RoadmapTree
