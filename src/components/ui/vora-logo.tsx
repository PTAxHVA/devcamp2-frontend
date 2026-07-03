interface LogoProps {
  className?: string
}

/**
 * VORA brand mark — a crisp, transparent, self-contained vector (no raster) so it
 * renders sharp at any size and stays legible on light or dark surfaces. Used on its
 * own for the collapsed sidebar and inside <VoraWordmark /> for the expanded state.
 * The purple badge + white route-glyph is a placeholder mark; swap in the official
 * vector here when available.
 */
export const VoraMark = ({ className = 'h-8 w-8' }: LogoProps) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="VORA"
  >
    <rect width="32" height="32" rx="9" fill="#6d28d9" />
    {/* Route "V": a path dipping to a waypoint at the base — evokes a roadmap checkpoint. */}
    <path
      d="M9 9.5 L16 22.5 L23 9.5"
      stroke="#ffffff"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="22.5" r="2.1" fill="#ffffff" />
  </svg>
)

/** Full logo: mark + "VORA" wordmark (page font, brand-navy) for the expanded sidebar. */
export const VoraWordmark = ({ className = '' }: LogoProps) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <VoraMark className="h-8 w-8 shrink-0" />
    <span className="text-brand-navy-900 text-2xl font-extrabold tracking-tight">VORA</span>
  </div>
)
