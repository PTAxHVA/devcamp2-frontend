import { useEffect, useRef, useState, type ReactNode } from 'react'
import { RiCheckLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { railGeometry, railProgress } from '../lib/rail-progress'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'
import { Reveal } from './reveal'

interface ScrollRouteProps {
  /** Row contents in order; ScrollRoute renders the checkpoint + scroll-in fade for each. */
  items: ReactNode[]
  /** Spacing utilities for the items column (e.g. "gap-[22px]" or "gap-16"). */
  itemsClassName?: string
}

const CP_BASE =
  'absolute -left-[50px] top-[22px] z-[3] grid h-[34px] w-[34px] place-items-center rounded-full border-2 lg:-left-[68px]'
// Applied only when motion is allowed — under reduced-motion the rail is committed
// static (all checkpoints lit on the first paint), so the idle→lit color/shadow and
// the check fade must NOT transition.
const CP_TRANSITION = 'transition-[background-color,border-color,box-shadow] duration-[400ms]'
const CP_REACHED = 'border-brand-navy-900 bg-brand-navy-900 shadow-[0_0_0_5px_rgba(6,26,53,0.1)]'
const CP_IDLE = 'border-border-input bg-white'

/**
 * The living roadmap rail. A purple fill grows from the first checkpoint toward a
 * reference line as the section scrolls; each checkpoint lights exactly when the
 * fill reaches it (single source of truth — no separate observer, no floating
 * beacon). Fill height is written imperatively per rAF frame (smooth, no re-render);
 * the reached vector is React state that only changes at the few threshold crossings.
 * Under reduced-motion the rail renders static (filled + all checkpoints lit).
 */
export const ScrollRoute = ({ items, itemsClassName = 'gap-[22px]' }: ScrollRouteProps) => {
  const reduced = usePrefersReducedMotion()
  const routeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const cpRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [reached, setReached] = useState<boolean[]>(() => items.map(() => false))

  useEffect(() => {
    const route = routeRef.current
    if (!route) return

    let disposed = false
    let rafId = 0
    let centers: number[] = []

    const readCenters = (): number[] => {
      const routeTop = route.getBoundingClientRect().top
      return cpRefs.current.slice(0, items.length).map((cp) => {
        if (!cp) return 0
        const box = cp.getBoundingClientRect()
        return box.top - routeTop + box.height / 2
      })
    }

    // Static geometry: position the track/fill and clamp them to [first … last].
    const paintGeometry = () => {
      const geom = railGeometry(centers)
      if (trackRef.current) {
        trackRef.current.style.top = `${geom.first}px`
        trackRef.current.style.height = `${geom.span}px`
      }
      if (fillRef.current) fillRef.current.style.top = `${geom.first}px`
    }

    // Per-frame: grow the fill and light the checkpoints it has passed.
    const paint = () => {
      const routeTop = route.getBoundingClientRect().top
      const progress = railProgress(centers, routeTop, window.innerHeight)
      if (fillRef.current) fillRef.current.style.height = `${progress.fillHeight}px`
      setReached((prev) =>
        prev.length === progress.reached.length && prev.every((v, i) => v === progress.reached[i])
          ? prev
          : progress.reached,
      )
    }

    const remeasure = () => {
      if (disposed) return
      centers = readCenters()
      paintGeometry()
      paint()
    }

    remeasure()

    if (reduced) {
      // Static rail: fill the whole span, light every checkpoint, attach nothing.
      if (fillRef.current) fillRef.current.style.height = `${railGeometry(centers).span}px`
      setReached(centers.map(() => true))
      return
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        if (!disposed) paint()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure)
    // Re-measure on any content reflow (font swap, text re-wrap) even without a
    // window resize, so the fill/checkpoint sync never drifts.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => remeasure()) : null
    ro?.observe(route)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(remeasure)
    }

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
      ro?.disconnect()
    }
  }, [reduced, items.length])

  return (
    <div ref={routeRef} className="relative">
      {/* Dashed track — top/height set from measured checkpoint geometry. */}
      <div
        ref={trackRef}
        aria-hidden
        className="border-border-input absolute left-[18px] w-0 border-l-2 border-dashed opacity-75 lg:left-6"
      />
      {/* Purple fill — grows from the first checkpoint on scroll (height set per frame). */}
      <div
        ref={fillRef}
        aria-hidden
        className="from-brand-purple-500 to-brand-purple-700 absolute left-[18px] z-[1] w-0.5 rounded-sm bg-linear-to-b lg:left-6"
      />
      <div className={cn('relative z-[1] flex flex-col pl-13 lg:pl-19', itemsClassName)}>
        {items.map((item, index) => (
          <div key={index} className="relative">
            <span
              ref={(el) => {
                cpRefs.current[index] = el
              }}
              aria-hidden
              className={cn(
                CP_BASE,
                !reduced && CP_TRANSITION,
                reached[index] ? CP_REACHED : CP_IDLE,
              )}
            >
              <RiCheckLine
                aria-hidden
                className={cn(
                  'h-[15px] w-[15px] text-white',
                  !reduced && 'transition-opacity duration-300',
                  reached[index] ? 'opacity-100' : 'opacity-0',
                )}
              />
            </span>
            <Reveal noTranslate>{item}</Reveal>
          </div>
        ))}
      </div>
    </div>
  )
}
