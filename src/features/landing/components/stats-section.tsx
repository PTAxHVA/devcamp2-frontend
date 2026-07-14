import { useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { LuBadgeCheck, LuListChecks, LuRoute, LuTarget } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { WRAP } from '../lib/landing-styles'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'

interface Stat {
  icon: IconType
  /** Non-numeric lead-in kept out of the count-up (e.g. "~", "≥"). */
  prefix?: string
  value: number
  suffix?: string
  label: string
}

const STATS: Stat[] = [
  { icon: LuRoute, value: 2, label: 'Curated roadmaps' },
  { icon: LuListChecks, prefix: '~', value: 900, label: 'Quiz questions' },
  { icon: LuTarget, prefix: '≥', value: 80, suffix: '%', label: 'To pass a section' },
  { icon: LuBadgeCheck, value: 100, suffix: '%', label: 'Human-curated content' },
]

/**
 * Count a number up to `target` once `active` flips true, easing out over ~1.2s.
 * Returns `target` immediately under reduced-motion or before activation-with-reduce,
 * so the figure is never stuck at zero.
 */
const useCountUp = (target: number, active: boolean, reduced: boolean) => {
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!active) return
    if (reduced) {
      // Snap to the final figure via rAF (not a synchronous effect write) so no
      // count-up runs, but the number is never left at 0.
      const snap = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(snap)
    }
    let raf = 0
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced, target])

  return value
}
const StatCard = ({
  icon: Icon,
  prefix,
  value,
  suffix,
  label,
  active,
  reduced,
}: Stat & {
  active: boolean
  reduced: boolean
}) => {
  const shown = useCountUp(value, active, reduced)
  return (
    <div className="border-border-soft bg-bg-soft hover:border-brand-purple-500/20 flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 text-center shadow-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-2 hover:shadow-[0_16px_34px_-24px_rgba(6,26,53,0.35)] sm:px-4">
      <span
        aria-hidden
        className="bg-bg-lavender text-brand-purple-600 grid h-11 w-11 place-items-center rounded-xl"
      >
        <Icon className="h-[22px] w-[22px]" />
      </span>
      <b className="text-text-primary block text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
        {prefix}
        {shown}
        {suffix}
      </b>
      <span className="text-text-muted text-[0.82rem] leading-snug font-medium">{label}</span>
    </div>
  )
}

export const StatsSection = () => {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // Start active when the browser can't observe, so figures are never stuck at 0.
  const [active, setActive] = useState(() => typeof IntersectionObserver === 'undefined')

  // Kick the count-up when the band scrolls into view.
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
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="bg-white">
      <div
        ref={ref}
        className={cn(
          WRAP,
          'grid grid-cols-2 gap-3 py-8 min-[720px]:grid-cols-4 min-[720px]:gap-4',
        )}
      >
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} active={active} reduced={reduced} />
        ))}
      </div>
    </section>
  )
}
