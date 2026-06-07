import { useMemo } from 'react'
import { useDemoRoadmap } from '@/features/roadmap/hooks/use-demo-roadmap'
import { buildFlowGraph } from '@/features/roadmap/lib/build-flow-graph'
import Roadmap from '@/features/roadmap/components/roadmap'

/**
 * Public, no-login demo roadmap page (mentor #1).
 * Fetches the curated demo from the backend and renders it as a React Flow tree.
 */
const DemoRoadmapPage = () => {
  const { data, isLoading, isError } = useDemoRoadmap()

  const graph = useMemo(() => (data ? buildFlowGraph(data) : null), [data])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (isError || !data || !graph) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-100 text-error">
        Không tải được demo roadmap. Vui lòng thử lại.
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-base-100">
      <header className="shrink-0 border-b border-slate-200 px-8 py-4">
        <h1 className="text-xl font-bold text-slate-900">{data.roadmap.roleName}</h1>
        <p className="text-sm text-slate-500">{data.roadmap.description}</p>
      </header>
      <div className="min-h-0 flex-1">
        <Roadmap nodes={graph.nodes} edges={graph.edges} />
      </div>
    </div>
  )
}

export default DemoRoadmapPage
