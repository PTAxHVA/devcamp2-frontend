import { useState } from 'react'
import { BaseRoadmapNode, type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
import { useWizardStore } from '../../onboarding-store'
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
  isSubmitting?: boolean
}

const nodeTypes = { roadmapNode: BaseRoadmapNode }

export default function StepCustomize({ onComplete, isSubmitting = false }: CustomizeProps) {
  // The free-text request can't refine the (still-mock) canvas live — there is no
  // roadmap yet. Instead we persist it into the wizard answers so it is sent with
  // POST /onboarding/questionnaire (extraPreferences) and the AI suggest step uses
  // it when personalizing the real roadmap on "Confirm & Personalize".
  const aiRequest = useWizardStore((s) => (s.answers?.aiRefinement as string) ?? '')
  const setAnswer = useWizardStore((s) => s.setAnswer)

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
    <div className="animate-in fade-in flex w-full flex-col items-center duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-text-primary mb-2 text-4xl font-extrabold">Customize your Roadmap</h1>
        <p className="text-text-muted font-medium">
          Review and adjust the topics tailored for you.
        </p>
      </div>

      <div className="mb-8 flex h-150 w-full flex-col gap-6 lg:flex-row">
        <div className="border-border-soft bg-bg-section/50 relative flex h-full flex-1 overflow-hidden rounded-3xl border shadow-inner">
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

        <div className="border-border-soft flex w-full flex-col rounded-3xl border bg-white p-6 shadow-sm lg:w-105">
          <div className="bg-bg-section mb-6 flex rounded-xl p-1">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                activeTab === 'ai'
                  ? 'text-brand-purple-600 bg-white shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <RiMagicLine /> AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                activeTab === 'manual'
                  ? 'text-text-primary bg-white shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <RiListSettingsLine /> Manual Edit
            </button>
          </div>

          {activeTab === 'ai' && (
            <div className="fade-in flex flex-1 flex-col">
              <div className="bg-bg-lavender text-brand-purple-600 mb-4 flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
                <RiSparklingFill /> AI Refinement
              </div>
              <h2 className="text-text-primary mb-2 text-3xl font-extrabold">Talk to AI</h2>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed">
                Tell the AI what you want to change, add, or remove. We&apos;ll apply it when you
                personalize your roadmap.
              </p>

              <div className="relative flex flex-1 flex-col">
                <textarea
                  value={aiRequest}
                  onChange={(e) => setAnswer('aiRefinement', e.target.value.slice(0, 1000))}
                  placeholder="e.g., 'Make it more advanced', or 'I only have 2 hours a week'."
                  className="focus:border-brand-purple-500 focus:ring-brand-purple-500/50 border-border-soft bg-bg-section/50 text-text-primary placeholder:text-text-placeholder h-full w-full resize-none rounded-2xl border p-4 text-sm transition-all focus:bg-white focus:ring-2 focus:outline-none"
                />
              </div>

              <div className="border-border-soft bg-bg-section/50 text-text-secondary mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-medium">
                <RiSparklingFill className="text-brand-purple-500 mt-0.5 shrink-0" />
                Your request is applied when your roadmap is personalized. Afterwards you can
                fine-tune it anytime from “Edit current roadmap”.
              </div>
            </div>
          )}
          {activeTab === 'manual' && (
            <div className="fade-in flex flex-1 flex-col overflow-hidden">
              <h2 className="text-text-primary mb-2 text-xl font-extrabold">Manage Topics</h2>
              <p className="text-text-muted mb-4 text-sm">
                Drag on the canvas to reposition, or use the list below to add/remove topics.
              </p>

              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex flex-col gap-2">
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      className="border-border-soft bg-bg-section hover:bg-bg-section flex items-center justify-between rounded-xl border p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="text-text-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
                          {node.data.number}
                        </div>
                        <span className="text-text-primary truncate text-sm font-semibold">
                          {node.data.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveTopic(node.id)}
                        className="text-text-placeholder hover:bg-error-bg hover:text-error-text rounded-lg p-2"
                        title="Remove Topic"
                      >
                        <RiDeleteBinLine className="text-base" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-border-soft mt-4 border-t pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    placeholder="E.g. Next.js App Router"
                    className="focus:border-brand-purple-500 focus:ring-brand-purple-500 border-border-soft bg-bg-section flex-1 rounded-xl border px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:outline-none"
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

          <div className="border-border-soft mt-6 flex flex-col gap-3 border-t pt-4">
            <button
              onClick={onComplete}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <RiLoader4Line className="animate-spin text-lg" /> Personalizing...
                </>
              ) : (
                'Confirm & Personalize'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
