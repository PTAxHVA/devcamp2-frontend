import { RiCloseLine, RiLightbulbFlashLine, RiListCheck2, RiLoader4Line } from 'react-icons/ri'
import { useTopicInfo } from '@/features/topic/hooks/use-topic-info'

interface TopicPreviewPanelProps {
  topicId: string
  topicName: string
  onClose: () => void
}

/**
 * Onboarding personalized-plan preview: when a learner taps a suggested topic, this
 * shows WHY it's worth learning (the curated whyLearn line, degrading to the topic
 * description) and WHAT they'll cover (the published section list). Reads the
 * enrollment-free /topics/:id/info endpoint, so it works before the user enrolls.
 */
export const TopicPreviewPanel = ({ topicId, topicName, onClose }: TopicPreviewPanelProps) => {
  const { data, isLoading, isError } = useTopicInfo(topicId)

  const why = data?.whyLearn?.trim() || data?.description?.trim() || ''
  const sections = data?.sectionList ?? []

  return (
    <div className="border-brand-purple-200 bg-bg-card w-full rounded-2xl border-2 p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-brand-purple-600 text-xs font-bold tracking-wide uppercase">
            About this topic
          </p>
          <h3 className="text-text-primary text-lg font-bold">{topicName}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close topic preview"
          className="text-text-placeholder hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-lg p-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          <RiCloseLine className="text-xl" />
        </button>
      </div>

      {isLoading ? (
        <div className="text-text-muted flex items-center gap-2 py-6 text-sm">
          <RiLoader4Line className="animate-spin" /> Loading topic details…
        </div>
      ) : isError ? (
        <p className="text-text-muted py-4 text-sm">
          Couldn&apos;t load this topic right now — you can still continue and explore it later.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-text-secondary mb-1.5 flex items-center gap-2 text-sm font-bold">
              <RiLightbulbFlashLine className="text-brand-purple-500" /> Why learn this
            </p>
            <p className="text-text-primary text-sm leading-relaxed">
              {why || 'A core topic on the path toward your goal.'}
            </p>
          </div>

          <div>
            <p className="text-text-secondary mb-2 flex items-center gap-2 text-sm font-bold">
              <RiListCheck2 className="text-brand-purple-500" /> What you&apos;ll learn
            </p>
            {sections.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {sections.map((section) => (
                  <li
                    key={section._id}
                    className="text-text-secondary flex items-start gap-2 text-sm"
                  >
                    <span className="bg-brand-purple-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {section.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-sm">Lessons for this topic are coming soon.</p>
            )}
          </div>

          {data && data.estimatedHours > 0 && (
            <p className="text-text-muted border-border-soft border-t pt-3 text-xs">
              Estimated time · {data.estimatedHours} hrs
            </p>
          )}
        </div>
      )}
    </div>
  )
}
