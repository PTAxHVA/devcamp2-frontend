import { useId } from 'react'

interface LogoProps {
  className?: string
}

interface VoraMarkProps extends LogoProps {
  /**
   * Hide the mark from assistive tech. Use when a visible "VORA" label already sits
   * beside it (e.g. inside <VoraWordmark />) so a screen reader doesn't read "VORA"
   * twice. Standalone (collapsed sidebar) leave it false so the mark keeps its label.
   */
  decorative?: boolean
}

/**
 * VORA brand mark — "Constellation": progress nodes ascending to a bright north
 * star (the verified destination). A crisp, transparent, self-contained vector
 * (no raster) so it stays sharp from a 16px favicon to a large hero, on light or
 * dark surfaces. Used standalone (collapsed sidebar) and inside <VoraWordmark />.
 */
export const VoraMark = ({ className = 'h-8 w-8', decorative = false }: VoraMarkProps) => {
  // The gradient id must be unique per instance: several marks can share one page
  // (e.g. sidebar + a printable certificate), and duplicate ids make later marks
  // reuse the first gradient. useId() is stable across renders; strip the colons
  // React emits so the id stays valid inside url(#...).
  const gradientId = `vora-mark-${useId().replace(/:/g, '')}`

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'VORA' })}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="5.5"
          y1="25"
          x2="24"
          y2="9"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="0.5" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      {/* Soft glow behind the north star. */}
      <circle cx="24" cy="9" r="6.5" fill="#7c3aed" opacity="0.14" />
      {/* Ascending path linking the progress nodes up to the star. */}
      <path
        d="M5.5 25 L12 18.5 L17.5 21 L24 9"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Progress nodes — completed checkpoints. */}
      <circle cx="5.5" cy="25" r="2.1" fill="#8b5cf6" />
      <circle cx="12" cy="18.5" r="2.1" fill="#7c3aed" />
      <circle cx="17.5" cy="21" r="2.1" fill="#6d28d9" />
      {/* North star — the verified destination, with a bright core. */}
      <path
        d="M24 3.8 L25.5 7.5 L29.2 9 L25.5 10.5 L24 14.2 L22.5 10.5 L18.8 9 L22.5 7.5 Z"
        fill={`url(#${gradientId})`}
      />
      <circle cx="24" cy="9" r="1.15" fill="#ffffff" />
      {/* Faint background stars for depth. */}
      <circle cx="9.2" cy="10.5" r="0.85" fill="#a78bfa" opacity="0.45" />
      <circle cx="20.5" cy="26" r="0.75" fill="#a78bfa" opacity="0.32" />
    </svg>
  )
}

/** Full logo: mark + "VORA" wordmark (page font, brand-navy) for the expanded sidebar. */
export const VoraWordmark = ({ className = '' }: LogoProps) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <VoraMark decorative className="h-8 w-8 shrink-0" />
    <span className="text-brand-navy-900 text-2xl font-extrabold tracking-tight">VORA</span>
  </div>
)
