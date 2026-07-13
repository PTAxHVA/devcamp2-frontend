import type { IconType } from 'react-icons'
import {
  RiArrowUpLine,
  RiGithubFill,
  RiRocketLine,
  RiShieldCheckLine,
  RiTeamLine,
} from 'react-icons/ri'
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

interface FooterLink {
  label: string
  to: string
  external?: boolean
}

interface FooterColumn {
  heading: string
  links: FooterLink[]
}

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'View demo', to: '/demo-roadmap' },
      { label: 'Sign up', to: '/signup' },
      { label: 'Log in', to: '/login' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help & Support', to: '/support' },
      { label: 'GitHub', to: 'https://github.com/PTAxHVA', external: true },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
    ],
  },
]

const linkClass =
  'text-text-muted hover:text-brand-purple-700 group inline-flex w-fit items-center gap-1.5 py-1 text-[0.9rem] transition-colors'

const FooterNavLink = ({ label, to, external }: FooterLink) => {
  const inner = (
    <>
      <span
        aria-hidden
        className="bg-border-input group-hover:bg-brand-purple-500 h-1 w-1 rounded-full transition-colors"
      />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">{label}</span>
    </>
  )
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {inner}
    </a>
  ) : (
    <Link to={to} className={linkClass}>
      {inner}
    </Link>
  )
}

const scrollToTop = () =>
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })

export const Footer = () => (
  <footer className="border-border-soft relative mt-2 border-t bg-white pt-11 pb-7">
    {/* Purple hairline so the footer reads as a deliberate closing band. */}
    <div
      aria-hidden
      className="from-brand-purple-400/0 via-brand-purple-400/60 to-brand-purple-400/0 absolute inset-x-0 top-0 h-px bg-gradient-to-r"
    />
    <div className={WRAP}>
      <div className="border-border-soft grid gap-3 border-b pb-8 sm:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="border-border-soft/70 hover:border-brand-purple-300/60 hover:bg-bg-lavender/40 flex items-center gap-3 rounded-2xl border bg-white p-3.5 transition-colors duration-200"
          >
            <span
              aria-hidden
              className="bg-bg-lavender text-brand-purple-600 grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            >
              <Icon className="h-[22px] w-[22px]" />
            </span>
            <div className="min-w-0">
              <b className="text-text-primary block text-[0.98rem] leading-tight font-bold">
                {title}
              </b>
              <small className="text-text-muted text-[0.82rem]">{sub}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" aria-label="VORA home" className="inline-block">
            <VoraWordmark />
          </Link>
          <p className="text-text-muted mt-2.5 max-w-[38ch] text-[0.88rem]">
            Verified Online Roadmap Advisor — a curated, quiz-verified path from beginner to
            job-ready web developer.
          </p>
          <a
            href="https://github.com/PTAxHVA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="VORA on GitHub"
            className="border-border-soft text-text-secondary hover:border-brand-purple-300/70 hover:bg-bg-lavender hover:text-brand-purple-700 mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white transition-colors"
          >
            <RiGithubFill aria-hidden className="h-5 w-5" />
          </a>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="font-secondary text-text-secondary mb-3 text-[0.72rem] font-bold tracking-[0.08em] uppercase">
              {column.heading}
            </h3>
            <div className="flex flex-col gap-0.5">
              {column.links.map((link) => (
                <FooterNavLink key={link.label} {...link} />
              ))}
            </div>
          </nav>
        ))}
      </div>

      <div className="border-border-soft flex flex-col items-center justify-between gap-3 border-t pt-5 text-center sm:flex-row sm:text-left">
        <p className="text-text-muted text-[0.82rem]">© 2026 VORA. All rights reserved.</p>
        <button
          type="button"
          onClick={scrollToTop}
          className="text-text-muted hover:text-brand-purple-700 group inline-flex items-center gap-1.5 text-[0.82rem] font-semibold transition-colors"
        >
          Back to top
          <span
            aria-hidden
            className="border-border-soft group-hover:border-brand-purple-300/70 group-hover:bg-bg-lavender grid h-6 w-6 place-items-center rounded-full border transition-colors"
          >
            <RiArrowUpLine className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </div>
  </footer>
)
