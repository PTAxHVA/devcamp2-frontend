import type { IconType } from 'react-icons'
import { RiIdCardLine, RiLightbulbLine, RiTimeLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { CARD_HOVER, SHADOW_SOFT, WRAP } from '../lib/landing-styles'
import { SectionHead } from './section-head'
import { Reveal } from './reveal'

interface Feature {
  tag: string
  icon: IconType
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    tag: 'Verified',
    icon: RiIdCardLine,
    title: 'Verified Skill Passport',
    desc: 'A public, PII-free page of quiz-verified skills you can share with a link — proof employers can check, not a self-reported checklist.',
  },
  {
    tag: 'AI',
    icon: RiTimeLine,
    title: 'Job-Readiness Gap Analyzer',
    desc: "Pick a target role and see exactly which skills you've proven, which are in progress, and what's missing — with an estimate to close the gap.",
  },
  {
    tag: 'AI',
    icon: RiLightbulbLine,
    title: 'AI Mistake Coach',
    desc: 'Miss a quiz question? Get a clear explanation of why and what to review — grounded in the curated resources, never invented.',
  },
]

export const SignatureFeaturesSection = () => (
  <section id="features" className="scroll-mt-[84px] py-18 lg:py-24">
    <div className={WRAP}>
      <SectionHead
        center
        eyebrow="Built to stand out"
        title="More than another course list"
        lead="Signature features that turn learning into proof — and keep you moving when you're stuck."
      />
      <div className="mt-3 grid gap-5 min-[760px]:grid-cols-3">
        {FEATURES.map(({ tag, icon: Icon, title, desc }) => (
          <Reveal
            key={title}
            className={cn(
              'border-border-soft relative overflow-hidden rounded-[18px] border bg-white p-[26px]',
              SHADOW_SOFT,
              CARD_HOVER,
            )}
          >
            <span className="font-secondary text-brand-purple-600 border-brand-purple-300/50 absolute top-5 right-5 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] uppercase">
              {tag}
            </span>
            <span
              aria-hidden
              className="bg-bg-lavender text-brand-purple-600 mb-4 grid h-11 w-11 place-items-center rounded-xl"
            >
              <Icon className="h-[22px] w-[22px]" />
            </span>
            <h3 className="text-text-primary mb-2 text-[1.2rem] font-extrabold">{title}</h3>
            <p className="text-text-muted text-[0.9rem]">{desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)
