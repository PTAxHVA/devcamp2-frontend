import type { ComponentType, SVGProps } from 'react'
import { LuCode, LuDatabase, LuRoute } from 'react-icons/lu'

type RoadmapRoleKind = 'frontend' | 'backend' | 'other'

export interface RoadmapArtProps {
  /** Roadmap display title, e.g. "Frontend Web Developer" — used to infer the
   *  role glyph/color when `role` is not given, and for the a11y label. */
  title: string
  /** Optional explicit role classification (falls back to inferring from `title`
   *  by substring match, same rule the browse card used to apply inline). */
  role?: string
  /** `default` = full card art (browse); `compact` = shorter strip (profile mini-card). */
  variant?: 'default' | 'compact'
}

const ROLE_GLYPH: Record<RoadmapRoleKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  frontend: LuCode,
  backend: LuDatabase,
  other: LuRoute,
}

// Per-role accent reuses existing @theme tokens only (brand-purple for
// frontend, brand-navy for backend, text-placeholder for anything else) —
// normalizes the old ad hoc indigo/teal/slate Tailwind palette.
const ROLE_ACCENT: Record<RoadmapRoleKind, string> = {
  frontend: 'text-brand-purple-500',
  backend: 'text-brand-navy-700',
  other: 'text-text-placeholder',
}

function resolveRoleKind(value: string): RoadmapRoleKind {
  const normalized = value.toLowerCase()
  if (normalized.includes('frontend')) return 'frontend'
  if (normalized.includes('backend')) return 'backend'
  return 'other'
}

function NodePathMotif({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 240 140" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 112 C 55 40, 95 122, 135 58 S 205 18, 232 48"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 7"
        strokeLinecap="round"
      />
      <circle cx="10" cy="112" r="4" fill="currentColor" />
      <circle cx="95" cy="82" r="4" fill="currentColor" />
      <circle cx="163" cy="44" r="4" fill="currentColor" />
      <circle cx="232" cy="48" r="4" fill="currentColor" />
    </svg>
  )
}

/**
 * Shared roadmap art: a role glyph over a faint node-path motif on a lavender
 * card, colored per role. Used by the browse `RoadmapCard` and the profile
 * `ActiveRoadmapCard` so both surfaces render the same visual for a roadmap.
 */
export function RoadmapArt({ title, role, variant = 'default' }: RoadmapArtProps) {
  const roleKind = resolveRoleKind(role ?? title)
  const Glyph = ROLE_GLYPH[roleKind]
  const accentCls = ROLE_ACCENT[roleKind]
  const heightCls = variant === 'compact' ? 'h-24' : 'h-36'

  return (
    <div
      className={`bg-bg-lavender border-border-soft relative flex w-full items-center justify-center overflow-hidden rounded-2xl border ${heightCls}`}
      role="img"
      aria-label={`${title} roadmap illustration`}
    >
      <NodePathMotif className={`absolute inset-0 h-full w-full opacity-40 ${accentCls}`} />
      <Glyph className={`relative h-9 w-9 ${accentCls}`} aria-hidden="true" />
    </div>
  )
}
