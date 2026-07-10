import { useMemo } from 'react'
import { Link } from 'react-router'
import { RiArrowLeftLine, RiArrowRightLine, RiBookOpenLine, RiTimeLine } from 'react-icons/ri'
import { type Node } from '@xyflow/react'
import { type BaseNodeData, type NodeStatus } from '@/features/roadmap/components/base-roadmap-node'
import { useDemoRoadmap } from '@/features/roadmap/hooks/use-demo-roadmap'
import { buildFlowGraph } from '@/features/roadmap/lib/build-flow-graph'
import { RoadmapGraph } from '@/features/roadmap/components/roadmap-graph'

/**
 * Public, no-login demo roadmap page (mentor #1).
 * Fetches the curated demo from the backend and renders it as a React Flow tree.
 */
const DemoRoadmapPage = () => {
  const { data, isLoading, isError } = useDemoRoadmap()

  const graph = useMemo(() => {
    if (!data) return null
    const { nodes, edges } = buildFlowGraph(
      data as unknown as Parameters<typeof buildFlowGraph>[0],
      {
        synthesizeSequentialEdges: true,
      },
    )
    // The public demo has no learner progress, so the normal status derivation
    // renders everything past the root as locked — a wall of dashed, disabled
    // nodes. Show the path as it looks on day one instead: first topic current,
    // the rest upcoming.
    return {
      edges,
      nodes: nodes.map((node, index) => ({
        ...node,
        data: {
          ...node.data,
          status: (index === 0 ? 'current' : 'upcoming') as NodeStatus,
        },
      })),
    }
  }, [data])

  const totalHours = useMemo(
    () => data?.topics.reduce((sum, topic) => sum + (topic.estimatedHours || 0), 0) ?? 0,
    [data],
  )

  if (isLoading) {
    return (
      <div className="bg-bg-soft flex h-dvh w-full flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading demo roadmap…</p>
      </div>
    )
  }

  if (isError || !data || !graph) {
    return (
      <div className="bg-bg-soft flex h-dvh w-full items-center justify-center p-6">
        <div className="border-border-soft bg-bg-card flex w-full max-w-md flex-col items-center gap-2 rounded-2xl border p-8 text-center shadow-sm">
          <h1 className="text-text-primary text-lg font-bold">Unable to load the demo roadmap</h1>
          <p className="text-text-muted text-sm">Please check your connection and try again.</p>
          <Link
            to="/"
            className="btn btn-outline btn-sm border-border-input hover:bg-bg-section focus-visible:ring-brand-purple-300 mt-4 rounded-full px-5 transition-colors duration-200 focus-visible:ring-2"
          >
            <RiArrowLeftLine className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-soft flex h-dvh w-full flex-col">
      <header className="border-border-soft bg-bg-card shrink-0 border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-350 flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <Link
              to="/"
              className="text-text-secondary hover:text-text-primary focus-visible:ring-brand-purple-300 mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <RiArrowLeftLine className="h-4 w-4" /> Back to home
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h1 className="text-text-primary text-xl font-extrabold tracking-tight sm:text-2xl">
                {data.roadmap.roleName}
              </h1>
              <span className="badge badge-primary badge-outline badge-sm px-2 py-1 font-semibold">
                Demo preview
              </span>
            </div>
            {data.roadmap.description && (
              <p className="text-text-muted mt-1 max-w-2xl text-sm">{data.roadmap.description}</p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 md:justify-end">
            <div className="text-text-secondary flex items-center gap-4 text-sm font-semibold">
              <span className="flex items-center gap-1.5">
                <RiBookOpenLine className="text-brand-purple-500 h-4.5 w-4.5" />
                {data.topics.length} topics
              </span>
              {totalHours > 0 && (
                <span className="flex items-center gap-1.5">
                  <RiTimeLine className="text-brand-purple-500 h-4.5 w-4.5" />~
                  {Math.round(totalHours)}h total
                </span>
              )}
            </div>
            <Link to="/signup" className="btn btn-primary px-6">
              Build my roadmap <RiArrowRightLine className="ml-1" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-350 flex-1 flex-col p-4 sm:p-6">
        <RoadmapGraph
          nodes={graph.nodes as Node<BaseNodeData>[]}
          edges={graph.edges}
          isReadOnly={true}
          browsable={true}
          withUI={true}
        />
      </main>
    </div>
  )
}

export default DemoRoadmapPage
