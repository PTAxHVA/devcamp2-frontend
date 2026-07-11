import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { RiBookOpenLine, RiEditLine, RiTimeLine, RiListUnordered, RiStarLine } from 'react-icons/ri'
import { formatRoadmapSource } from '../features/roadmap/lib/roadmap-source-label'
import ProgressHeader from '../features/learning/progress-header'
import RoadmapSnakePath from '../features/learning/components/snake-roadmap'
import ForkPathBanner from '../features/learning/components/fork-path-banner'
import TopicDetailSidebar from '../features/learning/components/topic-side-bar'
import { useMyRoadmaps, useRoadmapDetail } from '../features/learning/hooks/use-my-learning'
import { roadmapSlug } from '../features/learning/lib/roadmap-slug'
import type { LearningTopic } from '../features/learning/types'

function getShortRoleName(name: string | null | undefined): string {
  if (!name) return 'Roadmap'
  const lower = name.toLowerCase()
  if (lower.includes('frontend')) return 'Frontend'
  if (lower.includes('backend')) return 'Backend'
  return name
}

export default function MyLearningJourneyPage() {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  // Selection is scoped to its roadmap so it's ignored once the user switches roadmaps.
  const [selected, setSelected] = useState<{ roadmapId: string; topicId: string } | null>(null)

  const {
    data: roadmaps,
    isLoading: loadingList,
    isError: listError,
    refetch: refetchList,
  } = useMyRoadmaps()

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
      roadmapDetail.topics.find((t) => t.status !== 'completed') ??
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

  // A failed request is NOT "no roadmaps": during a server hiccup the old code fell
  // into the empty state below and looked like the learner's data was gone (NEW-2).
  if (listError) {
    return (
      <div className="border-error-border bg-error-bg text-error-text mx-auto my-20 max-w-md rounded-2xl border p-8 text-center">
        <p className="text-lg font-bold">Couldn't load your roadmaps</p>
        <p className="mt-1 text-sm">Please check your connection and try again.</p>
        <button
          onClick={() => void refetchList()}
          className="border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 mt-5 rounded-xl border px-5 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="border-border-soft bg-bg-card mx-auto my-20 max-w-md rounded-2xl border p-10 text-center shadow-sm">
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
      <div className="border-border-soft bg-bg-card mx-auto my-20 max-w-md rounded-2xl border p-10 text-center shadow-sm">
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
              className="bg-brand-purple-600 hover:bg-brand-purple-700 focus-visible:ring-brand-purple-300 max-w-full rounded-lg px-3 py-1.5 text-xs font-bold break-words text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              {r.roleName ?? 'Roadmap'}
            </button>
          ))}
          <button
            onClick={() => navigate('/roadmaps/browse')}
            className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
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
  // Sum real estimates only — don't fabricate hours for topics missing one.
  const durationTotal = topics.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)

  return (
    <div className="mx-auto w-full max-w-375 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-full min-w-0">
          <h1 className="text-text-primary max-w-full text-2xl font-black break-words">
            {roadmap.roleName ?? 'My Learning Journey'}
          </h1>
          <p className="text-text-muted mt-0.5 text-sm">
            Follow your roadmap step by step and keep moving forward.
          </p>

          {/* Roadmap-level metadata (moved here when /roadmaps/:id was folded in). */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium">
            {durationTotal > 0 && (
              <div className="border-border-soft text-text-secondary flex items-center gap-2 rounded-lg border px-3 py-1.5">
                <RiTimeLine /> ~{durationTotal} hours
              </div>
            )}
            <div className="border-border-soft text-text-secondary flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <RiListUnordered /> {topics.length} topics
            </div>
            <div className="border-border-purple bg-bg-lavender text-brand-purple-700 flex items-center gap-2 rounded-lg border px-3 py-1.5 tracking-wider uppercase">
              <RiStarLine /> {formatRoadmapSource(roadmap.sourceType)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {/* Edit roadmap — the entry point that used to live on /roadmaps/:id. */}
          {activeRoadmapId && (
            <button
              onClick={() => navigate(`/roadmaps/${activeRoadmapId}/edit`)}
              className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <RiEditLine /> Edit roadmap
            </button>
          )}{' '}
          {/* Roadmap switcher — only shown when user has 2 active roadmaps */}
          {roadmaps.length > 1 && (
            <div className="border-border-soft bg-bg-card flex items-center gap-1 rounded-xl border p-1 shadow-sm">
              {roadmaps.map((r, idx) => (
                <button
                  key={r._id}
                  onClick={() => navigate(`/my-learning/${roadmapSlug(r.roleName)}`)}
                  className={`focus-visible:ring-brand-purple-300 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${
                    r._id === activeRoadmapId
                      ? 'bg-brand-purple-600 text-white shadow-sm'
                      : 'text-text-muted hover:bg-bg-section hover:text-text-secondary'
                  }`}
                >
                  <span className="hidden sm:inline">{r.roleName ?? `Roadmap ${idx + 1}`}</span>
                  <span className="inline sm:hidden">{getShortRoleName(r.roleName)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ProgressHeader topics={topics} />
          <ForkPathBanner
            masterRoadmapId={roadmap.masterRoadmapId}
            roadmapId={activeRoadmapId}
            topics={topics}
          />
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
          <TopicDetailSidebar topic={activeTopic} topics={topics} roadmapId={activeRoadmapId} />
        </div>
      </div>
    </div>
  )
}
