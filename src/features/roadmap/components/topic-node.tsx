import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { RiCheckboxCircleFill, RiLockLine } from 'react-icons/ri'

export type TopicNodeStatus = 'completed' | 'in_progress' | 'available' | 'locked'

export interface TopicNodeData extends Record<string, unknown> {
  index: number
  label: string
  status: TopicNodeStatus
}

const TopicNode = ({ data }: NodeProps<Node<TopicNodeData>>) => {
  const getStyles = () => {
    switch (data.status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-50 text-emerald-800 border-solid'
      case 'in_progress':
        return 'border-purple-500 bg-purple-50 text-purple-900 border-solid ring-4 ring-purple-100 font-bold'
      case 'locked':
        return 'border-slate-300 bg-slate-50 text-slate-400 border-dashed'
      case 'available':
      default:
        return 'border-slate-200 bg-white text-slate-600 border-solid'
    }
  }

  const getBadgeStyles = () => {
    if (data.status === 'completed' || data.status === 'in_progress') {
      return data.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
    }
    return 'border border-slate-200 bg-slate-100 text-slate-500'
  }

  return (
    <div
      className={`relative flex w-55 items-center justify-center rounded-xl border-2 px-4 py-3.5 shadow-sm transition-all ${getStyles()}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="h-2! w-2! border-none! bg-slate-300!"
      />

      <div
        className={`absolute -top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm ${getBadgeStyles()}`}
      >
        {data.index}
      </div>

      <span className="text-sm font-semibold tracking-wide">{data.label}</span>

      {data.status === 'completed' && (
        <RiCheckboxCircleFill className="absolute right-3 text-lg text-emerald-500" />
      )}

      {data.status === 'in_progress' && (
        <div className="absolute right-4 h-3.5 w-3.5 rounded-full border-[3px] border-purple-600 bg-white" />
      )}

      {data.status === 'available' && (
        <div className="absolute right-4 h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white" />
      )}

      {data.status === 'locked' && (
        <RiLockLine className="absolute right-4 text-base text-slate-400" />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2! w-2! border-none! bg-slate-300!"
      />
    </div>
  )
}

export default TopicNode
