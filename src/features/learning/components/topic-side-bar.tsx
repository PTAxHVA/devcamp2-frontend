import { useNavigate } from 'react-router'
import {
  RiCheckFill,
  RiTimeLine,
  RiBookOpenLine,
  RiLockLine,
  RiArrowRightLine,
} from 'react-icons/ri'
import type { LearningTopic } from '../types'

interface TopicDetailSidebarProps {
  topic: LearningTopic | null
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
    label: 'Available',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    borderB: 'border-b-violet-200',
    dot: 'bg-violet-500',
    bar: 'bg-brand-purple-600',
  },
  locked: {
    label: 'Locked',
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    borderB: 'border-b-slate-200',
    dot: 'bg-slate-400',
    bar: 'bg-slate-300',
  },
}

export default function TopicDetailSidebar({ topic }: TopicDetailSidebarProps) {
  const navigate = useNavigate()

  if (!topic) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <RiBookOpenLine className="mx-auto mb-3 text-4xl text-slate-200" />
        <p className="text-sm font-medium text-slate-400">
          Click a topic on the map to see details
        </p>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[topic.status]
  const sectionProgress =
    topic.sectionTotal > 0 ? Math.round((topic.sectionCompleted / topic.sectionTotal) * 100) : 0

  const estimateLabel =
    topic.estimatedHours < 1
      ? `~${Math.round(topic.estimatedHours * 60)} min`
      : topic.estimatedHours === 1
        ? '~1 hour'
        : `~${topic.estimatedHours} hours`

  const canNavigate = topic.status !== 'locked'

  const btnLabel =
    topic.status === 'completed'
      ? 'Review Topic'
      : topic.status === 'in_progress'
        ? 'Continue Learning'
        : topic.status === 'available'
          ? 'Start Topic'
          : 'Locked'

  return (
    <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Status banner */}
      <div className={`flex items-center gap-2 border-b px-5 py-2.5 ${cfg.bg} ${cfg.borderB}`}>
        <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-bold tracking-wider uppercase ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <div className="p-5">
        <p className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">Topic</p>
        <h2 className="mb-4 text-xl leading-tight font-black text-slate-800">{topic.title}</h2>

        {/* Section progress */}
        {topic.sectionTotal > 0 && (
          <div className="mb-5">
            <div className="mb-1.5 flex justify-between text-xs font-bold text-slate-500">
              <span>Sections completed</span>
              <span>
                {topic.sectionCompleted}/{topic.sectionTotal}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all duration-300 ${cfg.bar}`}
                style={{ width: `${sectionProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 space-y-2.5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-sm">
            <RiTimeLine className="shrink-0 text-slate-400" />
            <span className="font-semibold text-slate-600">Estimated time</span>
            <span className="ml-auto font-medium text-slate-500">{estimateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RiBookOpenLine className="shrink-0 text-slate-400" />
            <span className="font-semibold text-slate-600">Sections</span>
            <span className="ml-auto font-medium text-slate-500">{topic.sectionTotal}</span>
          </div>
        </div>

        {/* Prerequisites */}
        {topic.prerequisiteTopicIds.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-black tracking-wider text-slate-700 uppercase">
              Prerequisites
            </h4>
            <div className="space-y-1.5">
              {topic.prerequisiteTopicIds.map((id) => (
                <div key={id} className="flex items-center gap-2 text-xs text-slate-500">
                  <RiCheckFill className="shrink-0 text-sm text-emerald-500" />
                  <span className="truncate font-mono text-[11px] text-slate-400">
                    {id.slice(-8)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          disabled={!canNavigate}
          onClick={() => canNavigate && navigate(`/my-learning/topics/${topic.masterTopicId}`)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            !canNavigate
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
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
