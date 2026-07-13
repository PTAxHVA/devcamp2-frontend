import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'
import { REVEAL_TRANSITION } from '../lib/landing-styles'

interface RevealProps {
  children: ReactNode
  className?: string
  /**
   * Fade only, no upward slide. Used for cards INSIDE the living rail so the
   * checkpoint dot centers don't shift after the rail geometry is measured —
   * keeping the fill/checkpoint sync pixel-exact.
   */
  noTranslate?: boolean
}

/**
 * Scroll-in reveal: fades (and lifts) content when it enters the viewport.
 * `shown` is DERIVED — it's true whenever we can't/shouldn't animate (reduced-motion
 * or no IntersectionObserver) so content is NEVER stuck hidden, and flips true once
 * the element is observed. The only state write is the IO callback (event-driven).
 */
export const Reveal = ({ children, className = '', noTranslate = false }: RevealProps) => {
  const reduced = usePrefersReducedMotion()
  const canObserve = typeof IntersectionObserver !== 'undefined'
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const shown = reduced || !canObserve || revealed

  useEffect(() => {
    if (reduced || !canObserve) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, canObserve])

  const hiddenState = noTranslate ? 'opacity-0' : 'translate-y-6 opacity-0'

  return (
    <div
      ref={ref}
      className={cn(
        !reduced && REVEAL_TRANSITION,
        shown ? 'translate-y-0 opacity-100' : hiddenState,
        className,
      )}
    >
      {children}
    </div>
  )
}
