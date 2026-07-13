/**
 * Shared arbitrary-value class strings for the landing surfaces, kept as complete
 * literals so Tailwind's scanner still generates them. Centralized so the soft,
 * low-opacity navy elevation reads as one system across cards/features/CTA.
 */

/** Centered content column shared by every landing section (max 1160px, 20px gutter). */
export const WRAP = 'mx-auto w-full max-w-[1160px] px-5'

/** Small uppercase Roboto eyebrow above section titles / hero / CTA. */
export const EYEBROW =
  'font-secondary text-brand-purple-600 text-xs font-medium tracking-[0.18em] uppercase'

/** Roadmap-preview / step-frame elevation (largest, softest). */
export const SHADOW_CARD = 'shadow-[0_22px_60px_-30px_rgba(6,26,53,0.28)]'

/** Benefit / feature resting elevation. */
export const SHADOW_SOFT = 'shadow-[0_12px_32px_-20px_rgba(6,26,53,0.22)]'

/**
 * Interactive-card hover treatment (benefit + feature cards): subtle lift, purple
 * border tint, lift shadow. Kept as ONE complete literal so Tailwind emits the
 * hover `shadow-[…]` variant — a `hover:${var}` fragment would never be generated.
 */
export const CARD_HOVER =
  'transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-purple-400/35 hover:shadow-[0_20px_44px_-24px_rgba(6,26,53,0.30)]'

/**
 * Reveal transition (opacity + transform, ease-out-expo). Kept as ONE complete
 * literal so Tailwind's scanner emits the arbitrary `ease-[…]` — a template
 * fragment like `ease-[${x}]` would never be generated.
 */
export const REVEAL_TRANSITION =
  'transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
