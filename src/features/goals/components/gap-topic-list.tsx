import type { IconType } from 'react-icons'
import { FiCheckCircle, FiClock, FiCircle } from 'react-icons/fi'
import type { GapTopicItem } from '../types'

interface GapTopicListProps {
  verified: GapTopicItem[]
  inProgress: GapTopicItem[]
  missing: GapTopicItem[]
}

interface GapGroupProps {
  title: string
  emptyNote: string
  topics: GapTopicItem[]
  icon: IconType
  iconClass: string
  chipClass: string
}

function GapGroup({ title, emptyNote, topics, icon: Icon, iconClass, chipClass }: GapGroupProps) {
  return (
    <div className="border-border-soft flex flex-col rounded-3xl border bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-text-primary flex items-center gap-2 text-sm font-bold">
          <Icon className={`h-4 w-4 ${iconClass}`} /> {title}
        </h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${chipClass}`}>
          {topics.length}
        </span>
      </div>
      {topics.length === 0 ? (
        <p className="text-text-muted mt-3 text-xs">{emptyNote}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {topics.map((topic) => (
            <li
              key={topic.topicId}
              className="bg-bg-section flex items-start justify-between gap-3 rounded-xl px-3 py-2"
            >
              <span className="text-text-primary text-sm leading-tight font-medium">
                {topic.name}
              </span>
              {topic.estimatedHours > 0 && (
                <span className="text-text-muted mt-0.5 shrink-0 text-xs">
                  ~{topic.estimatedHours}h
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** The gap table: required topics split into verified / in progress / missing. */
export function GapTopicList({ verified, inProgress, missing }: GapTopicListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <GapGroup
        title="Verified"
        emptyNote="Nothing verified for this role yet — pass section quizzes to earn these."
        topics={verified}
        icon={FiCheckCircle}
        iconClass="text-green-600"
        chipClass="bg-green-50 text-green-700"
      />
      <GapGroup
        title="In progress"
        emptyNote="No topics started for this role yet."
        topics={inProgress}
        icon={FiClock}
        iconClass="text-amber-600"
        chipClass="bg-amber-50 text-amber-600"
      />
      <GapGroup
        title="Missing"
        emptyNote="No gaps — every required topic is covered!"
        topics={missing}
        icon={FiCircle}
        iconClass="text-text-muted"
        chipClass="bg-bg-section text-text-secondary"
      />
    </div>
  )
}
