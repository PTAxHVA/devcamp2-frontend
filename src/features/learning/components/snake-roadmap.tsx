import { RiCheckFill, RiFlagFill, RiStarFill, RiPlayMiniFill } from 'react-icons/ri'
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
    <div className="border-border-soft bg-bg-card relative mt-4 w-full overflow-hidden rounded-3xl border p-6 shadow-sm">
      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-4">
        {[
          { color: 'bg-emerald-500', label: 'Completed' },
          { color: 'bg-amber-500', label: 'In Progress' },
          { color: 'bg-purple-300', label: 'Ready to Start' },
          { color: 'bg-border-soft', label: 'Locked' },
        ].map(({ color, label }) => (
          <div
            key={label}
            className="text-text-muted flex items-center gap-1.5 text-[11px] font-medium"
          >
            <span className={`h-2 w-2 rounded-full ${color} shrink-0`} />
            {label}
          </div>
        ))}
      </div>

      {/* Scrollable roadmap area — grows with topics; scrolls once it passes the
          max height so the page never gets dragged super long. */}
      <div
        className="border-border-soft relative max-h-[70vh] overflow-y-auto overscroll-contain rounded-2xl border"
        style={{
          backgroundImage: 'radial-gradient(circle, #E2E8F0 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="relative mx-auto flex max-w-4xl flex-col px-8 py-14"
          style={{ gap: '96px' }}
        >
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

                  // Only "done" segments draw a solid connector; everything else is dashed.
                  const isNextUnlocked =
                    nextNode && ['completed', 'in_progress'].includes(nextNode.status)
                  const isLastInRow = colIndex === row.length - 1
                  // In a short last row (2 nodes), justify-between pushes them to
                  // opposite ends with an empty middle column, so the horizontal
                  // connector must span 2 columns to actually reach the far node.
                  const horizSpan = isLastRow && row.length === 2 ? 'w-[200%]' : 'w-full'
                  const topicNum = typeNode
                    ? null
                    : topics.findIndex((t) => t.masterTopicId === node.masterTopicId) + 1

                  // 4 states: slate/gray (locked), purple (available/ready), emerald (completed),
                  // amber (in progress). "available" = prerequisites met, user can start now.
                  let ringCls = isActive
                    ? 'bg-bg-card ring-2 ring-slate-400'
                    : 'bg-bg-card ring-1 ring-slate-200'
                  let circleCls = isActive
                    ? 'bg-slate-600 text-white'
                    : 'bg-bg-section text-text-placeholder'
                  let labelCls = isActive
                    ? 'text-text-secondary font-semibold'
                    : 'text-text-placeholder font-medium'
                  let icon: React.ReactNode = (
                    <span className="text-base font-bold">{topicNum}</span>
                  )
                  // Tooltip color follows the node status for a cohesive look
                  let tooltipBg = 'bg-slate-700'
                  let tooltipArrow = 'border-t-slate-700'

                  if (typeNode?.type === 'start') {
                    ringCls = 'bg-bg-card ring-1 ring-emerald-200'
                    circleCls = 'bg-emerald-500 text-white'
                    labelCls = 'text-text-muted font-semibold tracking-widest uppercase text-[10px]'
                    icon = <RiStarFill size={20} />
                  } else if (typeNode?.type === 'finish') {
                    ringCls = 'bg-bg-card ring-1 ring-slate-200'
                    circleCls = 'bg-border-soft text-text-muted'
                    labelCls =
                      'text-text-placeholder font-semibold tracking-widest uppercase text-[10px]'
                    icon = <RiFlagFill size={20} />
                  } else if (isCompleted) {
                    ringCls = 'bg-bg-card ring-1 ring-emerald-200'
                    circleCls = 'bg-emerald-500 text-white'
                    labelCls = 'text-text-secondary font-medium'
                    icon = <RiCheckFill size={22} />
                    tooltipBg = 'bg-emerald-600'
                    tooltipArrow = 'border-t-emerald-600'
                  } else if (isInProgress) {
                    ringCls = 'bg-bg-card ring-1 ring-amber-200'
                    circleCls = 'bg-amber-500 text-white'
                    labelCls = 'text-text-secondary font-semibold'
                    icon = <RiPlayMiniFill size={22} />
                    tooltipBg = 'bg-amber-500'
                    tooltipArrow = 'border-t-amber-500'
                  } else if (isAvailable) {
                    ringCls = isActive
                      ? 'bg-bg-card ring-2 ring-purple-300'
                      : 'bg-bg-card ring-2 ring-purple-200'
                    circleCls = 'bg-purple-100 text-purple-700'
                    labelCls = 'text-purple-700 font-semibold'
                    tooltipBg = 'bg-purple-700'
                    tooltipArrow = 'border-t-purple-700'
                  }

                  // Calm: only the topic actively being learned pulses.
                  const showPulse = isInProgress
                  const pulseColor = 'bg-amber-300'

                  const learningTopic = !typeNode ? (node as LearningTopic) : null

                  return (
                    <div key={node.masterTopicId} className="relative flex w-1/3 justify-center">
                      {/* Horizontal connector */}
                      {!isLastInRow &&
                        nextNode &&
                        (isNextUnlocked ? (
                          <div
                            className={`absolute top-1/2 z-0 h-1.5 ${horizSpan} -translate-y-1/2 rounded-full bg-emerald-300 ${isReverse ? 'right-1/2' : 'left-1/2'}`}
                          />
                        ) : (
                          <div
                            className={`absolute top-1/2 z-0 -translate-y-1/2 ${horizSpan} border-border-input border-t-[3px] border-dashed ${isReverse ? 'right-1/2' : 'left-1/2'}`}
                          />
                        ))}

                      {/* U-turn connector. Its top/bottom borders must line up with
                          the node centers of this row and the next. Node centers are
                          162px apart (66px node height + 96px row gap), so the box is
                          165px tall (162 + the two 3px borders) and nudged up 1.5px so
                          each border's CENTER — not its edge — sits on a node line. */}
                      {isLastInRow && !isLastRow && nextNode && (
                        <div
                          className={`absolute top-[calc(50%-1.5px)] z-0 h-[165px] w-[70%] ${isNextUnlocked ? 'border-solid border-emerald-300' : 'border-border-input border-dashed'} border-t-[3px] border-b-[3px] ${
                            isReverse
                              ? 'right-1/2 rounded-l-[80px] border-l-[3px]'
                              : 'left-1/2 rounded-r-[80px] border-r-[3px]'
                          } `}
                        />
                      )}

                      {/* Node */}
                      <div
                        onClick={() =>
                          typeNode ? null : learningTopic && onNodeClick(learningTopic)
                        }
                        className={`group relative z-10 flex flex-col items-center ${typeNode ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {/* Tooltip */}
                        {!typeNode && (
                          <div
                            className={`pointer-events-none absolute -top-12 left-1/2 z-30 -translate-x-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-lg transition-all duration-200 ${tooltipBg} ${
                              isActive || isInProgress
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
                          className={`rounded-full p-1.25 transition-all duration-200 ${ringCls} ${!typeNode ? 'group-hover:-translate-y-1 group-hover:scale-110' : ''} `}
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
    </div>
  )
}
