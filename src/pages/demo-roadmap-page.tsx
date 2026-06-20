import { useMemo } from 'react'
import { type Node } from '@xyflow/react'
import { type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
import { useDemoRoadmap } from '@/features/roadmap/hooks/use-demo-roadmap'
import { buildFlowGraph } from '@/features/roadmap/lib/build-flow-graph'

import Roadmap from '@/features/roadmap/components/roadmap'

/**
 * Public, no-login demo roadmap page (mentor #1).
 * Fetches the curated demo from the backend and renders it as a React Flow tree.
 */
const DemoRoadmapPage = () => {
  const { data, isLoading, isError } = useDemoRoadmap()

  const graph = useMemo(
    () => (data ? buildFlowGraph(data as unknown as Parameters<typeof buildFlowGraph>[0]) : null),
    [data],
  )

  if (isLoading) {
    return (
      <div className="bg-base-100 flex h-screen w-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (isError || !data || !graph) {
    return (
      <div className="bg-base-100 text-error flex h-screen w-full items-center justify-center">
        Không tải được demo roadmap. Vui lòng thử lại.
      </div>
    )
  }

  return (
    <div className="bg-base-100 flex h-screen w-full flex-col">
      <header className="border-border-soft shrink-0 border-b px-8 py-4">
        <h1 className="text-text-primary text-xl font-bold">{data.roadmap.roleName}</h1>
        <p className="text-text-muted text-sm">{data.roadmap.description}</p>
      </header>
      <div className="min-h-0 flex-1">
        <Roadmap nodes={graph.nodes as Node<BaseNodeData>[]} edges={graph.edges} />
      </div>
    </div>
  )
}

export default DemoRoadmapPage
