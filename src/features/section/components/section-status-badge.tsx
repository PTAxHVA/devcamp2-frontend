import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine } from 'react-icons/ri'
import { SECTION_STATUS_LABEL, type SectionStatus } from '../section-status'

const BADGE_STYLES: Record<SectionStatus, string> = {
  not_started: 'bg-red-50 text-red-700',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

const DOT_STYLES: Record<SectionStatus, string> = {
  not_started: 'bg-red-500',
  in_progress: 'bg-amber-500',
  completed: 'bg-emerald-500',
}

interface SectionStatusBadgeProps {
  status: SectionStatus
  className?: string
}

/** Pill badge for the 3-state section status — red/yellow/green. */
export const SectionStatusBadge = ({ status, className = '' }: SectionStatusBadgeProps) => (
  <span
    className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_STYLES[status]} ${className}`}
  >
    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_STYLES[status]}`} />
    {SECTION_STATUS_LABEL[status]}
  </span>
)

interface SectionStatusIconProps {
  status: SectionStatus
  className?: string
}

/** Compact icon-only variant, used where a badge pill would be too wide
 * (e.g. the trailing column of the topic-detail sections table). */
export const SectionStatusIcon = ({ status, className = 'h-5 w-5' }: SectionStatusIconProps) => {
  if (status === 'completed')
    return <RiCheckboxCircleFill className={`${className} text-emerald-500`} />
  if (status === 'in_progress') {
    return (
      <span className={`${className} block rounded-full border-2 border-dashed border-amber-400`} />
    )
  }
  return <RiCheckboxBlankCircleLine className={`${className} text-red-300`} />
}
