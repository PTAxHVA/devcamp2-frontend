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
    const { nodes, edges } = buildFlowGraph(roadmapDetail)
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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-purple-600"></span>
          <p className="text-sm font-medium text-slate-500">Loading roadmap details...</p>
        </div>
      </div>
    )
  }

  if (isError || !roadmapDetail) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-red-500 font-bold">
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
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800 cursor-pointer"
          >
            <RiArrowLeftLine /> Back to Dashboard
          </button>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <RiBookmarkLine className="text-2xl text-purple-600" />
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Your personalized path to mastering these skills.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiTimeLine /> ~{durationTotal} hours
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiListUnordered /> {topicsCount} topics
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiBarChartBoxLine /> Adaptive
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-purple-700 uppercase tracking-wider">
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

      <aside className="flex w-95 shrink-0 flex-col border-l border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Selected Topic
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">{selectedTopic.name}</h2>

          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-700">Progress</span>
              <span className="text-slate-900">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-purple-600"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Prerequisites</h3>
            {prereqNames.length > 0 ? (
              <ul className="space-y-2.5">
                {prereqNames.map((req) => (
                  <li
                    key={req}
                    className="flex items-center gap-3 text-sm font-medium text-slate-600"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
                      <RiCheckLine className="text-xs" />
                    </div>
                    {req}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No prerequisites required.</p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="mb-2 text-sm font-bold text-slate-900">About this topic</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Complete the sections in this topic to advance your knowledge of {selectedTopic.name}.
              Estimated effort: {selectedTopic.estimatedHours} hours.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Sections Included</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <RiCheckboxCircleFill className="mt-0.5 text-base text-purple-600 shrink-0" />
                <span className="font-medium">
                  {selectedTopic.sectionTotal} Total Sections to complete
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 space-y-3 bg-white">
          <button
            onClick={handleGoToTopic}
            className="flex w-full items-center justify-between rounded-xl bg-[#0B1528] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 cursor-pointer"
          >
            Continue learning <RiArrowRightLine className="text-lg" />
          </button>
          <button
            onClick={handleGoToTopic}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            View topic details <RiExternalLinkLine className="text-lg text-slate-400" />
          </button>
          <button
            onClick={() => toast.success('Saved to your bookmarks!')}
            className="mt-2 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors pt-2 cursor-pointer"
          >
            <RiBookmark2Line className="text-lg" /> Save for later
          </button>
        </div>
      </aside>
    </div>
  )
}

export default RoadmapViewPage
