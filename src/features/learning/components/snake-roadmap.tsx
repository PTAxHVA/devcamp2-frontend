import { RiCheckFill, RiLockFill, RiFlagFill, RiStarFill, RiPlayMiniFill } from 'react-icons/ri'
import type { LearningTopic } from '../types'

interface RoadmapSnakePathProps {
  topics: LearningTopic[]
  activeTopicId: string | undefined
  onNodeClick: (topic: LearningTopic) => void
}

type AnyNode =
  | LearningTopic
  | { masterTopicId: string; title: string; status: string; type: string }

export default function RoadmapSnakePath({
  topics,
  activeTopicId,
  onNodeClick,
}: RoadmapSnakePathProps) {
  const allNodes: AnyNode[] = [
    { masterTopicId: 'start-node', title: 'START', status: 'completed', type: 'start' },
    ...topics,
    { masterTopicId: 'finish-node', title: 'FINISH', status: 'locked', type: 'finish' },
  ]

  const CHUNK_SIZE = 3
  const rows: AnyNode[][] = []
  for (let i = 0; i < allNodes.length; i += CHUNK_SIZE) {
    rows.push(allNodes.slice(i, i + CHUNK_SIZE))
  }

  return (
    <div className="relative mt-4 w-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #E2E8F0 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Legend */}
      <div className="relative z-10 mb-2 flex flex-wrap items-center gap-4">
        {[
          { color: 'bg-emerald-500', label: 'Completed' },
          { color: 'bg-amber-400', label: 'In Progress' },
          { color: 'bg-violet-500', label: 'Available' },
          { color: 'bg-slate-300', label: 'Locked' },
        ].map(({ color, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500"
          >
            <span className={`h-2 w-2 rounded-full ${color} shrink-0`} />
            {label}
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col py-14" style={{ gap: '96px' }}>
        {rows.map((row, rowIndex) => {
          const isReverse = rowIndex % 2 === 1
          const isLastRow = rowIndex === rows.length - 1

          return (
            <div
              key={rowIndex}
              className={`relative flex w-full items-center justify-between px-12 ${isReverse ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {row.map((node, colIndex) => {
                const globalIndex = rowIndex * CHUNK_SIZE + colIndex
                const nextNode = allNodes[globalIndex + 1]
                const typeNode = 'type' in node ? node : null

                const isActive = activeTopicId === node.masterTopicId
                const isCompleted = node.status === 'completed'
                const isInProgress = node.status === 'in_progress'
                const isAvailable = node.status === 'available'
                const isLocked = node.status === 'locked'

                const isNextUnlocked =
                  nextNode && ['completed', 'in_progress', 'available'].includes(nextNode.status)
                const isLastInRow = colIndex === row.length - 1
                const topicNum = typeNode
                  ? null
                  : topics.findIndex((t) => t.masterTopicId === node.masterTopicId) + 1

                // Per-status styles
                let ringCls = 'bg-slate-50 ring-4 ring-slate-100'
                let circleCls = 'bg-slate-100 text-slate-400'
                let labelCls = 'text-slate-400 font-medium'
                let icon: React.ReactNode = <RiLockFill size={18} />

                if (typeNode?.type === 'start') {
                  ringCls = 'bg-violet-50 ring-4 ring-violet-100'
                  circleCls =
                    'bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-xl shadow-violet-300/40'
                  labelCls = 'text-violet-500 font-black tracking-widest uppercase text-[10px]'
                  icon = <RiStarFill size={22} />
                } else if (typeNode?.type === 'finish') {
                  ringCls = 'bg-slate-50 ring-4 ring-slate-100'
                  circleCls = 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500'
                  labelCls = 'text-slate-400 font-black tracking-widest uppercase text-[10px]'
                  icon = <RiFlagFill size={22} />
                } else if (isCompleted) {
                  ringCls = 'bg-emerald-50 ring-4 ring-emerald-100'
                  circleCls =
                    'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-300/40'
                  labelCls = 'text-emerald-600 font-semibold'
                  icon = <RiCheckFill size={22} />
                } else if (isInProgress) {
                  ringCls = 'bg-amber-50 ring-4 ring-amber-200'
                  circleCls =
                    'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-300/40'
                  labelCls = 'text-amber-600 font-bold'
                  icon = <RiPlayMiniFill size={22} />
                } else if (isAvailable) {
                  ringCls = isActive
                    ? 'bg-violet-100 ring-4 ring-violet-300'
                    : 'bg-violet-50 ring-4 ring-violet-100'
                  circleCls =
                    'bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-xl shadow-violet-300/50'
                  labelCls = 'text-violet-700 font-bold'
                  icon = <span className="text-base font-black">{topicNum}</span>
                }

                const tooltipBg = isCompleted
                  ? 'bg-emerald-600'
                  : isInProgress
                    ? 'bg-amber-500'
                    : isAvailable
                      ? 'bg-violet-700'
                      : 'bg-slate-700'

                const tooltipArrow = isCompleted
                  ? 'border-t-emerald-600'
                  : isInProgress
                    ? 'border-t-amber-500'
                    : isAvailable
                      ? 'border-t-violet-700'
                      : 'border-t-slate-700'

                const showPulse = isInProgress || (isAvailable && isActive)
                const pulseColor = isInProgress ? 'bg-amber-400' : 'bg-violet-400'

                const learningTopic = !typeNode ? (node as LearningTopic) : null

                return (
                  <div key={node.masterTopicId} className="relative flex w-1/3 justify-center">
                    {/* Horizontal connector */}
                    {!isLastInRow &&
                      nextNode &&
                      (isNextUnlocked ? (
                        <div
                          className={`absolute top-1/2 z-0 h-1.25 w-full -translate-y-1/2 rounded-full bg-linear-to-r from-violet-300 to-violet-400 ${isReverse ? 'right-1/2' : 'left-1/2'}`}
                        />
                      ) : (
                        <div
                          className={`absolute top-1/2 z-0 w-full border-t-4 border-dashed border-slate-200 ${isReverse ? 'right-1/2' : 'left-1/2'}`}
                        />
                      ))}

                    {/* U-turn connector */}
                    {isLastInRow && !isLastRow && nextNode && (
                      <div
                        className={`absolute top-1/2 z-0 h-40 w-[70%] ${isNextUnlocked ? 'border-solid border-violet-400' : 'border-dashed border-slate-200'} border-t-4 border-b-4 ${
                          isReverse
                            ? 'right-1/2 rounded-l-[80px] border-l-4'
                            : 'left-1/2 rounded-r-[80px] border-r-4'
                        } `}
                      />
                    )}

                    {/* Node */}
                    <div
                      onClick={() =>
                        typeNode || isLocked ? null : learningTopic && onNodeClick(learningTopic)
                      }
                      className={`group relative z-10 flex flex-col items-center ${typeNode || isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {/* Tooltip */}
                      {!typeNode && (
                        <div
                          className={`pointer-events-none absolute -top-12 left-1/2 z-30 -translate-x-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-lg transition-all duration-200 ${tooltipBg} ${
                            isActive || isInProgress || isAvailable
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                          } `}
                        >
                          {topicNum}. {node.title}
                          <span
                            className={`absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-[5px] border-r-[5px] border-l-[5px] border-r-transparent border-l-transparent ${tooltipArrow}`}
                          />
                        </div>
                      )}

                      {/* Pulse ring */}
                      {showPulse && (
                        <span
                          className={`absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full ${pulseColor} animate-ping opacity-20`}
                        />
                      )}

                      {/* Section progress arc for in-progress topics */}
                      {isInProgress && learningTopic && learningTopic.sectionTotal > 0 && (
                        <svg
                          className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 -rotate-90"
                          viewBox="0 0 96 96"
                        >
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke="#fde68a"
                            strokeWidth="4"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 44}`}
                            strokeDashoffset={`${2 * Math.PI * 44 * (1 - learningTopic.sectionCompleted / learningTopic.sectionTotal)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                      )}

                      {/* Ring + circle */}
                      <div
                        className={`rounded-full p-1.25 transition-all duration-200 ${ringCls} ${!typeNode && !isLocked ? 'group-hover:-translate-y-1 group-hover:scale-110' : ''} `}
                      >
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-full ${circleCls}`}
                        >
                          {icon}
                        </div>
                      </div>

                      {/* Label */}
                      <span
                        className={`absolute top-full mt-2.5 line-clamp-2 w-22.5 text-center text-[11px] leading-tight ${labelCls}`}
                      >
                        {typeNode ? node.title : `${topicNum}. ${node.title}`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
