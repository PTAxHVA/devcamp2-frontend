import { cn } from '@/lib/utils'
import { EYEBROW } from '../lib/landing-styles'

interface SectionHeadProps {
  eyebrow: string
  title: string
  lead?: string
  /** Center the block (used by Features / FAQ). */
  center?: boolean
  /** Override the lead's max-width (defaults to 52ch). */
  leadClassName?: string
}

/** Eyebrow + h2 + optional lead — the repeated section header across the landing page. */
export const SectionHead = ({
  eyebrow,
  title,
  lead,
  center = false,
  leadClassName,
}: SectionHeadProps) => (
  <div
    className={cn(
      'mb-2 flex max-w-160 flex-col gap-3',
      center && 'mx-auto items-center text-center',
    )}
  >
    <span className={EYEBROW}>{eyebrow}</span>
    <h2 className="text-text-primary text-[clamp(1.9rem,1.35rem+1.9vw,2.75rem)] font-extrabold tracking-[-0.02em] text-balance">
      {title}
    </h2>
    {lead && (
      <p
        className={cn(
          'text-text-secondary text-[clamp(1rem,0.95rem+0.3vw,1.18rem)]',
          center && 'text-center',
          leadClassName ?? 'max-w-[52ch]',
        )}
      >
        {lead}
      </p>
    )}
  </div>
)
