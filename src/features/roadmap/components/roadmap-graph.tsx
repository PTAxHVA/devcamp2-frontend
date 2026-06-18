import React from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { RiCheckLine, RiLockLine } from 'react-icons/ri'
import { BaseRoadmapNode, type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'

export interface RoadmapGraphProps {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
  onNodesChange?: OnNodesChange
  onEdgesChange?: OnEdgesChange
  onNodeClick?: (event: React.MouseEvent, node: Node) => void
  isReadOnly?: boolean
  withUI?: boolean
}

const nodeTypes = { roadmapNode: BaseRoadmapNode }

export const RoadmapGraph = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  isReadOnly = false,
  withUI = true,
}: RoadmapGraphProps) => {
  return (
    <div
      className={`relative flex-1 ${
        withUI
          ? 'overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner'
          : 'h-full w-full'
      }`}
    >
      {withUI && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-5 rounded-xl border border-slate-100 bg-white/90 p-3 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
              <RiCheckLine className="text-[10px]" />
            </div>
            Completed
          </div>
          <div className="flex items-center gap-1.5">
            <div className="border-brand-purple-600 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white">
              <div className="bg-brand-purple-600 h-1.5 w-1.5 rounded-full" />
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
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={!isReadOnly ? onNodesChange : undefined}
        onEdgesChange={!isReadOnly ? onEdgesChange : undefined}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={!isReadOnly}
        nodesConnectable={!isReadOnly}
        elementsSelectable={!isReadOnly}
        panOnDrag={!isReadOnly}
        zoomOnScroll={!isReadOnly}
        zoomOnPinch={!isReadOnly}
        proOptions={{ hideAttribution: true }}
      >
        {withUI && !isReadOnly && (
          <Controls className="top-auto! bottom-6! left-6! flex! flex-col-reverse! gap-1! border-none! shadow-sm! [&>button]:h-8! [&>button]:w-8! [&>button]:rounded-lg! [&>button]:border! [&>button]:border-slate-200! [&>button]:bg-white!" />
        )}

        {withUI && (
          <MiniMap
            className="border-brand-purple-100! right-6! bottom-6! h-28! w-40! rounded-xl! border-2! bg-white! shadow-sm!"
            nodeColor={(node) => {
              const data = node.data as BaseNodeData
              if (data?.status === 'completed') return '#10b981'
              if (data?.status === 'current') return '#7c3aed'
              return '#cbd5e1'
            }}
            maskColor="rgba(124, 58, 237, 0.04)"
          />
        )}

        <Background gap={16} size={1} color="#cbd5e1" />
      </ReactFlow>
    </div>
  )
}
