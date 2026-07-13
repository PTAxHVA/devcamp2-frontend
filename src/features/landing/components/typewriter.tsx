import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'

interface TypewriterProps {
  text: string
  /** Applied to the wrapper so the caller keeps full control of typography. */
  className?: string
  /** Milliseconds between characters. */
  speed?: number
  /** Delay before the first character appears. */
  startDelay?: number
}

/**
 * Types `text` out one character at a time with a caret parked at the end that
 * blinks once typing settles. Under reduced-motion it renders the full string with
 * a steady caret (no typing). The complete text is exposed to assistive tech via
 * aria-label while the animated glyphs are aria-hidden, so a screen reader never
 * reads a half-typed word.
 */
export const Typewriter = ({ text, className, speed = 55, startDelay = 300 }: TypewriterProps) => {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(reduced ? text.length : 0)

  useEffect(() => {
    if (reduced) {
      // Snap to the full text via rAF — never a synchronous write inside the effect.
      const raf = requestAnimationFrame(() => setCount(text.length))
      return () => cancelAnimationFrame(raf)
    }
    // Walk a local index and write it from timer callbacks (not synchronously), so
    // the count climbs 0 → text.length one character per `speed`.
    let i = 0
    let timer = 0
    const step = () => {
      i += 1
      setCount(i)
      if (i < text.length) timer = window.setTimeout(step, speed)
    }
    timer = window.setTimeout(step, startDelay)
    return () => clearTimeout(timer)
  }, [text, speed, startDelay, reduced])

  const done = count >= text.length

  return (
    <span className={className}>
      {/* Full text for assistive tech; the typed glyphs + caret below are decorative
          (aria-label on a role-less span isn't reliably announced). */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, count)}</span>
      <span
        aria-hidden
        className={cn(
          // Nudge the caret down slightly so it sits centered on the text baseline.
          'ml-0.5 inline-block h-[1.3em] w-0.5 translate-y-[0.15em] bg-current align-baseline',
          done && !reduced && 'animate-caret',
        )}
      />
    </span>
  )
}
