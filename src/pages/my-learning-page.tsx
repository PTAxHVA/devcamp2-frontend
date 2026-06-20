import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { RiBookOpenLine } from 'react-icons/ri'
import ProgressHeader from '../features/learning/progress-header'
import RoadmapSnakePath from '../features/learning/components/snake-roadmap'
import TopicDetailSidebar from '../features/learning/components/topic-side-bar'
import { useMyRoadmaps, useRoadmapDetail } from '../features/learning/hooks/use-my-learning'
import { roadmapSlug } from '../features/learning/lib/roadmap-slug'
import type { LearningTopic } from '../features/learning/types'

export default function MyLearningJourneyPage() {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  // Selection is scoped to its roadmap so it's ignored once the user switches roadmaps.
  const [selected, setSelected] = useState<{ roadmapId: string; topicId: string } | null>(null)

  const { data: roadmaps, isLoading: loadingList } = useMyRoadmaps()

  // Resolve which roadmap the URL slug points at (e.g. "front-end" -> Frontend roadmap).
  const activeRoadmap = useMemo(() => {
    if (!roadmaps?.length) return null
    if (slug) return roadmaps.find((r) => roadmapSlug(r.roleName) === slug) ?? null
    return roadmaps[0]
  }, [roadmaps, slug])

  const activeRoadmapId = activeRoadmap?._id ?? null

  // Only the bare /my-learning auto-redirects to the first roadmap. An explicit but
  // unknown slug (e.g. a roadmap you're not following) must NOT silently hijack to
  // another roadmap — it falls through to the "not following" state below.
  useEffect(() => {
    if (!roadmaps?.length || slug) return
    navigate(`/my-learning/${roadmapSlug(roadmaps[0].roleName)}`, { replace: true })
  }, [roadmaps, slug, navigate])

  const {
    data: roadmapDetail,
    isLoading: loadingDetail,
    isError,
  } = useRoadmapDetail(activeRoadmapId)

  const activeTopic = useMemo((): LearningTopic | null => {
    if (!roadmapDetail?.topics) return null
    if (selected && selected.roadmapId === activeRoadmapId) {
      const found = roadmapDetail.topics.find((t) => t.masterTopicId === selected.topicId)
      if (found) return found
    }
    return (
      roadmapDetail.topics.find((t) => t.status === 'in_progress') ??
      roadmapDetail.topics.find((t) => t.status === 'available') ??
      roadmapDetail.topics[0] ??
      null
    )
  }, [roadmapDetail, selected, activeRoadmapId])

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
      <div className="border-border-soft mx-auto my-20 max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
        <RiBookOpenLine className="text-text-disabled mx-auto mb-4 text-5xl" />
        <p className="text-text-secondary text-lg font-bold">No active roadmaps</p>
        <p className="text-text-muted mt-1 text-sm">
          Start a roadmap from the dashboard to begin your learning journey.
        </p>
      </div>
    )
  }

  if (!activeRoadmap) {
    // Bare /my-learning: the effect is redirecting to the first roadmap's slug.
    if (!slug) {
      return (
        <div className="flex w-full items-center justify-center py-32">
          <span className="loading loading-spinner loading-lg text-brand-purple-600" />
        </div>
      )
    }
    // Explicit slug, but the user isn't following that roadmap.
    return (
      <div className="border-border-soft mx-auto my-20 max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
        <RiBookOpenLine className="text-text-disabled mx-auto mb-4 text-5xl" />
        <p className="text-text-secondary text-lg font-bold">You're not following this roadmap</p>
        <p className="text-text-muted mt-1 text-sm">
          Pick one you're learning, or browse roadmaps to start a new one.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {roadmaps.map((r) => (
            <button
              key={r._id}
              onClick={() => navigate(`/my-learning/${roadmapSlug(r.roleName)}`)}
              className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors"
            >
              {r.roleName ?? 'Roadmap'}
            </button>
          ))}
          <button
            onClick={() => navigate('/roadmaps/browse')}
            className="border-border-soft text-text-secondary hover:bg-bg-section rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors"
          >
            Browse roadmaps
          </button>
        </div>
      </div>
    )
  }

  if (isError || !roadmapDetail) {
    return (
      <div className="border-error-border bg-error-bg text-error-text mx-auto my-20 max-w-md rounded-2xl border p-8 text-center">
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
          <h1 className="text-text-primary text-2xl font-black">
            {roadmap.roleName ?? 'My Learning Journey'}
          </h1>
          <p className="text-text-muted mt-0.5 text-sm">
            Follow your roadmap step by step and keep moving forward.
          </p>
        </div>

        {/* Roadmap switcher — only shown when user has 2 active roadmaps */}
        {roadmaps.length > 1 && (
          <div className="border-border-soft flex items-center gap-1 rounded-xl border bg-white p-1 shadow-sm">
            {roadmaps.map((r, idx) => (
              <button
                key={r._id}
                onClick={() => navigate(`/my-learning/${roadmapSlug(r.roleName)}`)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  r._id === activeRoadmapId
                    ? 'bg-brand-purple-600 text-white shadow-sm'
                    : 'text-text-muted hover:bg-bg-section hover:text-text-secondary'
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
            onNodeClick={(topic) =>
              activeRoadmapId &&
              setSelected({ roadmapId: activeRoadmapId, topicId: topic.masterTopicId })
            }
          />
        </div>

        <div className="w-full">
          <TopicDetailSidebar topic={activeTopic} />
        </div>
      </div>
    </div>
  )
}
