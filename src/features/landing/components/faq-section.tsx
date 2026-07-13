import { useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { WRAP } from '../lib/landing-styles'
import { SectionHead } from './section-head'

const FAQS = [
  {
    q: 'Is VORA free?',
    a: 'Yes — VORA is free to use for the core experience: build a roadmap, learn from curated resources, and verify your progress with quizzes.',
  },
  {
    q: 'Are the roadmaps AI-generated?',
    a: 'No. Roadmaps and resources are hand-curated by the team. AI only assists — it personalizes the order of curated topics and gives feedback on your edits. It never invents topics or content.',
  },
  {
    q: 'How is progress tracked?',
    a: 'By proof, not self-report. A section is only marked complete when you pass its quiz with at least 80%. Your streak and dashboard reflect real, verified work.',
  },
  {
    q: 'Which roles are covered?',
    a: 'Frontend and Backend web development, with branch choices like your framework and database. You can enroll in more than one role and add another anytime.',
  },
]

export const FaqSection = () => {
  // Single-open accordion; first question open by default, −1 = all closed.
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section
      id="faq"
      className="border-border-soft bg-bg-section scroll-mt-[84px] border-y py-18 lg:py-24"
    >
      <div className={WRAP}>
        <SectionHead center eyebrow="Common questions" title="Frequently asked" />
        <div className="mx-auto mt-6 max-w-[760px]">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `landing-faq-panel-${index}`
            return (
              <div
                key={item.q}
                className="border-border-soft mb-3 overflow-hidden rounded-[14px] border bg-white"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="text-text-primary flex w-full items-center justify-between gap-4 px-5 py-[18px] text-left text-[1.02rem] font-bold"
                  >
                    {item.q}
                    <span
                      aria-hidden
                      className={cn(
                        'bg-bg-lavender text-brand-purple-600 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full transition-transform duration-200 motion-reduce:transition-none',
                        isOpen && 'rotate-45',
                      )}
                    >
                      <RiAddLine className="h-[18px] w-[18px]" />
                    </span>
                  </button>
                </h3>
                {/* grid-rows 0fr↔1fr height animation: no JS measurement, never clips
                    on resize / late-font reflow. */}
                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-text-muted px-5 pb-[18px] text-[0.94rem]">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
