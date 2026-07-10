import React from 'react'
import {
  ReactFlow,
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
import { useIsMobile } from '@/hooks/use-is-mobile'

export interface RoadmapGraphProps {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
  onNodesChange?: OnNodesChange
  onEdgesChange?: OnEdgesChange
  onNodeClick?: (event: React.MouseEvent, node: Node) => void
  isReadOnly?: boolean
  /** Read-only graph the user can still pan/zoom (with Controls) — e.g. the
   * public demo page, where the tree is too tall to fit a locked viewport. */
  browsable?: boolean
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
  browsable = false,
  withUI = true,
}: RoadmapGraphProps) => {
  const isMobile = useIsMobile()
  const canPanZoom = !isReadOnly || browsable
  return (
    <div
      className={`relative flex-1 ${
        withUI
          ? 'border-border-soft bg-bg-section/50 overflow-hidden rounded-2xl border shadow-inner'
          : 'h-full w-full'
      }`}
    >
      {withUI && (
        <div className="border-border-soft text-text-secondary bg-bg-card/90 absolute top-4 left-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border p-3 text-xs font-semibold shadow-sm backdrop-blur-sm sm:top-6 sm:left-6 sm:max-w-[calc(100%-3rem)]">
          <div className="flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
              <RiCheckLine className="text-[10px]" />
            </div>
            Completed
          </div>
          <div className="flex items-center gap-1.5">
            <div className="border-brand-purple-600 bg-bg-card flex h-4 w-4 items-center justify-center rounded-full border-2">
              <div className="bg-brand-purple-600 h-1.5 w-1.5 rounded-full" />
            </div>
            Current
          </div>
          <div className="flex items-center gap-1.5">
            <div className="border-border-input bg-bg-card h-4 w-4 rounded-full border-2" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <RiLockLine className="text-text-placeholder text-base" />
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
        // On mobile, cap the initial fit-view zoom at 60% so the tree opens zoomed out.
        // With the legend overlay (withUI), reserve top space so it never covers the
        // first node of the tree.
        fitViewOptions={{
          padding: withUI
            ? { top: isMobile ? '96px' : '88px', left: '10%', right: '10%', bottom: '10%' }
            : 0.2,
          maxZoom: isMobile ? 0.6 : 1.5,
        }}
        minZoom={isMobile ? 0.3 : 0.5}
        maxZoom={1.5}
        nodesDraggable={!isReadOnly}
        nodesConnectable={!isReadOnly}
        elementsSelectable={!isReadOnly}
        panOnDrag={canPanZoom}
        zoomOnScroll={canPanZoom}
        // Double-click zoom is on by default in React Flow. In a read-only preview
        // (e.g. the landing hero) that let a stray double-click zoom the graph in with
        // no controls to reset it, stranding the view. Keep the preview locked/static.
        zoomOnDoubleClick={canPanZoom}
        // Always allow pinch-to-zoom on touch devices, even in read-only previews.
        zoomOnPinch={isMobile || canPanZoom}
        proOptions={{ hideAttribution: true }}
      >
        {withUI && canPanZoom && (
          <Controls
            showInteractive={!isReadOnly}
            className="[&>button]:border-border-soft! [&>button]:bg-bg-card! top-auto! bottom-6! left-6! flex! flex-col-reverse! gap-1! border-none! shadow-sm! [&>button]:h-8! [&>button]:w-8! [&>button]:rounded-lg! [&>button]:border!"
          />
        )}

        <Background gap={20} size={1.5} color="#e2e8f0" />
      </ReactFlow>
    </div>
  )
}
