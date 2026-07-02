import React from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router'
import type { IconType } from 'react-icons'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiListUnordered,
  RiFileList2Line,
  RiBarChart2Line,
  RiStarLine,
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
  RiDraggable,
  RiQuestionLine,
  RiBookOpenLine,
  RiFocus3Line,
  RiTimeLine,
  RiExternalLinkLine,
  RiFileTextLine,
  RiPlayCircleLine,
  RiCodeSSlashLine,
  RiAlertLine,
} from 'react-icons/ri'

import { useTopicDetail } from './hooks/use-topic-detail'

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

/* ------------------------- Badge & icon trạng thái ------------------------- */
export type Status = 'Completed' | 'In Progress' | 'Not Started'

const statusStyles: Record<Status, string> = {
  Completed: 'bg-emerald-50 text-emerald-600',
  'In Progress': 'bg-indigo-50 text-indigo-600',
  'Not Started': 'bg-bg-section text-text-muted',
}

const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className={`inline-flex justify-center rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {status}
  </span>
)

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === 'Completed') return <RiCheckboxCircleFill className="h-5 w-5 text-emerald-500" />
  if (status === 'In Progress')
    return <span className="block h-5 w-5 rounded-full border-2 border-dashed border-indigo-400" />
  return <RiCheckboxBlankCircleLine className="text-text-disabled h-5 w-5" />
}

/* --------------------------------- Card ---------------------------------- */
interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card = ({ className = '', children }: CardProps) => (
  <div className={`border-border-soft rounded-2xl border bg-white ${className}`}>{children}</div>
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

// Fallback logic for Topic Prerequisites
const getPrerequisites = (topicName: string): string[] => {
  const name = topicName.toLowerCase()
  if (name.includes('dom') || name.includes('event')) {
    return ['HTML & CSS', 'JavaScript Basics']
  }
  if (name.includes('react') || name.includes('component')) {
    return ['JavaScript Basics', 'HTML & CSS', 'Git & GitHub']
  }
  return ['Basic Web Development']
}

// Fallback logic for Topic Objectives
const getObjectives = (topicName: string): string[] => {
  const name = topicName.toLowerCase()
  if (name.includes('dom') || name.includes('event')) {
    return [
      'Understand the structure of the DOM tree',
      'Select and manipulate DOM elements',
      'Handle user events effectively',
      'Build interactive UI components',
    ]
  }
  return [
    'Understand core foundational concepts',
    'Apply practical learning materials and guides',
    'Build fully functioning mini projects',
  ]
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
  const topicDescription = data.description || 'No description available for this topic.'
  const orderIndex = data.orderIndex || 0
  const sections = data.sectionList || []
  const userProgress = data.userProgress || []

  // Sibling calculations
  const totalSections = sections.length
  const completedSections = sections.filter((s) =>
    userProgress.some((p) => p.sectionId === s._id && p.isCompleted),
  ).length
  const progressPercent =
    totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0

  // Flat-map resources across sections
  const resources = sections.flatMap((sec) =>
    (sec.resourceList || []).map((r) => ({
      title: r.title,
      url: r.url,
      type: r.type,
      estimatedMinutes: r.estimatedMinutes,
      sectionId: sec._id,
    })),
  )

  // Topic-level estimate comes straight from the API (curated resource hours),
  // shown once — not re-summed per section, which is what inflated the number.
  const estimatedHours = data.estimatedHours || 0
  const estimatedTimeText =
    estimatedHours > 0 ? `${estimatedHours} ${estimatedHours === 1 ? 'hour' : 'hours'}` : '—'

  const objectives = getObjectives(topicName)
  const prerequisites = getPrerequisites(topicName)

  const cols = 'grid-cols-[20px_22px_1fr_104px_24px]'

  const getSectionStatus = (secId: string): Status => {
    const progress = userProgress.find((p) => p.sectionId === secId)
    if (!progress) return 'Not Started'
    return progress.isCompleted ? 'Completed' : 'In Progress'
  }

  const handleContinueTopic = () => {
    const nextIncomplete =
      sections.find((s) => getSectionStatus(s._id) !== 'Completed') || sections[0]
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
          className="text-text-secondary hover:text-text-primary flex cursor-pointer items-center gap-2 text-sm font-medium transition"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Roadmap
        </button>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* ============================ MAIN ============================ */}
          <main className="flex-1 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="bg-bg-lavender text-brand-purple-700 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                {orderIndex + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-text-primary text-3xl font-bold">{topicName}</h1>
                  <span className="bg-bg-lavender text-brand-purple-700 rounded-md px-2.5 py-1 text-xs font-semibold">
                    Required
                  </span>
                </div>
                {/* Progress */}
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-text-secondary text-sm font-medium">Progress</span>
                  <div className="h-2 w-full max-w-75 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="bg-brand-purple-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-text-muted text-sm whitespace-nowrap">
                    {progressPercent}% complete
                  </span>
                </div>
              </div>
            </div>

            <p className="text-text-secondary max-w-3xl leading-relaxed">{topicDescription}</p>

            {/* Objectives + Prerequisites */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <RiFocus3Line className="text-brand-purple-600 h-5 w-5" />
                  <h3 className="text-text-primary font-semibold">Learning objectives</h3>
                </div>
                <ul className="space-y-2.5">
                  {objectives.map((o) => (
                    <li key={o} className="text-text-secondary flex items-start gap-2.5 text-sm">
                      <span className="bg-brand-purple-400 mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {o}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <RiBookOpenLine className="text-brand-purple-600 h-5 w-5" />
                  <h3 className="text-text-primary font-semibold">Prerequisites</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prerequisites.map((p) => (
                    <span
                      key={p}
                      className="border-border-soft text-text-secondary rounded-lg border px-3 py-1.5 text-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Resources */}
            {resources.length > 0 && (
              <Card className="p-6">
                <h3 className="text-text-primary mb-4 font-semibold">Resources</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {resources.slice(0, 8).map((r, index) => {
                    const Icon = getResourceIcon(r.type)
                    return (
                      <Link
                        key={index}
                        to={`/my-learning/topics/${id}/sections/${r.sectionId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`}
                        className="border-border-soft hover:border-border-purple flex min-h-31 flex-col justify-between rounded-xl border p-4 text-left transition hover:shadow-sm"
                      >
                        <div className="flex gap-3">
                          <div className="bg-bg-lavender text-brand-purple-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-text-placeholder text-xs font-semibold uppercase">
                              {r.type}
                            </p>
                            <p className="text-text-primary text-sm leading-snug font-semibold">
                              {r.title}
                            </p>
                          </div>
                        </div>
                        <p className="text-text-placeholder mt-3 flex items-center gap-1 text-xs">
                          {r.estimatedMinutes ? `${r.estimatedMinutes} min` : 'External link'}
                          <RiExternalLinkLine className="h-3.5 w-3.5" />
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Sections */}
            <Card className="p-6">
              <h3 className="text-text-primary mb-3 font-semibold">Sections</h3>
              <div
                className={`grid ${cols} text-text-placeholder items-center gap-4 px-2 pb-1 text-xs font-medium`}
              >
                <span />
                <span>#</span>
                <span>Section</span>
                <span className="text-center">Status</span>
                <span />
              </div>
              {sections.map((sec, idx) => {
                const status = getSectionStatus(sec._id)
                return (
                  <div
                    key={sec._id}
                    onClick={() =>
                      navigate(
                        `/my-learning/topics/${id}/sections/${sec._id}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`,
                      )
                    }
                    className={`grid ${cols} border-border-soft hover:bg-bg-section/60 cursor-pointer items-center gap-4 border-t px-2 py-4 transition`}
                  >
                    <RiDraggable className="text-text-disabled h-4 w-4" />
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
                    <StatusBadge status={status} />
                    <StatusIcon status={status} />
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
                  <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
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
                <StatRow icon={RiBarChart2Line} label="Difficulty" value="Intermediate" />
                <StatRow icon={RiStarLine} label="Importance" value="High" />
              </div>

              <button
                onClick={handleContinueTopic}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0B1221] py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Continue topic <RiArrowRightLine className="h-4 w-4" />
              </button>
            </Card>

            {/* Need help */}
            <Card className="hover:border-border-purple cursor-pointer p-5 transition">
              <div className="flex items-center gap-3">
                <div className="bg-bg-lavender text-brand-purple-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <RiQuestionLine className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-semibold">Need help?</p>
                  <p className="text-text-placeholder text-xs">Ask AI Assistant about this topic</p>
                </div>
                <RiArrowRightSLine className="text-text-placeholder h-5 w-5" />
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
