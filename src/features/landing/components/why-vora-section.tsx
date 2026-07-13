import type { IconType } from 'react-icons'
import { LuBadgeCheck, LuBookOpen, LuShieldCheck, LuUserRound } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { CARD_HOVER, SHADOW_SOFT, WRAP } from '../lib/landing-styles'
import { SectionHead } from './section-head'
import { ScrollRoute } from './scroll-route'

interface Benefit {
  icon: IconType
  title: string
  desc: string
}

const BENEFITS: Benefit[] = [
  {
    icon: LuShieldCheck,
    title: 'Quiz-verified progress',
    desc: 'A section only completes when you pass its quiz (≥80%). Progress you can trust — and prove.',
  },
  {
    icon: LuBookOpen,
    title: 'Human-curated content',
    desc: 'Roadmaps and resources are hand-picked by the team — MDN, freeCodeCamp, quality tutorials — never auto-generated filler.',
  },
  {
    icon: LuUserRound,
    title: 'Personalized to your role & pace',
    desc: 'A short questionnaire shapes the order and depth of your roadmap around the role you want and the time you have.',
  },
  {
    icon: LuBadgeCheck,
    title: 'Shareable Skill Passport',
    desc: 'Finish a track and your proven skills become a public, verifiable passport you can share with a link.',
  },
]

const BenefitCard = ({ icon: Icon, title, desc }: Benefit) => (
  <div
    className={cn(
      'border-border-soft flex items-start gap-4 rounded-2xl border bg-white p-[22px]',
      SHADOW_SOFT,
      CARD_HOVER,
    )}
  >
    <span
      aria-hidden
      className="bg-bg-lavender text-brand-purple-600 grid h-11 w-11 shrink-0 place-items-center rounded-xl"
    >
      <Icon className="h-[22px] w-[22px]" />
    </span>
    <div>
      <h3 className="text-text-primary mb-1.5 text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] font-extrabold">
        {title}
      </h3>
      <p className="text-text-muted text-[0.92rem]">{desc}</p>
    </div>
  </div>
)

export const WhyVoraSection = () => (
  <section id="why" className="scroll-mt-[84px] py-18 lg:py-24">
    <div className={WRAP}>
      <SectionHead
        eyebrow="The VORA difference"
        title="Why VORA"
        lead="A learning experience built on proof, curation, and personalization — so every step forward is real, not just checked off."
      />
      <div className="mt-10">
        <ScrollRoute
          items={BENEFITS.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        />
      </div>
    </div>
  </section>
)
