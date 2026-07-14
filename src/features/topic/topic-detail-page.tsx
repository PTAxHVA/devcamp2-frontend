import React from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import type { IconType } from 'react-icons'
import {
  RiArrowLeftLine,
  RiListUnordered,
  RiFileList2Line,
  RiDraggable,
  RiBookOpenLine,
  RiTimeLine,
  RiExternalLinkLine,
  RiFileTextLine,
  RiPlayCircleLine,
  RiCodeSSlashLine,
  RiAlertLine,
} from 'react-icons/ri'

import { useTopicDetail } from './hooks/use-topic-detail'
import { dedupeResources } from './lib/dedupe-resources'
import { TopicWhyPanel } from './components/topic-why-panel'
import { getSectionStatus } from '../section/section-status'
import { SectionStatusBadge, SectionStatusIcon } from '../section/components/section-status-badge'
import { safeUrl } from '@/lib/utils'

/* --------------------------- Vòng tròn % ---------------------------- */
interface CircularProgressProps {
  value: number
  size?: number
  stroke?: number
}

const CircularProgress = ({ value, size = 84, stroke = 8 }: CircularProgressProps) => {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#ede9fe"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="text-text-primary absolute inset-0 flex items-center justify-center text-base font-bold">
        {value}%
      </span>
    </div>
  )
}

/* --------------------------------- Card ---------------------------------- */
interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card = ({ className = '', children }: CardProps) => (
  <div className={`border-border-soft bg-bg-card rounded-2xl border ${className}`}>{children}</div>
)

interface StatRowProps {
  icon: IconType
  label: string
  value: string | number
}

const StatRow = ({ icon: Icon, label, value }: StatRowProps) => (
  <div className="flex items-center justify-between py-2.5">
    <div className="text-text-muted flex items-center gap-3">
      <Icon className="h-4.5 w-4.5" />
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-text-primary text-sm font-semibold">{value}</span>
  </div>
)

// Resource Icon helper
const getResourceIcon = (type: string): IconType => {
  switch (type.toLowerCase()) {
    case 'video':
      return RiPlayCircleLine
    case 'docs':
    case 'documentation':
      return RiBookOpenLine
    case 'interactive':
    case 'project':
      return RiCodeSSlashLine
    case 'article':
    default:
      return RiFileTextLine
  }
}

/* ================================ MAIN PAGE ================================== */
export default function TopicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roadmapId = searchParams.get('roadmapId')

  const { data, isLoading, isError } = useTopicDetail(id ?? '')

  if (isLoading) {
    return (
      <div className="bg-bg-section flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-brand-purple-600"></span>
          <p className="text-text-muted text-sm font-medium">Loading topic details...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="bg-bg-section flex h-screen flex-col items-center justify-center gap-4 text-center">
        <RiAlertLine className="text-error-text animate-pulse text-5xl" />
        <p className="text-text-primary text-lg font-bold">Failed to load topic details.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  const topicName = data.name || 'Untitled Topic'
  const orderIndex = data.orderIndex || 0
  const sections = data.sectionList || []
  const userProgress = data.userProgress || []

  // Sibling calculations
  const totalSections = sections.length
  const completedSections = sections.filter(
    (s) => getSectionStatus(userProgress, s._id) === 'completed',
  ).length
  const progressPercent =
    totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0

  // Flat-map the curated external resources across this topic's sections, then dedupe:
  // the same link is attached to multiple sections, so it would otherwise repeat (OBS-02).
  const resources = dedupeResources(
    sections.flatMap((sec) =>
      (sec.resourceList || []).map((r) => ({
        title: r.title,
        url: r.url,
        type: r.type,
        estimatedMinutes: r.estimatedMinutes,
      })),
    ),
  )

  // Topic-level estimate comes straight from the API (curated resource hours),
  // shown once — not re-summed per section, which is what inflated the number.
  const estimatedHours = data.estimatedHours || 0
  const estimatedTimeText =
    estimatedHours > 0 ? `${estimatedHours} ${estimatedHours === 1 ? 'hour' : 'hours'}` : '—'

  // Narrow phones can't fit the full 5-column table (drag + # + name + status +
  // icon), so on mobile we drop the decorative drag handle and the status icon and
  // let the badge size to content — the fixed columns otherwise overran 320px and
  // pushed the status icon off-screen.
  const cols = 'grid-cols-[24px_1fr_auto] gap-2 sm:grid-cols-[20px_22px_1fr_104px_24px] sm:gap-4'

  const handleContinueTopic = () => {
    const nextIncomplete =
      sections.find((s) => getSectionStatus(userProgress, s._id) !== 'completed') || sections[0]
    if (nextIncomplete) {
      const q = roadmapId ? `?roadmapId=${roadmapId}` : ''
      navigate(`/my-learning/topics/${id}/sections/${nextIncomplete._id}${q}`)
    }
  }

  const handleBackToRoadmap = () => {
    if (roadmapId) {
      navigate(`/roadmaps/${roadmapId}`)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-360">
        {/* Back */}
        <button
          onClick={handleBackToRoadmap}
          className="text-text-secondary hover:text-text-primary focus-visible:ring-brand-purple-300 flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Roadmap
        </button>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* ============================ MAIN ============================ */}
          <main className="min-w-0 flex-1 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="bg-bg-lavender text-brand-purple-700 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                {orderIndex + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-text-primary max-w-full min-w-0 text-3xl font-bold break-words">
                    {topicName}
                  </h1>
                </div>
                {/* Progress */}
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-text-secondary text-sm font-medium">Progress</span>
                  <div className="bg-border-soft h-2 w-full max-w-75 overflow-hidden rounded-full">
                    <div
                      className="bg-brand-purple-600 h-full rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-text-muted text-sm whitespace-nowrap">
                    {progressPercent}% complete
                  </span>
                </div>
              </div>
            </div>

            {/* Why learn this + what you'll learn (J) — scrolls in its own frame with a
                sticky CTA footer at lg:, normal page scroll on mobile. */}
            <TopicWhyPanel
              whyLearn={data.whyLearn || ''}
              description={data.description || ''}
              sections={sections}
              completedSections={completedSections}
              totalSections={totalSections}
              onContinue={handleContinueTopic}
            />

            {/* Resources */}
            {resources.length > 0 && (
              <Card className="p-6">
                <h3 className="text-text-primary mb-4 font-semibold">Resources</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {resources.slice(0, 8).map((r, index) => {
                    const Icon = getResourceIcon(r.type)
                    return (
                      <a
                        key={index}
                        href={safeUrl(r.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-border-soft hover:border-border-purple hover:bg-bg-section/50 focus-visible:ring-brand-purple-300 flex min-h-31 flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <div className="flex gap-3">
                          <div className="bg-bg-lavender text-brand-purple-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-text-placeholder text-xs font-semibold uppercase">
                              {r.type}
                            </p>
                            <p className="text-text-primary text-sm leading-snug font-semibold break-words">
                              {r.title}
                            </p>
                          </div>
                        </div>
                        <p className="text-text-placeholder mt-3 flex items-center gap-1 text-xs">
                          {r.estimatedMinutes ? `${r.estimatedMinutes} min` : 'External link'}
                          <RiExternalLinkLine className="h-3.5 w-3.5" />
                        </p>
                      </a>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Sections */}
            <Card className="p-6">
              <h3 className="text-text-primary mb-3 font-semibold">Sections</h3>
              <div
                className={`grid ${cols} text-text-placeholder items-center px-2 pb-1 text-xs font-medium`}
              >
                <span className="hidden sm:block" />
                <span>#</span>
                <span>Section</span>
                <span className="text-center">Status</span>
                <span className="hidden sm:block" />
              </div>
              {sections.map((sec, idx) => {
                const status = getSectionStatus(userProgress, sec._id)
                return (
                  <div
                    key={sec._id}
                    onClick={() =>
                      navigate(
                        `/my-learning/topics/${id}/sections/${sec._id}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`,
                      )
                    }
                    className={`grid ${cols} border-border-soft hover:bg-bg-section/60 cursor-pointer items-center border-t px-2 py-4 transition-colors duration-200`}
                  >
                    <RiDraggable className="text-text-disabled hidden h-4 w-4 sm:block" />
                    <span className="text-text-placeholder text-sm">{idx + 1}</span>
                    <div className="min-w-0">
                      <p className="text-text-primary truncate text-sm font-semibold">{sec.name}</p>
                      <p className="text-text-placeholder mt-0.5 truncate text-xs">
                        {sec.contentOverview
                          ? sec.contentOverview
                              .split('\n')
                              .find((o) => o.trim().length > 0)
                              ?.replace(/[*`]/g, '')
                              ?.replace(/^[0-9.]+\s*/, '')
                              ?.trim() || 'Understand the core concepts of this section.'
                          : 'Understand the core concepts of this section.'}
                      </p>
                    </div>
                    <SectionStatusBadge status={status} />
                    <span className="hidden sm:block">
                      <SectionStatusIcon status={status} />
                    </span>
                  </div>
                )
              })}
            </Card>
          </main>

          {/* ============================ RAIL ============================ */}
          <aside className="w-full shrink-0 space-y-5 lg:w-90">
            {/* Topic summary */}
            <Card className="p-6">
              <h3 className="text-text-primary mb-4 font-semibold">Topic summary</h3>

              <div className="flex items-center gap-4">
                <CircularProgress value={progressPercent} />
                <div>
                  <p className="text-text-primary font-semibold">Your progress</p>
                  <p className="text-text-muted text-sm">
                    {completedSections} of {totalSections} sections completed
                  </p>
                  <div className="bg-border-soft mt-2 h-1.5 w-32 overflow-hidden rounded-full">
                    <div
                      className="bg-brand-purple-600 h-full rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-border-soft my-5 border-t" />

              <div className="divide-y divide-slate-50">
                <StatRow icon={RiTimeLine} label="Estimated time" value={estimatedTimeText} />
                <StatRow icon={RiListUnordered} label="Sections" value={totalSections} />
                <StatRow icon={RiFileList2Line} label="Resources" value={resources.length} />
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
