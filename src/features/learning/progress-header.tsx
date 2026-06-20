import { RiCalendarCheckLine, RiTimeLine, RiFlagLine } from 'react-icons/ri'
import type { LearningTopic } from './types'

interface ProgressHeaderProps {
  topics: LearningTopic[]
}

export default function ProgressHeader({ topics }: ProgressHeaderProps) {
  const completed = topics.filter((t) => t.status === 'completed')
  const overallProgress =
    topics.length > 0 ? Math.round((completed.length / topics.length) * 100) : 0

  const remainingHours = topics
    .filter((t) => t.status !== 'completed')
    .reduce((sum, t) => sum + t.estimatedHours, 0)

  const hoursLabel =
    remainingHours === 0
      ? 'All done!'
      : remainingHours < 1
        ? `${Math.round(remainingHours * 60)}m left`
        : `~${Math.round(remainingHours)}h left`

  const nextTopic =
    topics.find((t) => t.status === 'in_progress') ?? topics.find((t) => t.status !== 'completed')

  return (
    <div className="border-border-soft grid grid-cols-2 gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-4">
      <div className="border-border-soft flex items-center gap-3 border-r pr-4">
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

      <div className="border-border-soft flex items-center gap-3 border-r pr-4">
        <div className="shrink-0 rounded-xl bg-green-50 p-3 text-xl text-green-600">
          <RiCalendarCheckLine />
        </div>
        <div>
          <p className="text-text-placeholder text-xs font-bold">Completed</p>
          <p className="text-text-secondary text-sm font-black">{completed.length} Topics</p>
        </div>
      </div>

      <div className="border-border-soft flex items-center gap-3 border-r pr-4">
        <div className="shrink-0 rounded-xl bg-amber-50 p-3 text-xl text-amber-600">
          <RiTimeLine />
        </div>
        <div>
          <p className="text-text-placeholder text-xs font-bold">Est. Remaining</p>
          <p className="text-text-secondary text-sm font-black">{hoursLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-xl text-indigo-600">
          <RiFlagLine />
        </div>
        <div className="min-w-0">
          <p className="text-text-placeholder text-xs font-bold">Up Next</p>
          <p className="text-brand-purple-600 truncate text-sm font-black">
            {nextTopic?.title ?? 'All done!'}
          </p>
        </div>
      </div>
    </div>
  )
}
