import { useMemo } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiTimeLine,
  RiListUnordered,
  RiBarChartBoxLine,
  RiStarLine,
  RiCheckLine,
  RiLockLine,
  RiCloseLine,
  RiCheckboxCircleFill,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiBookmark2Line,
} from 'react-icons/ri'

import { roadmapInfo, selectedTopicDetails } from './roadmap-view-data'

interface RoadmapNodeData extends Record<string, unknown> {
  index: number
  label: string
  status: 'completed' | 'current' | 'available' | 'locked'
}

const RoadmapCustomNode = ({ data }: { data: RoadmapNodeData }) => {
  const getStyles = () => {
    switch (data.status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-50 text-emerald-800 border-solid'
      case 'current':
        return 'border-purple-500 bg-purple-50 text-purple-900 border-solid ring-4 ring-purple-100 font-bold'
      case 'locked':
        return 'border-slate-300 bg-slate-50 text-slate-400 border-dashed'
      case 'available':
      default:
        return 'border-slate-200 bg-white text-slate-600 border-solid'
    }
  }

  const getBadgeStyles = () => {
    if (data.status === 'completed' || data.status === 'current') {
      return data.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
    }
    return 'border border-slate-200 bg-slate-100 text-slate-500'
  }

  return (
    <div
      className={`relative flex w-[220px] items-center justify-center rounded-xl border-2 py-3.5 px-4 shadow-sm transition-all ${getStyles()}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2" />

      <div
        className={`absolute -top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm ${getBadgeStyles()}`}
      >
        {data.index}
      </div>

      <span className="text-sm font-semibold tracking-wide">{data.label}</span>

      {data.status === 'completed' && (
        <RiCheckboxCircleFill className="absolute right-3 text-lg text-emerald-500" />
      )}
      {data.status === 'current' && (
        <div className="absolute right-4 h-3.5 w-3.5 rounded-full border-[3px] border-purple-600 bg-white"></div>
      )}
      {data.status === 'available' && (
        <div className="absolute right-4 h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white"></div>
      )}
      {data.status === 'locked' && (
        <RiLockLine className="absolute right-4 text-base text-slate-400" />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2" />
    </div>
  )
}

const RoadmapViewComponent = () => {
  const nodeTypes = useMemo(() => ({ roadmapNode: RoadmapCustomNode }), [])

  const initialNodes: Node<RoadmapNodeData>[] = [
    {
      id: '1',
      type: 'roadmapNode',
      data: { index: 1, label: 'Web Fundamentals', status: 'completed' },
      position: { x: 250, y: 20 },
    },
    {
      id: '2',
      type: 'roadmapNode',
      data: { index: 2, label: 'HTML & CSS', status: 'completed' },
      position: { x: 80, y: 140 },
    },
    {
      id: '3',
      type: 'roadmapNode',
      data: { index: 3, label: 'JavaScript Basics', status: 'current' },
      position: { x: 420, y: 140 },
    },
    {
      id: '4',
      type: 'roadmapNode',
      data: { index: 4, label: 'DOM & Events', status: 'available' },
      position: { x: 250, y: 260 },
    },
    {
      id: '5',
      type: 'roadmapNode',
      data: { index: 5, label: 'Git & GitHub', status: 'available' },
      position: { x: -80, y: 380 },
    },
    {
      id: '6',
      type: 'roadmapNode',
      data: { index: 6, label: 'React Basics', status: 'available' },
      position: { x: 250, y: 380 },
    },
    {
      id: '7',
      type: 'roadmapNode',
      data: { index: 7, label: 'Components & Props', status: 'available' },
      position: { x: 580, y: 380 },
    },
    {
      id: '8',
      type: 'roadmapNode',
      data: { index: 8, label: 'API Fetching', status: 'locked' },
      position: { x: 250, y: 500 },
    },
    {
      id: '9',
      type: 'roadmapNode',
      data: { index: 9, label: 'Mini Project', status: 'locked' },
      position: { x: 250, y: 620 },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e6-8',
      source: '6',
      target: '8',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
    {
      id: 'e8-9',
      source: '8',
      target: '9',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
  ]

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-1 flex-col overflow-hidden bg-white p-6 lg:p-8">
        {/* Header */}
        <div className="w-full">
          <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800">
            <RiArrowLeftLine /> Back to all roadmaps
          </button>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{roadmapInfo.title}</h1>
            <RiBookmarkLine className="text-2xl text-purple-600" />
          </div>
          <p className="mb-4 text-sm text-slate-600">{roadmapInfo.description}</p>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiTimeLine /> {roadmapInfo.duration}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiListUnordered /> {roadmapInfo.topicsCount} topics
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiBarChartBoxLine /> {roadmapInfo.difficulty}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-purple-700">
              <RiStarLine /> {roadmapInfo.tag}
            </div>
          </div>
        </div>

        {/* Xyflow Canvas */}
        <div className="relative flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner overflow-hidden">
          <div className="absolute left-6 top-6 z-10 flex items-center gap-5 rounded-xl border border-slate-100 bg-white/90 backdrop-blur-sm p-3 shadow-sm text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <RiCheckLine className="text-[10px]" />
              </div>{' '}
              Completed
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-purple-600 bg-white">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              </div>{' '}
              Current
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white" /> Available
            </div>
            <div className="flex items-center gap-1.5">
              <RiLockLine className="text-base text-slate-400" /> Locked
            </div>
          </div>

          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.5}
            maxZoom={1.5}
            nodesDraggable={true}
          >
            <Controls className="!bottom-6 !left-6 !top-auto !flex !flex-col-reverse !gap-1 !border-none !shadow-sm [&>button]:!bg-white [&>button]:!border [&>button]:!border-slate-200 [&>button]:!rounded-lg [&>button]:!w-8 [&>button]:!h-8" />

            <MiniMap
              className="!bottom-6 !right-6 !bg-white !border-2 !border-purple-100 !rounded-xl !shadow-sm !w-40 !h-28"
              nodeColor={(node) => {
                const data = node.data as RoadmapNodeData
                if (data?.status === 'completed') return '#10b981'
                if (data?.status === 'current') return '#7c3aed'
                return '#cbd5e1'
              }}
              maskColor="rgba(124, 58, 237, 0.04)"
            />

            <Background gap={16} size={1} color="#cbd5e1" />
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="flex w-[380px] shrink-0 flex-col border-l border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Current Topic
          </p>
          <button className="text-slate-400 hover:text-slate-700">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">{selectedTopicDetails.title}</h2>

          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-700">Progress</span>
              <span className="text-slate-900">{selectedTopicDetails.progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-purple-600"
                style={{ width: `${selectedTopicDetails.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Prerequisites</h3>
            <ul className="space-y-2.5">
              {selectedTopicDetails.prerequisites.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
                    <RiCheckLine className="text-xs" />
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="mb-2 text-sm font-bold text-slate-900">About this topic</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {selectedTopicDetails.description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">You'll learn</h3>
            <ul className="space-y-3">
              {selectedTopicDetails.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <RiCheckboxCircleFill className="mt-0.5 text-base text-purple-600 shrink-0" />
                  <span className="font-medium">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 space-y-3 bg-white">
          <button className="flex w-full items-center justify-between rounded-xl bg-[#0B1528] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800">
            Continue learning <RiArrowRightLine className="text-lg" />
          </button>
          <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
            View lessons <RiExternalLinkLine className="text-lg text-slate-400" />
          </button>
          <button className="mt-2 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors pt-2">
            <RiBookmark2Line className="text-lg" /> Save for later
          </button>
        </div>
      </aside>
    </div>
  )
}

export default RoadmapViewComponent
