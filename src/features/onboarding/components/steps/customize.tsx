import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { buildFlowGraph } from '@/features/roadmap/lib/build-flow-graph'
import { BaseRoadmapNode, type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
import { logger } from '@/lib/logger'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  RiSparklingFill,
  RiLoader4Line,
  RiMagicLine,
  RiListSettingsLine,
  RiDeleteBinLine,
  RiAddLine,
} from 'react-icons/ri'

interface CustomizeProps {
  onComplete?: () => void
}

const nodeTypes = { roadmapNode: BaseRoadmapNode }

export default function StepCustomize({ onComplete }: CustomizeProps) {
  const [aiError, setAiError] = useState<string | null>(null)

  const initialNodes: Node<BaseNodeData>[] = [
    {
      id: '1',
      type: 'roadmapNode',
      position: { x: 300, y: 50 },
      data: { label: 'Web Fundamentals', number: '1', status: 'completed', variant: 'onboarding' },
    },
    {
      id: '2',
      type: 'roadmapNode',
      position: { x: 100, y: 180 },
      data: { label: 'HTML & CSS', number: '2', status: 'completed', variant: 'onboarding' },
    },
    {
      id: '3',
      type: 'roadmapNode',
      position: { x: 500, y: 180 },
      data: { label: 'JavaScript Basics', number: '3', status: 'current', variant: 'onboarding' },
    },
    {
      id: '4',
      type: 'roadmapNode',
      position: { x: 300, y: 310 },
      data: { label: 'DOM & Events', number: '4', status: 'upcoming', variant: 'onboarding' },
    },
    {
      id: '5',
      type: 'roadmapNode',
      position: { x: 50, y: 440 },
      data: { label: 'Git & GitHub', number: '5', status: 'upcoming', variant: 'onboarding' },
    },
    {
      id: '6',
      type: 'roadmapNode',
      position: { x: 300, y: 440 },
      data: { label: 'React Basics', number: '6', status: 'upcoming', variant: 'onboarding' },
    },
    {
      id: '7',
      type: 'roadmapNode',
      position: { x: 550, y: 440 },
      data: { label: 'Components', number: '7', status: 'upcoming', variant: 'onboarding' },
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

  const { mutate: refineRoadmap, isPending: isRefining } = useMutation({
    mutationFn: async (userFeedback: string) => {
      setAiError(null)
      const response = await apiClient.post('/ai/roadmap-feedback', { feedback: userFeedback })
      return response.data
    },
    onSuccess: (data) => {
      logger.info('AI Refined Roadmap Successfully', data)

      try {
        const rawTopics = Array.isArray(data) ? data : data?.topics || []

        if (rawTopics.length > 0) {
          const { nodes: mappedNodes, edges: mappedEdges } = buildFlowGraph(rawTopics)
          setNodes(mappedNodes as Node<BaseNodeData>[])
          setEdges(mappedEdges)
        }
      } catch (error) {
        logger.error(
          'Failed to map domain data to UI:',
          error instanceof Error ? error.message : String(error),
        )
        setAiError('Please try again!')
      }
    },
    onError: (error) => {
      logger.error(
        'Failed to apply AI feedback:',
        error instanceof Error ? error.message : String(error),
      )
      setAiError('The AI Assistant is currently unavailable. Please try again in a few moments.')
    },
  })

  // Debounce gọi AI khi feedback đổi. Phụ thuộc `refineRoadmap` (reference ổn định
  // từ useMutation) thay vì cả object mutation (đổi mỗi render) để tránh effect
  // re-run mỗi render và bắn lặp vô hạn endpoint AI.
  useEffect(() => {
    if (!feedback.trim()) return

    const delayDebounceFn = setTimeout(() => {
      refineRoadmap(feedback)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [feedback, refineRoadmap])

  const rebuildEdgesAndNumbers = (
    currentNodes: Node<BaseNodeData>[],
    latestEdges: Edge[] = edges,
  ) => {
    const updatedNodes = currentNodes.map((n, i) => ({
      ...n,
      data: { ...n.data, number: (i + 1).toString() },
    }))

    const nodeIds = new Set(updatedNodes.map((n) => n.id))

    const filteredEdges = latestEdges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))

    updatedNodes.forEach((node, index) => {
      if (index === 0) return
      const hasIncomingEdge = filteredEdges.some((e) => e.target === node.id)
      if (!hasIncomingEdge) {
        const previousNode = updatedNodes[index - 1]
        filteredEdges.push({
          id: `e${previousNode.id}-${node.id}`,
          source: previousNode.id,
          target: node.id,
          type: 'smoothstep',
          style: edgeStyle,
        })
      }
    })

    setNodes(updatedNodes)
    setEdges(filteredEdges)
  }

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return

    const lastNode = nodes[nodes.length - 1]
    const lastNodeY = lastNode ? lastNode.position.y : 50
    const nextId = nodes.length > 0 ? Math.max(...nodes.map((n) => parseInt(n.id) || 0)) + 1 : 1

    const newNode: Node<BaseNodeData> = {
      id: nextId.toString(),
      type: 'roadmapNode',
      position: { x: 300, y: lastNodeY + 130 },
      data: { label: newTopicTitle, number: '', status: 'upcoming', variant: 'onboarding' },
    }

    const updatedNodes = [...nodes, newNode]

    const newEdge: Edge = {
      id: `e${lastNode?.id || '1'}-${nextId}`,
      source: lastNode?.id || '1',
      target: nextId.toString(),
      type: 'smoothstep',
      style: edgeStyle,
    }

    rebuildEdgesAndNumbers(updatedNodes, [...edges, newEdge])
    setNewTopicTitle('')
  }

  const handleRemoveTopic = (idToRemove: string) => {
    if (idToRemove === '1') return

    const filteredNodes = nodes.filter((n) => n.id !== idToRemove)
    const incomingSources = edges.filter((e) => e.target === idToRemove).map((e) => e.source)
    const outgoingTargets = edges.filter((e) => e.source === idToRemove).map((e) => e.target)
    const remainingEdges = edges.filter((e) => e.source !== idToRemove && e.target !== idToRemove)

    incomingSources.forEach((source) => {
      outgoingTargets.forEach((target) => {
        if (!remainingEdges.some((e) => e.source === source && e.target === target)) {
          remainingEdges.push({
            id: `e${source}-${target}`,
            source: source,
            target: target,
            type: 'smoothstep',
            style: edgeStyle,
          })
        }
      })
    })

    rebuildEdgesAndNumbers(filteredNodes, remainingEdges)
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
                  ? 'bg-white text-brand-purple-600 shadow-sm'
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

          {activeTab === 'ai' && (
            <div className="flex flex-1 flex-col fade-in">
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-brand-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-purple-600">
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
                  className="h-full w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:border-brand-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple-500/50"
                />

                <div
                  className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-brand-purple-50 px-3 py-1.5 text-xs font-bold text-brand-purple-600 transition-opacity duration-300 ${
                    isRefining ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <RiLoader4Line className="animate-spin text-base" /> Thinking...
                </div>
              </div>

              {aiError && (
                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
                  {aiError}
                </div>
              )}
            </div>
          )}
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
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-purple-500"
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
            <button
              onClick={onComplete}
              className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
            >
              Confirm & Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
