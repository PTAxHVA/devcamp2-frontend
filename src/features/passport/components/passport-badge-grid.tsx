import { FiAward } from 'react-icons/fi'
import type { PassportVerifiedTopic } from '../lib/passport-api'

interface PassportBadgeGridProps {
  topics: PassportVerifiedTopic[]
}

/** Badge per quiz-verified topic (100% of its sections passed) with mastery %. */
export function PassportBadgeGrid({ topics }: PassportBadgeGridProps) {
  if (topics.length === 0) {
    return (
      <div className="border-border-soft text-text-muted rounded-2xl border-2 border-dashed bg-white p-8 text-center text-sm">
        No verified skills yet — badges appear here after every section quiz of a topic is passed.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <div
          key={topic.name}
          className="border-border-soft hover:border-border-purple group rounded-2xl border bg-white p-4 transition"
        >
          <div className="flex items-start gap-3">
            <div className="bg-bg-lavender flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <FiAward className="text-brand-purple-500 h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary truncate text-sm font-bold">{topic.name}</p>
              <p className="text-text-muted mt-0.5 text-xs">
                Quiz-verified · {topic.masteryPct}% mastery
              </p>
              <div className="bg-bg-section mt-2.5 h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-brand-purple-500 h-full rounded-full"
                  style={{ width: `${Math.min(topic.masteryPct, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
