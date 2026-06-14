import { useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { RiCheckFill, RiSparklingFill, RiLoader4Line } from 'react-icons/ri'

type BorderStyle = 'dark' | 'purple' | 'grey'

interface RoadmapNodeData {
  label: string
  number: string
  borderStyle: BorderStyle
}

const RoadmapNode = ({ data }: { data: RoadmapNodeData }) => {
  return (
    <div
      className={`w-56 h-14 bg-white flex items-center px-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer
      ${data.borderStyle === 'dark' ? 'border-slate-800' : ''}
      ${data.borderStyle === 'purple' ? 'border-purple-600 ring-2 ring-purple-100' : ''}
      ${data.borderStyle === 'grey' ? 'border-slate-200' : ''}
    `}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      {data.borderStyle !== 'grey' ? (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
          ${data.borderStyle === 'purple' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'}
        `}
        >
          {data.number}
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
          <RiCheckFill className="w-3.5 h-3.5" />
        </div>
      )}

      <div
        className={`flex-1 text-center font-bold text-sm ml-2
        ${data.borderStyle === 'purple' ? 'text-purple-700' : 'text-slate-800'}
      `}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  )
}

const nodeTypes = { roadmapNode: RoadmapNode }

export const StepCustomize = () => {
  const initialNodes = [
    {
      id: '1',
      type: 'roadmapNode',
      position: { x: 300, y: 50 },
      data: { label: 'Web Fundamentals', number: '1', borderStyle: 'dark' },
    },
    {
      id: '2',
      type: 'roadmapNode',
      position: { x: 100, y: 180 },
      data: { label: 'HTML & CSS', number: '2', borderStyle: 'dark' },
    },
    {
      id: '3',
      type: 'roadmapNode',
      position: { x: 500, y: 180 },
      data: { label: 'JavaScript Basics', number: '3', borderStyle: 'purple' },
    },
    {
      id: '4',
      type: 'roadmapNode',
      position: { x: 300, y: 310 },
      data: { label: 'DOM & Events', number: '4', borderStyle: 'grey' },
    },
    {
      id: '5',
      type: 'roadmapNode',
      position: { x: 50, y: 440 },
      data: { label: 'Git & GitHub', number: '5', borderStyle: 'grey' },
    },
    {
      id: '6',
      type: 'roadmapNode',
      position: { x: 300, y: 440 },
      data: { label: 'React Basics', number: '6', borderStyle: 'grey' },
    },
    {
      id: '7',
      type: 'roadmapNode',
      position: { x: 550, y: 440 },
      data: { label: 'Components', number: '7', borderStyle: 'grey' },
    },
  ]

  const edgeStyle = { stroke: '#CBD5E1', strokeWidth: 2, strokeDasharray: '0' }
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', style: edgeStyle },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', style: edgeStyle },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', style: edgeStyle },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: edgeStyle },
    { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', style: edgeStyle },
    { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', style: edgeStyle },
    { id: 'e4-7', source: '4', target: '7', type: 'smoothstep', style: edgeStyle },
  ]

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const [feedback, setFeedback] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!feedback.trim()) return

    const delayDebounceFn = setTimeout(async () => {
      setIsProcessing(true)

      try {
        const response = await fetch('/ai/roadmap-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedback }),
        })

        if (!response.ok) throw new Error('API error')

        const data = await response.json()

        console.log('AI Updated Roadmap:', data)
      } catch (error) {
        console.error('Failed to update roadmap:', error)
      } finally {
        setIsProcessing(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [feedback])

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Customize your Roadmap</h1>
        <p className="text-slate-500 font-medium">Review and adjust the topics tailored for you.</p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6 mb-8 h-150">
        {/* ================= CANVAS ================= */}
        <div className="flex-1 border border-slate-200 rounded-3xl bg-slate-50/50 relative shadow-inner overflow-hidden h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#94a3b8" gap={20} size={1} />
            <Controls className="right-4! bottom-4! border-0! shadow-none!" />
          </ReactFlow>
        </div>

        {/* ================= AI FEEDBACK PANEL ================= */}
        <div className="w-full lg:w-95 border border-slate-200 rounded-3xl bg-white p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-purple-600 mb-4 bg-purple-50 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">
            <RiSparklingFill /> AI Assistant
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Refine Roadmap</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            Not quite right? Tell the AI what you want to change, add, or remove. The roadmap will
            update automatically.
          </p>

          <div className="flex-1 flex flex-col relative">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., 'Make it more advanced', 'Add TypeScript to the learning path', or 'I only have 2 hours a week'."
              className="w-full h-full resize-none border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-slate-50/50 focus:bg-white"
            />

            {/* Loading Indicator */}
            <div
              className={`absolute bottom-4 right-4 flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full transition-opacity duration-300 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}
            >
              <RiLoader4Line className="animate-spin text-base" /> Thinking...
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all active:scale-95">
              Confirm & Generate
            </button>
            <button className="w-full text-slate-500 hover:text-slate-800 py-3 font-semibold text-sm transition-all">
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
