import { Link } from 'react-router'
import { RiArrowRightLine } from 'react-icons/ri'
import { EYEBROW, WRAP } from '../lib/landing-styles'
import { Reveal } from './reveal'

export const CtaBand = () => (
  <section className="py-18 lg:py-24">
    <div className={WRAP}>
      <Reveal className="border-brand-purple-300/40 flex flex-col items-center gap-4 rounded-[26px] border bg-[linear-gradient(180deg,#f7f4ff,#f4f0ff)] px-7 py-12 text-center sm:p-[60px]">
        <span className={EYEBROW}>Start today</span>
        <h2 className="text-text-primary text-[clamp(1.9rem,1.35rem+1.9vw,2.75rem)] font-extrabold tracking-[-0.02em] text-balance">
          Start your verified roadmap today
        </h2>
        <p className="text-text-secondary max-w-[48ch] text-[clamp(1rem,0.95rem+0.3vw,1.18rem)]">
          Answer a few questions, get a roadmap built for you, and prove every skill as you go.
        </p>
        <Link to="/signup" className="btn btn-primary group px-7 font-semibold">
          Get Started
          <RiArrowRightLine
            aria-hidden
            className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </Link>
      </Reveal>
    </div>
  </section>
)
