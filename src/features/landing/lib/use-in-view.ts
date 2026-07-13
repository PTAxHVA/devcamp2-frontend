import { useEffect, useRef, useState } from 'react'

/**
 * One-shot "has this scrolled into view yet?" hook. Returns a ref to attach and a
 * boolean that flips true the first time the element enters the viewport, then stops
 * observing. Starts true when IntersectionObserver is unavailable (SSR / old engines)
 * so gated content is never left hidden. The threshold/rootMargin are primitives so
 * the effect deps stay stable across renders.
 */
export const useInView = <T extends Element>(threshold = 0.3, rootMargin = '0px') => {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (inView) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        })
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, inView])

  return [ref, inView] as const
}
