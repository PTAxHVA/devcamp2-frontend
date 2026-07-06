import { Handle, Position } from '@xyflow/react'
import { RiCheckFill, RiGitBranchLine, RiLockLine } from 'react-icons/ri'

export type NodeStatus = 'completed' | 'current' | 'upcoming' | 'locked'

export type NodeVariant = 'standard' | 'onboarding' | 'ghost'

export interface BaseNodeData extends Record<string, unknown> {
  label: string
  number?: string
  status: NodeStatus
  variant?: NodeVariant
  /** Optional hover hint (native tooltip) — used by the ghost fork node. */
  hint?: string
}

export const BaseRoadmapNode = ({ data }: { data: BaseNodeData }) => {
  const variant = data.variant || 'standard'
  // Only the real (interactive) roadmap graph wires node clicks; the onboarding/demo
  // preview is read-only, so it must not look clickable (L9 — no pointer/hover-lift).
  // The ghost fork node (the not-chosen path) is likewise inert.
  const isInteractive = variant === 'standard'
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
      return 'border-border-input bg-bg-section text-text-placeholder border-dashed opacity-80'
    }
    switch (data.status) {
      case 'completed':
        return 'border-emerald-500 bg-bg-card text-text-primary'
      case 'current':
        return 'border-brand-purple-600 bg-bg-card text-brand-purple-700 ring-4 ring-brand-purple-100 font-bold shadow-md'
      case 'locked':
        return 'border-border-soft bg-bg-section text-text-placeholder border-dashed'
      case 'upcoming':
      default:
        return 'border-border-soft bg-bg-card text-text-secondary'
    }
  }
  const renderIndicator = () => {
    if (variant === 'ghost') {
      return (
        <div className="flex w-6 shrink-0 justify-center">
          <RiGitBranchLine className="text-text-placeholder h-4 w-4" />
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

    // Standard Render
    return (
      <div className="flex w-6 shrink-0 justify-center">
        {data.status === 'completed' && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <RiCheckFill className="h-3.5 w-3.5" />
          </div>
        )}
        {data.status === 'current' && (
          <div className="border-border-purple bg-bg-card flex h-5 w-5 items-center justify-center rounded-full border-2">
            <div className="bg-brand-purple-600 h-2 w-2 rounded-full" />
          </div>
        )}
        {data.status === 'upcoming' && (
          <div className="border-border-input bg-bg-card h-5 w-5 rounded-full border-2" />
        )}
        {data.status === 'locked' && <RiLockLine className="text-text-placeholder h-5 w-5" />}
      </div>
    )
  }

  return (
    <div
      title={data.hint}
      className={`flex h-14 w-56 items-center rounded-xl border-2 px-3 transition-all duration-300 ${
        isInteractive ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg' : 'cursor-default'
      } ${getContainerStyles()}`}
    >
      <Handle type="target" position={Position.Top} className="h-2 w-2 opacity-0" />

      {renderIndicator()}

      <div className="ml-2 flex-1 truncate px-1 text-center text-sm font-semibold">
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} className="h-2 w-2 opacity-0" />
    </div>
  )
}
