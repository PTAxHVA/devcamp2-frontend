import { useState, useEffect } from 'react'
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
  RiCheckFill,
  RiSparklingFill,
  RiLoader4Line,
  RiMagicLine,
  RiListSettingsLine,
  RiDeleteBinLine,
  RiAddLine,
} from 'react-icons/ri'

type BorderStyle = 'dark' | 'purple' | 'grey'

interface RoadmapNodeData extends Record<string, unknown> {
  label: string
  number: string
  borderStyle: BorderStyle
}

const RoadmapNode = ({ data }: { data: RoadmapNodeData }) => {
  return (
    <div
      className={`flex h-14 w-56 cursor-pointer items-center rounded-xl border-2 bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
      ${data.borderStyle === 'dark' ? 'border-slate-800' : ''}
      ${data.borderStyle === 'purple' ? 'border-purple-600 ring-2 ring-purple-100' : ''}
      ${data.borderStyle === 'grey' ? 'border-slate-200' : ''}
    `}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      {data.borderStyle !== 'grey' ? (
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
          ${data.borderStyle === 'purple' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'}
        `}
        >
          {data.number}
        </div>
      ) : (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <RiCheckFill className="h-3.5 w-3.5" />
        </div>
      )}

      <div
        className={`ml-2 flex-1 text-center text-sm font-bold
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
  const initialNodes: Node<RoadmapNodeData>[] = [
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
  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', style: edgeStyle },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', style: edgeStyle },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', style: edgeStyle },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: edgeStyle },
    { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', style: edgeStyle },
    { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', style: edgeStyle },
    { id: 'e4-7', source: '4', target: '7', type: 'smoothstep', style: edgeStyle },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai')
  const [newTopicTitle, setNewTopicTitle] = useState('')

  const [feedback, setFeedback] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!feedback.trim()) return

    const delayDebounceFn = setTimeout(async () => {
      setIsProcessing(true)
      try {
        const response = await fetch('/ai/roadmap-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  const rebuildEdgesAndNumbers = (currentNodes: Node<RoadmapNodeData>[]) => {
    const updatedNodes = currentNodes.map((n, i) => ({
      ...n,
      data: { ...n.data, number: (i + 1).toString() },
    }))

    const newEdges: Edge[] = []
    for (let i = 0; i < updatedNodes.length - 1; i++) {
      newEdges.push({
        id: `e${updatedNodes[i].id}-${updatedNodes[i + 1].id}`,
        source: updatedNodes[i].id,
        target: updatedNodes[i + 1].id,
        type: 'smoothstep',
        style: edgeStyle,
      })
    }

    setNodes(updatedNodes)
    setEdges(newEdges)
  }

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return

    const lastNodeY = nodes.length > 0 ? nodes[nodes.length - 1].position.y : 50
    const nextId = nodes.length > 0 ? Math.max(...nodes.map((n) => parseInt(n.id) || 0)) + 1 : 1
    const newNode: Node<RoadmapNodeData> = {
      id: nextId.toString(),
      type: 'roadmapNode',
      position: { x: 300, y: lastNodeY + 130 },
      data: { label: newTopicTitle, number: '', borderStyle: 'grey' },
    }

    rebuildEdgesAndNumbers([...nodes, newNode])
    setNewTopicTitle('')
  }

  const handleRemoveTopic = (idToRemove: string) => {
    const filteredNodes = nodes.filter((n) => n.id !== idToRemove)
    rebuildEdgesAndNumbers(filteredNodes)
  }

  return (
    <div className="flex w-full flex-col items-center duration-500 animate-in fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Customize your Roadmap</h1>
        <p className="font-medium text-slate-500">Review and adjust the topics tailored for you.</p>
      </div>

      <div className="mb-8 flex h-150 w-full flex-col gap-6 lg:flex-row">
        <div className="relative flex h-full flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/50 shadow-inner">
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
            <Controls className="bottom-4! right-4! border-0! shadow-none!" />
          </ReactFlow>
        </div>

        <div className="flex w-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:w-105">
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <RiMagicLine /> AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <RiListSettingsLine /> Manual Edit
            </button>
          </div>

          {/* TAB 1: AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="flex flex-1 flex-col fade-in">
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-600">
                <RiSparklingFill /> AI Refinement
              </div>
              <h2 className="mb-2 text-3xl font-extrabold text-slate-900">Talk to AI</h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                Not quite right? Tell the AI what you want to change, add, or remove. The roadmap
                will update automatically.
              </p>

              <div className="relative flex flex-1 flex-col">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g., 'Make it more advanced', or 'I only have 2 hours a week'."
                  className="h-full w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />

                <div
                  className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600 transition-opacity duration-300 ${
                    isProcessing ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <RiLoader4Line className="animate-spin text-base" /> Thinking...
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL EDIT */}
          {activeTab === 'manual' && (
            <div className="flex flex-1 flex-col overflow-hidden fade-in">
              <h2 className="mb-2 text-xl font-extrabold text-slate-900">Manage Topics</h2>
              <p className="mb-4 text-sm text-slate-500">
                Drag on the canvas to reposition, or use the list below to add/remove topics.
              </p>

              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex flex-col gap-2">
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                          {node.data.number}
                        </div>
                        <span className="truncate text-sm font-semibold text-slate-800">
                          {node.data.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveTopic(node.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                        title="Remove Topic"
                      >
                        <RiDeleteBinLine className="text-base" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    placeholder="E.g. Next.js App Router"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAddTopic}
                    className="flex items-center justify-center rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-800 active:scale-95"
                  >
                    <RiAddLine className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-100">
            <button className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-95">
              Confirm & Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
