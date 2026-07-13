import type { IconType } from 'react-icons'
import { RiRocketLine, RiShieldCheckLine, RiTeamLine } from 'react-icons/ri'
import { Link } from 'react-router'
import { VoraWordmark } from '@/components/ui/vora-logo'
import { WRAP } from '../lib/landing-styles'

interface FooterValue {
  icon: IconType
  title: string
  sub: string
}

const VALUES: FooterValue[] = [
  { icon: RiTeamLine, title: 'Tailored for You', sub: 'Your unique learning path' },
  { icon: RiShieldCheckLine, title: 'Curated Resources', sub: 'High-quality, modern tutorials' },
  { icon: RiRocketLine, title: 'Project-Driven', sub: 'Learn by building real apps' },
]

const linkClass =
  'text-text-muted hover:text-brand-purple-700 block py-1 text-[0.9rem] transition-colors'

export const Footer = () => (
  <footer className="border-border-soft mt-2 border-t bg-white pt-11 pb-7">
    <div className={WRAP}>
      <div className="border-border-soft flex flex-col items-start gap-6 border-b pb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-14 sm:gap-y-5">
        {VALUES.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span
              aria-hidden
              className="bg-bg-lavender text-brand-purple-600 grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            >
              <Icon className="h-[22px] w-[22px]" />
            </span>
            <div>
              <b className="text-text-primary block text-[0.98rem] leading-tight font-bold">
                {title}
              </b>
              <small className="text-text-muted text-[0.82rem]">{sub}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-7 py-8 min-[720px]:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="VORA home">
            <VoraWordmark />
          </Link>
          <p className="text-text-muted mt-2.5 max-w-[34ch] text-[0.88rem]">
            Verified Online Roadmap Advisor — a curated, quiz-verified path from beginner to
            job-ready web developer.
          </p>
        </div>
        <div>
          <h4 className="font-secondary text-text-secondary mb-3.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase">
            Product
          </h4>
          <Link to="/roadmaps" className={linkClass}>
            Browse roadmaps
          </Link>
          <Link to="/demo-roadmap" className={linkClass}>
            View demo
          </Link>
          <Link to="/signup" className={linkClass}>
            Sign up
          </Link>
        </div>
        <div>
          <h4 className="font-secondary text-text-secondary mb-3.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase">
            Legal
          </h4>
          <Link to="/terms" className={linkClass}>
            Terms
          </Link>
          <Link to="/privacy" className={linkClass}>
            Privacy
          </Link>
          <a
            href="https://github.com/PTAxHVA"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="border-border-soft text-text-muted border-t pt-5 text-center text-[0.82rem]">
        © 2026 VORA. All rights reserved.
      </div>
    </div>
  </footer>
)
