import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { RiFileList2Line, RiPlayCircleLine, RiStarLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { SHADOW_CARD } from '../lib/landing-styles'
import { useInView } from '../lib/use-in-view'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'

/** Fade + rise wrapper for a list row; `index` staggers the entry when `show` flips. */
const Stagger = ({
  show,
  reduced,
  index,
  className,
  children,
}: {
  show: boolean
  reduced: boolean
  index: number
  className?: string
  children: ReactNode
}) => (
  <div
    className={cn(
      !reduced && 'transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
      show || reduced ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      className,
    )}
    style={reduced ? undefined : { transitionDelay: `${index * 90}ms` }}
  >
    {children}
  </div>
)

/** Browser-window chrome (traffic lights + url bar) wrapping a step's mock UI. */
const BrowserFrame = ({ children }: { children: ReactNode }) => (
  <div
    className={cn('border-border-soft overflow-hidden rounded-[14px] border bg-white', SHADOW_CARD)}
  >
    <div
      aria-hidden
      className="border-border-soft bg-bg-section flex items-center gap-2 border-b px-3 py-[9px]"
    >
      <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      <span className="border-border-soft ml-1.5 h-4 flex-1 rounded-[5px] border bg-white" />
    </div>
    <div className="p-[18px]">{children}</div>
  </div>
)

const MockOption = ({ selected, children }: { selected?: boolean; children: ReactNode }) => (
  <div
    className={cn(
      'mb-2 flex items-center gap-2.5 rounded-[10px] border px-3 py-[9px] text-[0.85rem]',
      selected
        ? 'border-brand-purple-400 bg-bg-lavender'
        : 'border-border-soft text-text-secondary',
    )}
  >
    <span
      aria-hidden
      className={cn(
        'h-4 w-4 shrink-0 rounded-full border-2',
        selected
          ? 'border-brand-purple-500 shadow-[inset_0_0_0_3px_#fff,inset_0_0_0_5px_#7c3aed]'
          : 'border-border-input',
      )}
    />
    {children}
  </div>
)

const HNode = ({ variant, children }: { variant?: 'done' | 'cur'; children: ReactNode }) => (
  <span
    className={cn(
      'rounded-[9px] border-[1.5px] px-2.5 py-[7px] text-[0.72rem] font-bold',
      variant === 'done' && 'border-brand-navy-900 bg-brand-navy-900 text-white',
      variant === 'cur' && 'border-brand-purple-500 bg-bg-lavender text-brand-purple-700',
      !variant && 'border-border-input text-text-muted bg-white',
    )}
  >
    {children}
  </span>
)

const Arrow = () => (
  <span aria-hidden className="text-border-input font-bold">
    →
  </span>
)

const Resource = ({ icon: Icon, title, meta }: { icon: IconType; title: string; meta: string }) => (
  <div className="border-border-soft mb-2 flex items-center gap-2.5 rounded-[10px] border px-3 py-[9px]">
    <span
      aria-hidden
      className="bg-bg-lavender text-brand-purple-600 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
    >
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <b className="text-text-primary block text-[0.84rem]">{title}</b>
      <small className="text-text-muted text-[0.72rem]">{meta}</small>
    </div>
  </div>
)

const WIZARD_OPTIONS = ['Frontend Developer', 'Backend Developer', 'Full-stack Developer']

export const WizardFrame = () => {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <BrowserFrame>
      <div ref={ref}>
        <div className="text-text-primary mb-3 text-[0.86rem] font-bold">
          What role are you aiming for?
        </div>
        {WIZARD_OPTIONS.map((option, index) => (
          <Stagger key={option} show={inView} reduced={reduced} index={index}>
            <MockOption selected={index === 0}>{option}</MockOption>
          </Stagger>
        ))}
        <div className="bg-bg-section mt-3 h-1.5 overflow-hidden rounded-md">
          {/* Progress fills from 0 → 40% the first time the frame scrolls in. */}
          <div
            className={cn(
              'bg-brand-purple-500 h-full rounded-md',
              !reduced && 'transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            )}
            style={{ width: inView || reduced ? '40%' : '0%', transitionDelay: '260ms' }}
          />
        </div>
        <div className="text-text-muted mt-2 text-[0.72rem]">Step 2 of 5</div>
      </div>
    </BrowserFrame>
  )
}

type PathItem = { kind: 'node'; label: string; variant?: 'done' | 'cur' } | { kind: 'arrow' }

const ROADMAP_PATH: PathItem[] = [
  { kind: 'node', label: 'HTML', variant: 'done' },
  { kind: 'arrow' },
  { kind: 'node', label: 'CSS', variant: 'done' },
  { kind: 'arrow' },
  { kind: 'node', label: 'JavaScript', variant: 'cur' },
  { kind: 'arrow' },
  { kind: 'node', label: 'React' },
  { kind: 'arrow' },
  { kind: 'node', label: 'Project' },
]

export const RoadmapPathFrame = () => {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const show = inView || reduced
  return (
    <BrowserFrame>
      <div ref={ref} className="flex flex-wrap items-center gap-2">
        {ROADMAP_PATH.map((item, index) => (
          <span
            key={index}
            className={cn(
              'inline-flex origin-center',
              !reduced &&
                'transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
              show ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
            )}
            style={reduced ? undefined : { transitionDelay: `${index * 80}ms` }}
          >
            {item.kind === 'arrow' ? <Arrow /> : <HNode variant={item.variant}>{item.label}</HNode>}
          </span>
        ))}
      </div>
      <div className="text-text-muted mt-3.5 text-[0.72rem]">
        Personalized order · 6 topics · ~48 hrs
      </div>
    </BrowserFrame>
  )
}

const RESOURCES = [
  { icon: RiFileList2Line, title: 'MDN — Array methods', meta: 'Documentation · 15 min' },
  { icon: RiPlayCircleLine, title: 'freeCodeCamp — JS Basics', meta: 'Video · 22 min' },
  { icon: RiStarLine, title: 'Practice — Build a to-do app', meta: 'Project · ~2 hrs' },
]

export const ResourceListFrame = () => {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <BrowserFrame>
      <div ref={ref}>
        {RESOURCES.map((resource, index) => (
          <Stagger key={resource.title} show={inView} reduced={reduced} index={index}>
            <Resource {...resource} />
          </Stagger>
        ))}
      </div>
    </BrowserFrame>
  )
}

const QUIZ_PCT = 80
const DONUT_R = 15.5
const DONUT_CIRC = 2 * Math.PI * DONUT_R

/**
 * Score donut that draws its purple arc from 0 → 80% while the percentage counts
 * up in lockstep, the first time it scrolls into view. A single rAF drives both so
 * the ring and the number always land together. Under reduced-motion it renders the
 * final ring + figure immediately (no sweep, no scale-in).
 */
const QuizDonut = () => {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(reduced ? QUIZ_PCT : 0)
  // Start active when the browser can't observe, so the figure is never stuck at 0.
  const [active, setActive] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (typeof IntersectionObserver === 'undefined' || !el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    if (reduced) {
      const snap = requestAnimationFrame(() => setPct(QUIZ_PCT))
      return () => cancelAnimationFrame(snap)
    }
    let raf = 0
    const duration = 1100
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setPct(eased * QUIZ_PCT)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced])

  const dash = (DONUT_CIRC * pct) / 100

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-24 w-24 shrink-0',
        !reduced && 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        active || reduced ? 'scale-100' : 'scale-90',
      )}
    >
      <svg viewBox="0 0 36 36" className="h-24 w-24" aria-hidden>
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ebe4ff" strokeWidth="3.4" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${DONUT_CIRC}`}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="text-text-primary absolute inset-0 grid place-items-center text-[1.3rem] font-extrabold tabular-nums">
        {Math.round(pct)}%
      </span>
    </div>
  )
}

export const QuizDonutFrame = () => (
  <BrowserFrame>
    <div className="flex flex-wrap items-center gap-[18px]">
      <QuizDonut />
      <div className="min-w-0 flex-1">
        <span className="font-secondary bg-bg-lavender text-brand-purple-700 mb-2 inline-block rounded-[7px] px-2.5 py-1 text-[0.66rem] font-bold tracking-[0.08em] uppercase">
          Passed · 4 / 5 correct
        </span>
        <b className="text-text-primary block text-[1rem]">JavaScript quiz cleared</b>
        <small className="text-text-muted text-[0.85rem]">
          Section verified — React is now unlocked.
        </small>
      </div>
    </div>
  </BrowserFrame>
)
