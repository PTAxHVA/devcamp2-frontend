import { RiCalendarCheckLine, RiTimeLine, RiFlagLine } from 'react-icons/ri'
import type { LearningTopic } from './types'
import { computeOverallSectionProgress } from './lib/progress-metrics'

interface ProgressHeaderProps {
  topics: LearningTopic[]
}

export default function ProgressHeader({ topics }: ProgressHeaderProps) {
  const completed = topics.filter((t) => t.status === 'completed')
  // Section-based overall %, consistent with the dashboard (OBS-01). The "X/Y topics"
  // subtitle below still counts whole completed topics — a separate, labelled stat.
  const overallProgress = computeOverallSectionProgress(topics)

  const remainingHours = topics
    .filter((t) => t.status !== 'completed')
    .reduce((sum, t) => sum + t.estimatedHours, 0)

  const allCompleted = topics.length > 0 && completed.length === topics.length

  // Only say "All done!" when everything is actually completed. If the estimate
  // data is missing (remainingHours is 0 but topics remain), show a neutral dash
  // instead of a misleading "All done!" / "~0m" label.
  const hoursLabel = allCompleted
    ? 'All done!'
    : remainingHours <= 0
      ? '—'
      : remainingHours < 1
        ? `${Math.round(remainingHours * 60)}m left`
        : `~${Math.round(remainingHours)}h left`

  const nextTopic =
    topics.find((t) => t.status === 'in_progress') ?? topics.find((t) => t.status !== 'completed')

  return (
    <div className="border-border-soft bg-bg-card grid grid-cols-2 gap-4 rounded-2xl border p-5 shadow-sm md:grid-cols-4">
      <div className="border-border-soft flex flex-col items-center gap-2 border-r pr-2 text-center sm:flex-row sm:gap-3 sm:pr-4 sm:text-left">
        <div className="text-brand-purple-600 relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-black ring-4 ring-indigo-100">
          {overallProgress}%
        </div>
        <div>
          <p className="text-text-placeholder text-xs font-bold">Overall</p>
          <p className="text-text-secondary text-sm font-black">
            {completed.length}/{topics.length} topics
          </p>
        </div>
      </div>

      <div className="border-border-soft flex flex-col items-center gap-2 pr-0 text-center sm:flex-row sm:gap-3 sm:text-left md:border-r md:pr-4">
        <div className="shrink-0 rounded-xl bg-green-50 p-3 text-xl text-green-600">
          <RiCalendarCheckLine />
        </div>
        <div>
          <p className="text-text-placeholder text-xs font-bold">Completed</p>
          <p className="text-text-secondary text-sm font-black">{completed.length} Topics</p>
        </div>
      </div>

      <div className="border-border-soft flex flex-col items-center gap-2 border-r pr-2 text-center sm:flex-row sm:gap-3 sm:pr-4 sm:text-left">
        <div className="shrink-0 rounded-xl bg-amber-50 p-3 text-xl text-amber-600">
          <RiTimeLine />
        </div>
        <div>
          <p className="text-text-placeholder text-xs font-bold">Est. Remaining</p>
          <p className="text-text-secondary text-sm font-black">{hoursLabel}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
        <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-xl text-indigo-600">
          <RiFlagLine />
        </div>
        <div className="min-w-0">
          <p className="text-text-placeholder text-xs font-bold">Up Next</p>
          <p className="text-brand-purple-600 text-sm leading-tight font-black break-words">
            {nextTopic?.title ?? 'All done!'}
          </p>
        </div>
      </div>
    </div>
  )
}
