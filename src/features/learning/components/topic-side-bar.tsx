import { useNavigate } from 'react-router'
import {
  RiCheckFill,
  RiCheckboxBlankCircleLine,
  RiTimeLine,
  RiBookOpenLine,
  RiLockLine,
  RiArrowRightLine,
} from 'react-icons/ri'
import type { LearningTopic } from '../types'

interface TopicDetailSidebarProps {
  topic: LearningTopic | null
  // The full roadmap topic list — used to resolve prerequisite ids to real
  // names + completion status (H8), so no raw ObjectId or fake tick is shown.
  topics: LearningTopic[]
  roadmapId?: string | null
}

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    borderB: 'border-b-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    borderB: 'border-b-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  available: {
    label: 'Ready to Start',
    color: 'text-brand-purple-600',
    bg: 'bg-bg-lavender',
    borderB: 'border-b-brand-purple-100',
    dot: 'bg-brand-purple-400',
    bar: 'bg-brand-purple-400',
  },
  locked: {
    label: 'Locked',
    color: 'text-text-muted',
    bg: 'bg-bg-section',
    borderB: 'border-b-slate-200',
    dot: 'bg-slate-400',
    bar: 'bg-slate-300',
  },
}

export default function TopicDetailSidebar({ topic, topics, roadmapId }: TopicDetailSidebarProps) {
  const navigate = useNavigate()
  const q = roadmapId ? `?roadmapId=${roadmapId}` : ''

  if (!topic) {
    return (
      <div className="border-border-soft bg-bg-card rounded-2xl border p-8 text-center shadow-sm">
        <RiBookOpenLine className="text-text-disabled mx-auto mb-3 text-4xl" />
        <p className="text-text-placeholder text-sm font-medium">
          Click a topic on the map to see details
        </p>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[topic.status]

  // Resolve prerequisite ids to their real topic name + completion status.
  const prereqs = topic.prerequisiteTopicIds
    .map((id) => {
      const t = topics.find((tp) => tp.masterTopicId === id)
      return t ? { name: t.title, completed: t.status === 'completed' } : null
    })
    .filter((p): p is { name: string; completed: boolean } => p !== null)

  const sectionProgress =
    topic.sectionTotal > 0 ? Math.round((topic.sectionCompleted / topic.sectionTotal) * 100) : 0

  const estimateLabel =
    topic.estimatedHours <= 0
      ? '—'
      : topic.estimatedHours < 1
        ? `~${Math.round(topic.estimatedHours * 60)} min`
        : topic.estimatedHours === 1
          ? '~1 hour'
          : `~${topic.estimatedHours} hours`

  const canNavigate = topic.status !== 'locked' // 'available', 'in_progress', 'completed' all navigable

  const btnLabel =
    topic.status === 'completed'
      ? 'Review Topic'
      : topic.status === 'in_progress'
        ? 'Continue Learning'
        : topic.status === 'available'
          ? 'Start Learning'
          : 'Locked'

  return (
    <div className="border-border-soft bg-bg-card sticky top-6 overflow-hidden rounded-2xl border shadow-sm">
      {/* Status banner */}
      <div className={`flex items-center gap-2 border-b px-5 py-2.5 ${cfg.bg} ${cfg.borderB}`}>
        <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-bold tracking-wider uppercase ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <div className="p-5">
        <p className="text-text-placeholder mb-1 text-xs font-bold tracking-wider uppercase">
          Topic
        </p>
        <h2 className="text-text-primary mb-4 text-xl leading-tight font-black">{topic.title}</h2>

        {/* Section progress */}
        {topic.sectionTotal > 0 && (
          <div className="mb-5">
            <div className="text-text-muted mb-1.5 flex justify-between text-xs font-bold">
              <span>Sections completed</span>
              <span>
                {topic.sectionCompleted}/{topic.sectionTotal}
              </span>
            </div>
            <div className="bg-bg-section h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-200 ${cfg.bar}`}
                style={{ width: `${sectionProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="border-border-soft mb-4 space-y-2.5 border-b pb-4">
          <div className="flex items-center gap-2 text-sm">
            <RiTimeLine className="text-text-placeholder shrink-0" />
            <span className="text-text-secondary font-semibold">Estimated time</span>
            <span className="text-text-muted ml-auto font-medium">{estimateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RiBookOpenLine className="text-text-placeholder shrink-0" />
            <span className="text-text-secondary font-semibold">Sections</span>
            <span className="text-text-muted ml-auto font-medium">{topic.sectionTotal}</span>
          </div>
        </div>

        {/* Prerequisites */}
        {prereqs.length > 0 && (
          <div className="mb-4">
            <h4 className="text-text-secondary mb-2 text-xs font-black tracking-wider uppercase">
              Prerequisites
            </h4>
            <div className="space-y-1.5">
              {prereqs.map((p) => (
                <div key={p.name} className="text-text-muted flex items-center gap-2 text-xs">
                  {p.completed ? (
                    <RiCheckFill className="shrink-0 text-sm text-emerald-500" />
                  ) : (
                    <RiCheckboxBlankCircleLine className="text-text-placeholder shrink-0 text-sm" />
                  )}
                  <span className="text-text-secondary truncate text-[11px]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          disabled={!canNavigate}
          onClick={() => canNavigate && navigate(`/my-learning/topics/${topic.masterTopicId}${q}`)}
          className={`focus-visible:ring-brand-purple-300 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${
            !canNavigate
              ? 'bg-bg-section text-text-placeholder cursor-not-allowed'
              : topic.status === 'completed'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-brand-purple-600 hover:bg-brand-purple-700 text-white shadow-lg shadow-violet-200/60'
          }`}
        >
          {!canNavigate && <RiLockLine size={15} />}
          {btnLabel}
          {canNavigate && <RiArrowRightLine size={15} />}
        </button>
      </div>
    </div>
  )
}
