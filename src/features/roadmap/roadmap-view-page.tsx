import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { Node } from '@xyflow/react'
import toast from 'react-hot-toast'

import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiTimeLine,
  RiListUnordered,
  RiBarChartBoxLine,
  RiStarLine,
  RiCheckLine,
  RiCheckboxCircleFill,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiBookmark2Line,
  RiEditLine,
} from 'react-icons/ri'

import { RoadmapGraph } from './components/roadmap-graph'
import { buildFlowGraph } from './lib/build-flow-graph'
import { useRoadmapDetail } from './hooks/use-roadmap-detail'

const RoadmapViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: roadmapDetail, isLoading, isError } = useRoadmapDetail(id as string)

  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)

  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    if (!roadmapDetail) return { layoutedNodes: [], layoutedEdges: [] }
    const { nodes, edges } = buildFlowGraph(roadmapDetail, { synthesizeSequentialEdges: true })
    return { layoutedNodes: nodes, layoutedEdges: edges }
  }, [roadmapDetail])

  useEffect(() => {
    if (roadmapDetail?.topics?.length && !currentTopicId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentTopicId(roadmapDetail.topics[0].masterTopicId)
    }
  }, [roadmapDetail, currentTopicId])

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setCurrentTopicId(node.id)
  }

  const handleGoToTopic = () => {
    if (currentTopicId && id) {
      navigate(`/my-learning/topics/${currentTopicId}?roadmapId=${id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-bg-section flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-brand-purple-600"></span>
          <p className="text-text-muted text-sm font-medium">Loading roadmap details...</p>
        </div>
      </div>
    )
  }

  if (isError || !roadmapDetail) {
    return (
      <div className="bg-bg-section text-error-text flex h-screen items-center justify-center font-bold">
        Failed to load roadmap.
      </div>
    )
  }

  const selectedTopic =
    roadmapDetail.topics.find((t) => t.masterTopicId === currentTopicId) || roadmapDetail.topics[0]

  const progressPercent =
    selectedTopic.sectionTotal > 0
      ? Math.round((selectedTopic.sectionCompleted / selectedTopic.sectionTotal) * 100)
      : selectedTopic.status === 'completed'
        ? 100
        : 0

  const prereqNames = selectedTopic.prerequisiteTopicIds
    .map((reqId) => roadmapDetail.topics.find((t) => t.masterTopicId === reqId)?.name)
    .filter(Boolean)

  const title = roadmapDetail.roadmap.roleName || 'Your Custom Roadmap'
  const topicsCount = roadmapDetail.topics.length
  const durationTotal = roadmapDetail.topics.reduce((sum, t) => sum + (t.estimatedHours || 1), 0)

  return (
    <div className="flex h-full max-w-420">
      <div className="flex flex-1 flex-col overflow-hidden bg-white p-6 lg:p-8">
        <div className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-brand-purple-600 hover:text-brand-purple-700 flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors"
            >
              <RiArrowLeftLine /> Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/roadmaps/${id}/edit`)}
              className="border-border-soft text-text-secondary hover:bg-bg-section flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
            >
              <RiEditLine /> Edit roadmap
            </button>
          </div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-text-primary text-3xl font-bold">{title}</h1>
            <RiBookmarkLine className="text-brand-purple-600 text-2xl" />
          </div>
          <p className="text-text-secondary mb-4 text-sm">
            Your personalized path to mastering these skills.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="border-border-soft text-text-secondary flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <RiTimeLine /> ~{durationTotal} hours
            </div>
            <div className="border-border-soft text-text-secondary flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <RiListUnordered /> {topicsCount} topics
            </div>
            <div className="border-border-soft text-text-secondary flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <RiBarChartBoxLine /> Adaptive
            </div>
            <div className="border-border-purple bg-bg-lavender text-brand-purple-700 flex items-center gap-2 rounded-lg border px-3 py-1.5 tracking-wider uppercase">
              <RiStarLine /> {roadmapDetail.roadmap.sourceType}
            </div>
          </div>
        </div>

        <RoadmapGraph
          nodes={layoutedNodes}
          edges={layoutedEdges}
          onNodeClick={handleNodeClick}
          isReadOnly={false}
          withUI={true}
        />
      </div>

      <aside className="border-border-soft flex w-95 shrink-0 flex-col border-l bg-white">
        <div className="border-border-soft flex items-center justify-between border-b p-6 pb-4">
          <p className="text-brand-purple-600 text-xs font-bold tracking-wider uppercase">
            Selected Topic
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <h2 className="text-text-primary mb-6 text-2xl font-bold">{selectedTopic.name}</h2>

          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-text-secondary">Progress</span>
              <span className="text-text-primary">{progressPercent}%</span>
            </div>
            <div className="bg-bg-section h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-brand-purple-600 h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-text-primary mb-3 text-sm font-bold">Prerequisites</h3>
            {prereqNames.length > 0 ? (
              <ul className="space-y-2.5">
                {prereqNames.map((req) => (
                  <li
                    key={req}
                    className="text-text-secondary flex items-center gap-3 text-sm font-medium"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <RiCheckLine className="text-xs" />
                    </div>
                    {req}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-sm">No prerequisites required.</p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-text-primary mb-2 text-sm font-bold">About this topic</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Complete the sections in this topic to advance your knowledge of {selectedTopic.name}.
              Estimated effort: {selectedTopic.estimatedHours} hours.
            </p>
          </div>

          <div>
            <h3 className="text-text-primary mb-3 text-sm font-bold">Sections Included</h3>
            <ul className="space-y-3">
              <li className="text-text-secondary flex items-start gap-3 text-sm">
                <RiCheckboxCircleFill className="text-brand-purple-600 mt-0.5 shrink-0 text-base" />
                <span className="font-medium">
                  {selectedTopic.sectionTotal} Total Sections to complete
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border-soft space-y-3 border-t bg-white p-6">
          <button
            onClick={handleGoToTopic}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#0B1528] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            Continue learning <RiArrowRightLine className="text-lg" />
          </button>
          <button
            onClick={handleGoToTopic}
            className="border-border-soft text-text-secondary hover:bg-bg-section flex w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-5 py-3.5 text-sm font-bold transition-colors"
          >
            View topic details <RiExternalLinkLine className="text-text-placeholder text-lg" />
          </button>
          <button
            onClick={() => toast.success('Saved to your bookmarks!')}
            className="text-text-muted hover:text-brand-purple-600 mt-2 flex w-full cursor-pointer items-center justify-center gap-2 pt-2 text-sm font-medium transition-colors"
          >
            <RiBookmark2Line className="text-lg" /> Save for later
          </button>
        </div>
      </aside>
    </div>
  )
}

export default RoadmapViewPage
