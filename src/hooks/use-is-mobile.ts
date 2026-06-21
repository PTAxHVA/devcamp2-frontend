import { useEffect, useState } from 'react'

// Matches Tailwind's `md` breakpoint (mobile = below 768px).
const MOBILE_QUERY = '(max-width: 767px)'

/** Returns true on viewports narrower than the `md` breakpoint, updating on resize. */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
