import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'

// Decorative floating tech words + soft aurora behind the hero. Everything lives in
// one inset-0 overflow-hidden layer so nothing can bleed past the hero and open a
// horizontal-scroll strip (the NEW-3 regression). Glyphs hide below 640px.
const GLYPHS = [
  { label: 'React', position: 'top-[14%] left-[6%]', anim: 'animate-float' },
  { label: 'CSS', position: 'top-[66%] left-[10%]', anim: 'animate-float-slow' },
  { label: 'Node.js', position: 'top-[20%] right-[8%]', anim: 'animate-float-delayed' },
  { label: 'SQL', position: 'top-[72%] right-[12%]', anim: 'animate-float-slow' },
  { label: 'HTML', position: 'top-[40%] right-[26%]', anim: 'animate-float-delayed' },
]

export const HeroGlyphs = () => {
  // Drive the animation from JS: the `.animate-float*` classes live in index.css
  // AFTER Tailwind's output, so a `motion-reduce:animate-none` utility can't reliably
  // override them by cascade order. Withholding the class entirely is bulletproof.
  const reduced = usePrefersReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[min(920px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.28),transparent)] opacity-60 blur-[60px]" />
      {GLYPHS.map((glyph) => (
        <span
          key={glyph.label}
          className={cn(
            'font-secondary text-brand-purple-400 absolute hidden text-[0.8rem] font-bold tracking-[0.05em] opacity-[0.16] sm:block',
            !reduced && glyph.anim,
            glyph.position,
          )}
        >
          {glyph.label}
        </span>
      ))}
    </div>
  )
}
