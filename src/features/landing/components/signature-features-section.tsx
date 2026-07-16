import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { IconType } from 'react-icons'
import { RiIdCardLine, RiLightbulbLine, RiPauseLine, RiPlayLine, RiTimeLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { CARD_HOVER, SHADOW_SOFT, WRAP } from '../lib/landing-styles'
import { wrapOffset } from '../lib/marquee-drag'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'
import { SectionHead } from './section-head'

interface Feature {
  tag: string
  icon: IconType
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    tag: 'Verified',
    icon: RiIdCardLine,
    title: 'Verified Skill Passport',
    desc: 'A public, PII-free page of quiz-verified skills you can share with a link — proof employers can check, not a self-reported checklist.',
  },
  {
    tag: 'AI',
    icon: RiTimeLine,
    title: 'Job-Readiness Gap Analyzer',
    desc: "Pick a target role and see exactly which skills you've proven, which are in progress, and what's missing — with an estimate to close the gap.",
  },
  {
    tag: 'AI',
    icon: RiLightbulbLine,
    title: 'AI Mistake Coach',
    desc: 'Miss a quiz question? Get a clear explanation of why and what to review — grounded in the curated resources, never invented.',
  },
]

const FeatureCard = ({ tag, icon: Icon, title, desc }: Feature) => (
  <article
    className={cn(
      'border-border-soft relative h-full overflow-hidden rounded-[18px] border bg-white p-[26px]',
      SHADOW_SOFT,
      CARD_HOVER,
    )}
  >
    <span className="font-secondary text-brand-purple-600 border-brand-purple-300/50 absolute top-5 right-5 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] uppercase">
      {tag}
    </span>
    <span
      aria-hidden
      className="bg-bg-lavender text-brand-purple-600 mb-4 grid h-11 w-11 place-items-center rounded-xl"
    >
      <Icon className="h-[22px] w-[22px]" />
    </span>
    <h3 className="text-text-primary mb-2 text-[1.2rem] font-extrabold">{title}</h3>
    <p className="text-text-muted text-[0.9rem]">{desc}</p>
  </article>
)

/**
 * Signature-features cards. With motion allowed they scroll in a seamless, endlessly
 * looping marquee; under reduced-motion the section falls back to a static 3-up grid so
 * every card stays fully readable and reachable. The marquee pauses on hover AND via a
 * keyboard/touch-accessible Pause/Play control (WCAG 2.2.2).
 */
export const SignatureFeaturesSection = () => {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = useState(false)

  // Click-and-drag scroll: dragging hands control to a manual translateX (written
  // straight to the DOM via ref, not React state, so a fast drag never re-renders).
  // The two rendered FEATURES sets are identical, so wrapping the offset by one set's
  // width keeps the drag feeling infinite in both directions, same trick the CSS loop
  // uses at -50%. Releasing the drag leaves it paused; the Play button hands control
  // back to the CSS animation (restarting the drift from 0 — a deliberate, acceptable
  // jump rather than trying to splice a manual offset into a keyframe animation).
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const dragRef = useRef<{ startX: number; startOffset: number; setWidth: number } | null>(null)
  const [manualDrag, setManualDrag] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track || e.button === 2) return
    const setWidth = track.scrollWidth / 2
    // Grab wherever the CSS drift actually is right now (not offsetRef, which only
    // tracks manual drags) so taking over from a running loop doesn't snap to 0 first.
    const computed = getComputedStyle(track).transform
    const currentX = computed && computed !== 'none' ? new DOMMatrixReadOnly(computed).m41 : 0
    offsetRef.current = currentX
    track.style.transform = `translateX(${currentX}px)`
    dragRef.current = { startX: e.clientX, startOffset: currentX, setWidth }
    setIsDragging(true)
    setManualDrag(true)
    setPaused(true)
    track.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return
    const next = wrapOffset(drag.startOffset + (e.clientX - drag.startX), drag.setWidth)
    offsetRef.current = next
    track.style.transform = `translateX(${next}px)`
  }

  const endDrag = () => {
    dragRef.current = null
    setIsDragging(false)
  }

  const togglePlay = () => {
    if (paused) {
      setManualDrag(false)
      offsetRef.current = 0
      if (trackRef.current) trackRef.current.style.transform = ''
      setPaused(false)
    } else {
      setPaused(true)
    }
  }

  return (
    <section id="features" className="scroll-mt-[84px] py-18 lg:py-24">
      <div className={WRAP}>
        <SectionHead
          center
          eyebrow="Built to stand out"
          title="More than another course list"
          lead="Signature features that turn learning into proof — and keep you moving when you're stuck."
        />

        {reduced ? (
          <div className="mt-3 grid gap-5 min-[760px]:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <div className="marquee-mask overflow-hidden">
              {/*
                Two identical sets: the first is the accessible content, the second is
                aria-hidden and exists only so the -50% loop lands exactly on the copy.
                Each card owns its trailing gap (mr-5) so the wrap-around has no jump.
                The same duplication lets a manual drag wrap seamlessly (see wrapOffset).
              */}
              <div
                ref={trackRef}
                className={cn(
                  'flex w-max touch-pan-y select-none [-webkit-user-drag:none]',
                  !manualDrag && 'animate-marquee',
                  paused && !manualDrag && 'is-paused',
                  isDragging ? 'cursor-grabbing' : 'cursor-grab',
                )}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onDragStart={(e) => e.preventDefault()}
              >
                {[...FEATURES, ...FEATURES].map((feature, index) => (
                  <div
                    key={`${feature.title}-${index}`}
                    aria-hidden={index >= FEATURES.length}
                    className="mr-5 w-[280px] shrink-0 sm:w-[340px]"
                  >
                    <FeatureCard {...feature} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={togglePlay}
                aria-pressed={paused}
                aria-label={
                  paused
                    ? 'Play the signature features carousel'
                    : 'Pause the signature features carousel'
                }
                className="text-text-muted hover:text-brand-purple-600 focus-visible:ring-brand-purple-300 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {paused ? (
                  <RiPlayLine className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <RiPauseLine className="h-3.5 w-3.5" aria-hidden />
                )}
                {paused ? 'Play' : 'Pause'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
