import { Link } from 'react-router'
import { RiArrowRightLine, RiPlayFill } from 'react-icons/ri'
import { LuCode, LuShieldCheck, LuTarget } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { EYEBROW, WRAP } from '../lib/landing-styles'
import { HeroGlyphs } from './hero-glyphs'
import { Reveal } from './reveal'
import { RoadmapPreviewCard } from './roadmap-preview-card'

const TRUST = [
  { icon: LuTarget, title: 'Personalized for you', sub: 'Tuned to your goals & pace' },
  { icon: LuShieldCheck, title: 'Quiz-verified progress', sub: "Prove it, don't self-report" },
  { icon: LuCode, title: 'Real projects', sub: 'Build a portfolio as you go' },
]

export const HeroSection = () => (
  <section className="relative py-15 lg:py-24">
    <HeroGlyphs />
    <div
      className={cn(
        WRAP,
        'relative z-10 grid items-center gap-11 lg:grid-cols-[1.05fr_1fr] lg:gap-14',
      )}
    >
      <div className="flex flex-col gap-5">
        <span className={EYEBROW}>Verified learning, not guesswork</span>
        <h1 className="text-text-primary text-[clamp(2.5rem,1.7rem+2.9vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance">
          Build your verified web development roadmap
        </h1>
        <p className="text-text-secondary max-w-[46ch] text-[clamp(1rem,0.95rem+0.3vw,1.18rem)]">
          VORA creates a personalized roadmap from your goals, experience, and preferences. Learn
          step by step, practice with real projects, and prove every skill with quizzes as you go.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/signup" className="btn btn-primary px-7 font-semibold">
            Get Started <RiArrowRightLine aria-hidden className="h-[18px] w-[18px]" />
          </Link>
          <Link
            to="/demo-roadmap"
            className="btn border-border-purple text-brand-purple-700 hover:bg-bg-lavender hover:border-border-purple border-2 bg-white px-7 font-semibold"
          >
            <RiPlayFill aria-hidden className="h-[15px] w-[15px]" /> View Demo Roadmap
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 min-[560px]:max-[899px]:grid-cols-3 min-[1120px]:grid-cols-3">
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <span
                aria-hidden
                className="bg-bg-lavender text-brand-purple-600 grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px]"
              >
                <Icon className="h-[19px] w-[19px]" />
              </span>
              <div>
                <b className="text-text-primary block text-[0.94rem] leading-tight font-bold">
                  {title}
                </b>
                <small className="text-text-muted text-[0.82rem]">{sub}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Reveal>
        <RoadmapPreviewCard />
      </Reveal>
    </div>
  </section>
)
