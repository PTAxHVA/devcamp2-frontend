import { Handle, Position } from '@xyflow/react'
import {
  RiAddLine,
  RiArrowUpDownLine,
  RiCheckFill,
  RiGitBranchLine,
  RiLockLine,
} from 'react-icons/ri'

export type NodeStatus = 'completed' | 'current' | 'upcoming' | 'locked'

export type NodeVariant = 'standard' | 'onboarding' | 'ghost' | 'fork-label'

export interface BaseNodeData extends Record<string, unknown> {
  label: string
  number?: string
  status: NodeStatus
  variant?: NodeVariant
  /** Optional hover hint (native tooltip) — used by the ghost fork node. */
  hint?: string
  /** Ghost only: when true the node is an add-in-parallel affordance (Customize editor). */
  clickable?: boolean
  /** Ghost only: the branch this ghost topic belongs to (add-in-parallel target). */
  branchId?: string
  branchName?: string
  /** Standard only: a small pill on the node, e.g. "Selected" for the chosen fork branch. */
  badge?: string
}

export const BaseRoadmapNode = ({ data }: { data: BaseNodeData }) => {
  const variant = data.variant || 'standard'
  // Only the real (interactive) roadmap graph wires node clicks; the onboarding/demo
  // preview is read-only, so it must not look clickable (L9 — no pointer/hover-lift).
  // The learner-view ghost fork node is inert too — but an editor ghost with
  // `clickable` IS an add-in-parallel affordance, so it looks and behaves clickable.
  const isGhostAdd = variant === 'ghost' && data.clickable === true
  const isInteractive = variant === 'standard' || isGhostAdd

  // Fork-group label pill (Customize editor): the "choose one" heading that sits
  // above a fork row. Not a real topic — inert, no handles, no status styling.
  if (variant === 'fork-label') {
    return (
      <div className="flex w-64 justify-center">
        <span className="border-border-purple bg-bg-lavender text-brand-purple-700 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase">
          <RiArrowUpDownLine className="h-3 w-3" />
          {data.label}
        </span>
      </div>
    )
  }

  const getContainerStyles = () => {
    if (variant === 'onboarding') {
      switch (data.status) {
        case 'completed':
          return 'border-border-soft bg-bg-section text-text-primary'
        case 'current':
          return 'border-brand-purple-600 bg-bg-card ring-2 ring-brand-purple-100 text-brand-purple-700'
        default:
          return 'border-slate-800 bg-bg-card text-text-primary'
      }
    }
    if (variant === 'ghost') {
      // The alternative fork path: visible but clearly not part of the enrollment.
      // A clickable ghost (Customize editor) brightens on hover to invite adding it.
      return isGhostAdd
        ? 'border-border-input bg-bg-section text-text-secondary hover:border-brand-purple-400 hover:text-brand-purple-700 border-dashed'
        : 'border-border-input bg-bg-section text-text-placeholder border-dashed opacity-80'
    }
    switch (data.status) {
      case 'completed':
        return 'border-emerald-200 bg-bg-card text-text-primary'
      case 'current':
        return 'border-brand-purple-500 bg-bg-lavender text-brand-purple-700 ring-4 ring-brand-purple-100 font-bold shadow-md'
      case 'locked':
        return 'border-border-soft bg-bg-section/60 text-text-placeholder border-dashed'
      case 'upcoming':
      default:
        return 'border-border-soft bg-bg-card text-text-secondary'
    }
  }
  const renderIndicator = () => {
    if (variant === 'ghost') {
      // A branch icon reads as "an alternative path"; the "+ Add" affordance on the
      // right (below) carries the click intent for a clickable ghost.
      return (
        <div className="flex w-6 shrink-0 justify-center">
          <RiGitBranchLine
            className={`h-4 w-4 ${isGhostAdd ? 'text-brand-purple-500' : 'text-text-placeholder'}`}
          />
        </div>
      )
    }
    if (variant === 'onboarding') {
      if (data.status === 'completed') {
        return (
          <div className="text-text-muted bg-border-soft flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            <RiCheckFill className="h-3.5 w-3.5" />
          </div>
        )
      }
      return (
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${data.status === 'current' ? 'bg-brand-purple-600 text-white' : 'bg-slate-900 text-white'}`}
        >
          {data.number}
        </div>
      )
    }

    // Standard Render — a numbered step badge whose color tracks status, so the
    // graph reads as an ordered path at a glance (not just anonymous dots).
    const badgeBase =
      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold'
    switch (data.status) {
      case 'completed':
        return (
          <div className={`${badgeBase} bg-emerald-500 text-white`}>
            <RiCheckFill className="h-4 w-4" />
          </div>
        )
      case 'current':
        return <div className={`${badgeBase} bg-brand-purple-600 text-white`}>{data.number}</div>
      case 'locked':
        return (
          <div className={`${badgeBase} bg-bg-section text-text-placeholder`}>
            <RiLockLine className="h-3.5 w-3.5" />
          </div>
        )
      case 'upcoming':
      default:
        return (
          <div className={`${badgeBase} border-border-soft text-text-muted border bg-white`}>
            {data.number}
          </div>
        )
    }
  }

  return (
    <div
      title={data.hint}
      className={`flex h-14 w-64 items-center rounded-xl border-2 px-3 transition-all duration-200 ${
        isInteractive ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg' : 'cursor-default'
      } ${getContainerStyles()}`}
    >
      <Handle type="target" position={Position.Top} className="h-2 w-2 opacity-0" />

      {renderIndicator()}

      <div
        className={`ml-2.5 flex-1 truncate px-1 text-sm font-semibold ${variant === 'standard' || isGhostAdd ? 'text-left' : 'text-center'}`}
      >
        {data.label}
      </div>

      {data.badge && (
        <span className="bg-brand-purple-600 ml-1 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
          {data.badge}
        </span>
      )}

      {isGhostAdd && (
        <span className="text-brand-purple-600 ml-1 flex shrink-0 items-center gap-0.5 text-xs font-bold">
          <RiAddLine className="h-3.5 w-3.5" /> Add
        </span>
      )}

      <Handle type="source" position={Position.Bottom} className="h-2 w-2 opacity-0" />
    </div>
  )
}
