import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const matchReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches

/**
 * True when the user asked the OS to reduce motion, updating live if they toggle it.
 * The landing rail/reveal read this to render static (no scroll-driven animation).
 * Guards `matchMedia` so it stays safe under jsdom / SSR where it may be absent.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(matchReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
