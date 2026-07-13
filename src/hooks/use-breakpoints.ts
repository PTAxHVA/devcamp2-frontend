import { useEffect, useState } from 'react'
import { useIsMobile } from './use-is-mobile'

export const useBreakpoints = () => {
  const isMobile = useIsMobile()
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia('(min-width: 1280px)')
    const onChange = () => setIsDesktop(mql.matches)

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Tablet is any viewport between mobile (max 767px) and desktop (min 1280px).
  // This avoids the sub-pixel gap between independent matchMedia queries.
  const isTablet = !isMobile && !isDesktop

  return { isMobile, isTablet, isDesktop }
}
