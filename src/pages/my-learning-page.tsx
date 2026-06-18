import { useState, useMemo } from 'react'
import { RiBookOpenLine } from 'react-icons/ri'
import ProgressHeader from '../features/learning/progress-header'
import RoadmapSnakePath from '../features/learning/components/snake-roadmap'
import TopicDetailSidebar from '../features/learning/components/topic-side-bar'
import { useMyRoadmaps, useRoadmapDetail } from '../features/learning/hooks/use-my-learning'
import type { LearningTopic } from '../features/learning/types'

export default function MyLearningJourneyPage() {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const { data: roadmaps, isLoading: loadingList } = useMyRoadmaps()

  const activeRoadmapId = selectedRoadmapId ?? roadmaps?.[0]?._id ?? null

  const {
    data: roadmapDetail,
    isLoading: loadingDetail,
    isError,
  } = useRoadmapDetail(activeRoadmapId)

  const activeTopic = useMemo((): LearningTopic | null => {
    if (!roadmapDetail?.topics) return null
    if (selectedTopicId) {
      return roadmapDetail.topics.find((t) => t.masterTopicId === selectedTopicId) ?? null
    }
    return (
      roadmapDetail.topics.find((t) => t.status === 'in_progress') ??
      roadmapDetail.topics.find((t) => t.status === 'available') ??
      roadmapDetail.topics[0] ??
      null
    )
  }, [roadmapDetail, selectedTopicId])

  const isLoading = loadingList || (!!activeRoadmapId && loadingDetail)

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-32">
        <span className="loading loading-spinner loading-lg text-brand-purple-600" />
      </div>
    )
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="mx-auto my-20 max-w-md rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <RiBookOpenLine className="mx-auto mb-4 text-5xl text-slate-200" />
        <p className="text-lg font-bold text-slate-700">No active roadmaps</p>
        <p className="mt-1 text-sm text-slate-500">
          Start a roadmap from the dashboard to begin your learning journey.
        </p>
      </div>
    )
  }

  if (isError || !roadmapDetail) {
    return (
      <div className="mx-auto my-20 max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <p className="text-lg font-bold">Failed to load roadmap</p>
        <p className="mt-1 text-sm">Please check your connection or try again.</p>
      </div>
    )
  }

  const { roadmap, topics } = roadmapDetail

  return (
    <div className="mx-auto w-full max-w-375 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {roadmap.roleName ?? 'My Learning Journey'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Follow your roadmap step by step and keep moving forward.
          </p>
        </div>

        {/* Roadmap switcher — only shown when user has 2 active roadmaps */}
        {roadmaps.length > 1 && (
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {roadmaps.map((r, idx) => (
              <button
                key={r._id}
                onClick={() => {
                  setSelectedRoadmapId(r._id)
                  setSelectedTopicId(null)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  r._id === activeRoadmapId
                    ? 'bg-brand-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {r.roleName ?? `Roadmap ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ProgressHeader topics={topics} />
          <RoadmapSnakePath
            topics={topics}
            activeTopicId={activeTopic?.masterTopicId}
            onNodeClick={(topic) => setSelectedTopicId(topic.masterTopicId)}
          />
        </div>

        <div className="w-full">
          <TopicDetailSidebar topic={activeTopic} />
        </div>
      </div>
    </div>
  )
}
