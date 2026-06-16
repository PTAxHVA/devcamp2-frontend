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
          return 'border-slate-200 bg-slate-50 text-slate-800'
        case 'current':
          return 'border-brand-purple-600 bg-white ring-2 ring-brand-purple-100 text-brand-purple-700'
        default:
          return 'border-slate-800 bg-white text-slate-800'
      }
    }
    switch (data.status) {
      case 'completed':
        return 'border-emerald-500 bg-white text-slate-900'
      case 'current':
        return 'border-brand-purple-600 bg-white text-brand-purple-700 ring-4 ring-brand-purple-100 font-bold shadow-md'
      case 'locked':
        return 'border-slate-200 bg-slate-50 text-slate-400 border-dashed'
      case 'upcoming':
      default:
        return 'border-slate-200 bg-white text-slate-700'
    }
  }
  const renderIndicator = () => {
    if (variant === 'onboarding') {
      if (data.status === 'completed') {
        return (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <RiCheckFill className="h-3.5 w-3.5" />
          </div>
        )
      }
      return (
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${data.status === 'current' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'}`}
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
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-purple-600 bg-white">
            <div className="h-2 w-2 rounded-full bg-purple-600" />
          </div>
        )}
        {data.status === 'upcoming' && (
          <div className="h-5 w-5 rounded-full border-2 border-slate-300 bg-white" />
        )}
        {data.status === 'locked' && <RiLockLine className="h-5 w-5 text-slate-400" />}
      </div>
    )
  }

  return (
    <div
      className={`flex h-14 w-56 cursor-pointer items-center rounded-xl border-2 px-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${getContainerStyles()}`}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 w-2 h-2" />

      {renderIndicator()}

      <div className="flex-1 ml-2 text-center text-sm font-semibold truncate px-1">
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0 w-2 h-2" />
    </div>
  )
}
