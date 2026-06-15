import { useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiAlertLine,
  RiAddLine,
  RiSubtractLine,
  RiArrowUpLine,
  RiCloseLine,
  RiArrowDownLine,
  RiDragDropLine,
  RiCheckFill,
  RiLockLine,
  RiSparklingFill,
  RiArrowRightUpLine,
} from 'react-icons/ri'

type NodeStatus = 'completed' | 'current' | 'upcoming' | 'locked'

interface EditNodeData extends Record<string, unknown> {
  label: string
  number: string
  status: NodeStatus
}

const EditRoadmapNode = ({ data }: { data: EditNodeData }) => {
  const getStyles = () => {
    switch (data.status) {
      case 'completed':
        return 'border-emerald-500 bg-white text-slate-900'
      case 'current':
        return 'border-purple-600 bg-white text-purple-700 ring-4 ring-purple-100 font-bold shadow-md'
      case 'locked':
        return 'border-slate-200 bg-slate-50 text-slate-400 border-dashed'
      case 'upcoming':
      default:
        return 'border-slate-200 bg-white text-slate-700'
    }
  }

  return (
    <div
      className={`flex h-12 w-56 cursor-pointer items-center rounded-xl border-2 px-3 shadow-sm transition-all hover:shadow-md ${getStyles()}`}
    >
      <Handle type="target" position={Position.Top} className="h-1.5! w-1.5! bg-slate-300!" />

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

      <div className="flex-1 text-center text-sm font-semibold">{data.label}</div>

      <Handle type="source" position={Position.Bottom} className="h-1.5! w-1.5! bg-slate-300!" />
    </div>
  )
}

export default function EditCurrentRoadmapPage() {
  const nodeTypes = useMemo(() => ({ editNode: EditRoadmapNode }), [])
  const [showAlert, setShowAlert] = useState(true)
  const initialNodes: Node<EditNodeData>[] = [
    {
      id: '1',
      type: 'editNode',
      position: { x: 250, y: 20 },
      data: { label: 'Web Fundamentals', number: '1', status: 'completed' },
    },
    {
      id: '2',
      type: 'editNode',
      position: { x: 50, y: 120 },
      data: { label: 'HTML & CSS', number: '2', status: 'current' },
    },
    {
      id: '3',
      type: 'editNode',
      position: { x: 450, y: 120 },
      data: { label: 'JavaScript Basics', number: '3', status: 'upcoming' },
    },
    {
      id: '4',
      type: 'editNode',
      position: { x: 50, y: 220 },
      data: { label: 'DOM & Events', number: '4', status: 'upcoming' },
    },
    {
      id: '5',
      type: 'editNode',
      position: { x: 450, y: 220 },
      data: { label: 'Git & GitHub', number: '5', status: 'upcoming' },
    },
    {
      id: '6',
      type: 'editNode',
      position: { x: 50, y: 320 },
      data: { label: 'React Basics', number: '6', status: 'upcoming' },
    },
    {
      id: '7',
      type: 'editNode',
      position: { x: 450, y: 320 },
      data: { label: 'Components & Props', number: '7', status: 'upcoming' },
    },
    {
      id: '8',
      type: 'editNode',
      position: { x: 250, y: 420 },
      data: { label: 'API Fetching', number: '8', status: 'locked' },
    },
    {
      id: '9',
      type: 'editNode',
      position: { x: 250, y: 520 },
      data: { label: 'Mini Project', number: '9', status: 'locked' },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
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
      id: 'e3-5',
      source: '3',
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
      id: 'e5-7',
      source: '5',
      target: '7',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e6-8',
      source: '6',
      target: '8',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
    {
      id: 'e7-8',
      source: '7',
      target: '8',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
    {
      id: 'e8-9',
      source: '8',
      target: '9',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
  ]

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="flex h-full w-full flex-col bg-white p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="mb-6">
        <button className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-800">
          <RiArrowLeftLine /> Back to Roadmaps
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Edit current roadmap</h1>
          <RiBookmarkLine className="text-2xl text-purple-600" />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Adjust your learning path to better match your goals. Your progress will be preserved.
        </p>
      </div>

      {/* Warning Alert */}
      {showAlert && (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-orange-200 bg-orange-50 p-4 transition-all">
          <div className="flex gap-3">
            <RiAlertLine className="mt-0.5 text-lg text-orange-500" />
            <div>
              <h4 className="font-bold text-orange-900">Edits may affect your future progress.</h4>
              <p className="text-sm text-orange-700">
                Completed topics cannot be removed. Removing prerequisites may affect topics that
                come after them.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-purple-600 hover:underline">
              Learn more
            </button>
            <button
              onClick={() => setShowAlert(false)}
              className="rounded-lg p-1 text-orange-500 transition-colors hover:bg-orange-100 hover:text-orange-700"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace (Canvas + Form) */}
      <div className="flex flex-1 flex-col gap-6 lg:flex-row min-h-150">
        {/* === LEFT: CANVAS === */}
        <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 border border-slate-200">
                <RiAddLine className="text-purple-600" /> Add topic
              </button>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 border border-slate-200">
                <RiSubtractLine className="text-red-500" /> Remove topic
              </button>
              <div className="mx-2 h-5 w-px bg-slate-200" />
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 border border-slate-200">
                <RiArrowUpLine className="text-purple-600" /> Move up
              </button>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 border border-slate-200">
                <RiArrowDownLine className="text-purple-600" /> Move down
              </button>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 border border-slate-200">
                <RiDragDropLine className="text-slate-400" /> Reorder
              </button>
            </div>
          </div>

          {/* React Flow Container */}
          <div className="relative flex-1 bg-slate-50/50">
            {/* Legend */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <RiCheckFill className="text-emerald-500 text-lg" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full border-2 border-purple-600 p-px">
                  <div className="h-full w-full rounded-full bg-purple-600" />
                </div>{' '}
                Current
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full border-2 border-slate-300" /> Upcoming
              </span>
              <span className="flex items-center gap-1.5">
                <RiLockLine className="text-slate-400 text-base" /> Locked
              </span>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#cbd5e1" gap={20} size={1} />
              <Controls className="right-4! top-4! bottom-auto! left-auto! flex! flex-row! gap-1! border-none! shadow-sm! [&>button]:bg-white! [&>button]:border! [&>button]:border-slate-200! [&>button]:rounded-md!" />
            </ReactFlow>
          </div>
        </div>

        {/* === RIGHT: TOPIC DETAILS FORM === */}
        <div className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:w-100">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Topic details</h2>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
              Preview
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="JavaScript Basics"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <div className="mt-1 text-right text-xs text-slate-400">17/80</div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
              <textarea
                rows={4}
                defaultValue="Learn core JavaScript concepts including variables, functions, data types, and basic syntax."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <div className="mt-1 text-right text-xs text-slate-400">87/400</div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Type</label>
                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none">
                  <option>Core Topic</option>
                  <option>Optional</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Estimated time
                </label>
                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none">
                  <option>4-6 weeks</option>
                  <option>1-2 weeks</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Prerequisites</label>
              <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  HTML & CSS <button className="text-slate-400 hover:text-slate-600">×</button>
                </span>
                <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  Web Fundamentals{' '}
                  <button className="text-slate-400 hover:text-slate-600">×</button>
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-sm font-bold text-slate-900">Required</p>
                <p className="text-xs text-slate-500">
                  Mark as required to keep this topic in the learning path.
                </p>
              </div>
              {/* Fake Toggle Switch */}
              <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-purple-600 p-1">
                <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area (AI Banner + Action Buttons) */}
      <div className="mt-6 flex flex-col items-end gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* AI Feedback Banner */}
        <div className="flex flex-1 items-center gap-4 rounded-xl border border-purple-100 bg-purple-50/50 p-4 w-full lg:w-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm">
            <RiSparklingFill className="text-xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900">AI feedback</h4>
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Beta
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Removing "HTML & CSS" will break the sequence. It's a key prerequisite for "JavaScript
              Basics" and later topics. Consider keeping it or moving it later instead.
            </p>
          </div>
          <div className="hidden h-10 w-px bg-purple-100 md:block" />
          <div className="hidden flex-col md:flex">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <RiArrowRightUpLine /> Suggested action
            </span>
            <p className="text-xs text-slate-500">Move "HTML & CSS" after "JavaScript Basics"</p>
          </div>
          <button className="shrink-0 rounded-lg border border-purple-200 bg-white px-4 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50">
            Apply suggestion
          </button>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-bold text-slate-700 transition hover:bg-slate-50">
            Cancel
          </button>
          <button className="rounded-xl bg-[#0B1528] px-6 py-2.5 font-bold text-white transition hover:bg-slate-800">
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
