import { RiArrowRightLine } from 'react-icons/ri'

const FALLBACK_WHY = "This topic builds a core skill you'll use throughout the roadmap."

interface TopicWhyPanelSection {
  _id: string
  name: string
}

interface TopicWhyPanelProps {
  whyLearn: string
  description: string
  sections: TopicWhyPanelSection[]
  completedSections: number
  totalSections: number
  onContinue: () => void
}

/**
 * "Why learn this" + "What you'll learn" card (item J). The content list
 * scrolls inside its own frame with the progress/CTA footer pinned below it
 * — but only at `lg:` and up; on mobile the whole page scrolls normally.
 *
 * `whyLearn` is a curated field on MasterTopic (may be `''` if the topic
 * hasn't been reseeded yet) — degrade to the topic description, then a
 * generic line, so this section is never empty.
 */
export const TopicWhyPanel = ({
  whyLearn,
  description,
  sections,
  completedSections,
  totalSections,
  onContinue,
}: TopicWhyPanelProps) => {
  const whyText = whyLearn.trim() || description.trim() || FALLBACK_WHY

  return (
    <div className="border-border-soft bg-bg-card flex flex-col rounded-2xl border lg:max-h-120 lg:overflow-hidden">
      <div className="p-6 pb-3">
        <h3 className="text-text-primary font-semibold">Why learn this topic</h3>
      </div>

      <div className="min-h-0 space-y-4 px-6 pb-4 lg:overflow-y-auto">
        <p className="text-text-secondary leading-relaxed">{whyText}</p>

        <div>
          <h4 className="text-text-primary mb-2 text-sm font-semibold">
            What you&apos;ll learn ({totalSections} {totalSections === 1 ? 'section' : 'sections'})
          </h4>
          {totalSections > 0 ? (
            <ul className="space-y-1.5">
              {sections.map((sec) => (
                <li key={sec._id} className="text-text-secondary flex items-start gap-2 text-sm">
                  <span className="text-brand-purple-500 mt-0.5">▸</span>
                  <span>{sec.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-sm">Sections for this topic are coming soon.</p>
          )}
        </div>
      </div>

      <div className="border-border-soft bg-bg-card flex items-center justify-between gap-3 border-t p-4 lg:sticky lg:bottom-0">
        <span className="text-text-muted text-sm">
          {completedSections}/{totalSections} sections done
        </span>
        <button
          onClick={onContinue}
          className="focus-visible:ring-brand-purple-300 flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#0B1221] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800 focus-visible:ring-2 focus-visible:outline-none"
        >
          Continue topic <RiArrowRightLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
