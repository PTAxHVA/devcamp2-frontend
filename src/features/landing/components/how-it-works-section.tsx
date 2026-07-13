import type { ReactNode } from 'react'
import { LuBadgeCheck } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { WRAP } from '../lib/landing-styles'
import { SectionHead } from './section-head'
import { ScrollRoute } from './scroll-route'
import { Reveal } from './reveal'
import { QuizDonutFrame, ResourceListFrame, RoadmapPathFrame, WizardFrame } from './step-frames'

interface Step {
  num: string
  title: string
  desc: string
  frame: ReactNode
  /** On ≥820px, place the frame left and copy right (alternating zig-zag). */
  reversed: boolean
}

const STEPS: Step[] = [
  {
    num: 'Step 1',
    title: 'Answer questions',
    desc: 'Tell us your goals, experience, and preferences with a short questionnaire — it takes a minute.',
    frame: <WizardFrame />,
    reversed: false,
  },
  {
    num: 'Step 2',
    title: 'Get your roadmap',
    desc: 'VORA arranges curated topics into a clear, personalized path — and explains why it ordered them that way.',
    frame: <RoadmapPathFrame />,
    reversed: true,
  },
  {
    num: 'Step 3',
    title: 'Learn section by section',
    desc: 'Follow clear steps with curated resources and real projects, at your own pace.',
    frame: <ResourceListFrame />,
    reversed: false,
  },
  {
    num: 'Step 4',
    title: 'Pass quizzes to progress',
    desc: 'Test your knowledge to unlock the next section. Score ≥80% and the section is verified complete.',
    frame: <QuizDonutFrame />,
    reversed: true,
  },
]

const StepRow = ({ num, title, desc, frame, reversed }: Step) => (
  <div className="grid items-center gap-7 min-[820px]:grid-cols-2 min-[820px]:gap-11">
    <div className={cn(reversed && 'min-[820px]:order-2')}>
      <div className="font-secondary text-brand-purple-600 mb-2 text-[0.72rem] font-bold tracking-[0.16em] uppercase">
        {num}
      </div>
      <h3 className="text-text-primary mb-2 text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] font-extrabold">
        {title}
      </h3>
      <p className="text-text-muted max-w-[42ch] text-[0.96rem]">{desc}</p>
    </div>
    <div className={cn(reversed && 'min-[820px]:order-1')}>{frame}</div>
  </div>
)

export const HowItWorksSection = () => (
  <section
    id="how"
    className="border-border-soft bg-bg-section scroll-mt-[84px] border-y py-18 lg:py-24"
  >
    <div className={WRAP}>
      <SectionHead
        eyebrow="How it works"
        title="How to use VORA"
        lead="Get a personalized roadmap and start learning in four simple steps."
      />
      <div className="mt-10">
        <ScrollRoute
          itemsClassName="gap-16"
          items={STEPS.map((step) => (
            <StepRow key={step.num} {...step} />
          ))}
        />
      </div>

      <Reveal className="border-brand-purple-300/40 bg-bg-lavender mt-9 flex items-center gap-4 rounded-2xl border p-[22px]">
        <span
          aria-hidden
          className="text-brand-purple-600 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white"
        >
          <LuBadgeCheck className="h-[22px] w-[22px]" />
        </span>
        <div>
          <h3 className="text-text-primary mb-1 text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] font-extrabold">
            Verified &amp; ready to share
          </h3>
          {/* text-secondary (not muted) — this copy sits on lavender, where muted
              dips below AA contrast. */}
          <p className="text-text-secondary text-[0.9rem]">
            Complete a track and your proven skills become a public Skill Passport — a link that
            shows what you can actually do.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
)
