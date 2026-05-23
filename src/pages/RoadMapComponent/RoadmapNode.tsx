import { Handle, Position } from '@xyflow/react'
import { RiCheckLine } from 'react-icons/ri'

interface RoadmapNodeProps {
  data: {
    number: string
    label: string
    status: 'done' | 'current' | 'upcoming'
  }
}

const RoadmapNode = ({ data }: RoadmapNodeProps) => {
  const isDone = data.status === 'done'
  const isCurrent = data.status === 'current'

  let borderColor = 'border-base-300'
  let textColor = 'text-base-content'
  let Icon = <div className="w-4 h-4 rounded-full border-2 border-base-300 bg-white" />

  if (isDone) {
    borderColor = 'border-blue-800'
    textColor = 'text-blue-900'
    Icon = (
      <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center text-white">
        <RiCheckLine className="w-3 h-3" />
      </div>
    )
  } else if (isCurrent) {
    borderColor = 'border-purple-500'
    textColor = 'text-purple-700'
    Icon = (
      <div className="w-5 h-5 rounded-full border-[3px] border-purple-500 flex items-center justify-center bg-white">
        <div className="w-2 h-2 bg-purple-900 rounded-full" />
      </div>
    )
  }

  return (
    <div
      className={`relative px-6 py-3 bg-base-100 rounded-lg border-2 shadow-sm min-w-[200px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${borderColor}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, border: 'none', background: 'transparent' }}
      />
      <div className="absolute -top-2.5 -left-2.5 bg-white rounded-full">{Icon}</div>

      <span className="text-sm font-bold opacity-70 mb-1">{data.number}</span>
      <span className={`text-base font-semibold ${textColor}`}>{data.label}</span>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, border: 'none', background: 'transparent' }}
      />
    </div>
  )
}

export default RoadmapNode
