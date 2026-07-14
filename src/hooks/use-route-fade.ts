import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'

const ROUTE_FADE_CLASS = 'animate-route-fade'

/**
 * Re-plays a light opacity fade on the returned element every time the route path
 * changes — WITHOUT remounting the routed page (React keys stay untouched), so scroll
 * position, local component state and in-flight queries all survive navigation. Attach
 * the ref to a persistent shell element (e.g. the layout's <main>), not to the routed
 * content itself.
 *
 * Reduced-motion is handled by the global CSS reset in index.css (animation durations
 * collapse to ~0), so the fade simply becomes imperceptible for those users.
 */
export function useRouteFade<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // Remove → force reflow → re-add so the CSS animation restarts on every route
    // change (re-assigning the same class alone would not re-trigger it).
    el.classList.remove(ROUTE_FADE_CLASS)
    void el.offsetWidth
    el.classList.add(ROUTE_FADE_CLASS)
  }, [pathname])

  return ref
}
