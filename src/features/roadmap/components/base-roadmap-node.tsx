import { Handle, Position } from '@xyflow/react'
import { RiCheckFill, RiLockLine } from 'react-icons/ri'

export type NodeStatus = 'completed' | 'current' | 'upcoming' | 'locked'

export type NodeVariant = 'standard' | 'onboarding'

export interface BaseNodeData extends Record<string, unknown> {
  label: string
  number?: string
  status: NodeStatus
  variant?: NodeVariant
}

export const BaseRoadmapNode = ({ data }: { data: BaseNodeData }) => {
  const variant = data.variant || 'standard'
  const getContainerStyles = () => {
    if (variant === 'onboarding') {
      switch (data.status) {
        case 'completed':
          return 'border-border-soft bg-bg-section text-text-primary'
        case 'current':
          return 'border-brand-purple-600 bg-white ring-2 ring-brand-purple-100 text-brand-purple-700'
        default:
          return 'border-slate-800 bg-white text-text-primary'
      }
    }
    switch (data.status) {
      case 'completed':
        return 'border-emerald-500 bg-white text-text-primary'
      case 'current':
        return 'border-brand-purple-600 bg-white text-brand-purple-700 ring-4 ring-brand-purple-100 font-bold shadow-md'
      case 'locked':
        return 'border-border-soft bg-bg-section text-text-placeholder border-dashed'
      case 'upcoming':
      default:
        return 'border-border-soft bg-white text-text-secondary'
    }
  }
  const renderIndicator = () => {
    if (variant === 'onboarding') {
      if (data.status === 'completed') {
        return (
          <div className="text-text-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200">
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
          <div className="border-border-purple flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white">
            <div className="bg-brand-purple-600 h-2 w-2 rounded-full" />
          </div>
        )}
        {data.status === 'upcoming' && (
          <div className="border-border-input h-5 w-5 rounded-full border-2 bg-white" />
        )}
        {data.status === 'locked' && <RiLockLine className="text-text-placeholder h-5 w-5" />}
      </div>
    )
  }

  return (
    <div
      className={`flex h-14 w-56 cursor-pointer items-center rounded-xl border-2 px-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${getContainerStyles()}`}
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
