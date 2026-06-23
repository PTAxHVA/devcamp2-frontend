import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { BaseRoadmapNode, type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router'
import { useRoadmapDetail, type BEGraphTopic } from '@/features/roadmap/hooks/use-roadmap-detail'
import { buildFlowGraph } from '@/features/roadmap/lib/build-flow-graph'
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
  RiArrowLeftLine,
  RiBookmarkLine,
  RiAlertLine,
  RiAddLine,
  RiSubtractLine,
  RiArrowUpLine,
  RiCloseLine,
  RiArrowDownLine,
  RiSparklingFill,
  RiLoader4Line,
  RiInformationLine,
} from 'react-icons/ri'

const VERTICAL_GAP = 140
const COLUMN_X = 0
const EDGE_STYLE = { stroke: '#CBD5E1', strokeWidth: 2 }

interface AiFeedback {
  feedback: string
  severity: 'info' | 'warning'
}

interface TopicMeta {
  name: string
  status: BEGraphTopic['status']
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  /** A topic the learner has started cannot be removed (backend enforces this too). */
  hasProgress: boolean
}

const STATUS_LABEL: Record<BEGraphTopic['status'], string> = {
  completed: 'Completed',
  in_progress: 'In progress',
  available: 'Available',
  locked: 'Locked',
}

/** Pull the backend error code out of an axios error, if present. */
const errorCode = (error: unknown): string | undefined =>
  (error as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error?.code

export default function EditCurrentRoadmapPage() {
  const { id: roadmapId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const nodeTypes = useMemo(() => ({ roadmapNode: BaseRoadmapNode }), [])
  const [showAlert, setShowAlert] = useState(true)
  // On mobile the topic-details panel is a bottom sheet that opens when a node is
  // tapped; on lg+ it is a static sidebar and this flag is ignored.
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data, isLoading, isError } = useRoadmapDetail(roadmapId ?? '')

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BaseNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null)

  // Captured once from the fetched roadmap: per-topic metadata (for removal rules
  // and the details panel) and the original topic set (to diff into removeTopicIds).
  const initializedRef = useRef(false)
  const [topicMeta, setTopicMeta] = useState<Map<string, TopicMeta>>(new Map())
  const [originalIds, setOriginalIds] = useState<string[]>([])
  const [addTopicInput, setAddTopicInput] = useState('')
  const [addTopicOpen, setAddTopicOpen] = useState(false)

  // Seed the editor from real roadmap data the first time it arrives. Node ids are
  // the real MasterTopic ObjectIds, so the diff produces valid PATCH payloads.
  useEffect(() => {
    if (!data || initializedRef.current) return
    initializedRef.current = true

    const graph = buildFlowGraph(data)
    setNodes(graph.nodes)
    setEdges(graph.edges)

    const meta = new Map<string, TopicMeta>()
    for (const t of data.topics) {
      meta.set(t.masterTopicId, {
        name: t.name,
        status: t.status,
        estimatedHours: t.estimatedHours,
        sectionTotal: t.sectionTotal,
        sectionCompleted: t.sectionCompleted,
        hasProgress: t.sectionCompleted > 0,
      })
    }
    setTopicMeta(meta)
    setOriginalIds(data.topics.map((t) => t.masterTopicId))
    setSelectedId(graph.nodes[0]?.id ?? null)
  }, [data, setNodes, setEdges])

  // Topics present at load but no longer on the canvas — the PATCH removal diff.
  const removedIds = useMemo(() => {
    const present = new Set(nodes.map((n) => n.id))
    return originalIds.filter((id) => !present.has(id))
  }, [nodes, originalIds])

  const selectedMeta = selectedId ? topicMeta.get(selectedId) : undefined

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedId(node.id)
    setSheetOpen(true)
  }, [])

  // Re-number, re-stack vertically and keep the graph connected after a structural
  // change. Layout/ordering is visual only — the backend re-derives canonical order.
  const relayout = (nextNodes: Node<BaseNodeData>[]) => {
    const updated = nextNodes.map((n, i) => ({
      ...n,
      position: { x: COLUMN_X, y: i * VERTICAL_GAP },
      data: { ...n.data, number: String(i + 1) },
    }))

    const ids = new Set(updated.map((n) => n.id))
    const kept = edges.filter((e) => ids.has(e.source) && ids.has(e.target))

    updated.forEach((node, idx) => {
      if (idx === 0) return
      const hasParent = kept.some((e) => e.target === node.id)
      if (!hasParent) {
        const prev = updated[idx - 1]
        kept.push({
          id: `e-${prev.id}-${node.id}`,
          source: prev.id,
          target: node.id,
          type: 'smoothstep',
          style: EDGE_STYLE,
        })
      }
    })

    setNodes(updated)
    setEdges(kept)
  }

  const aiFeedbackMutation = useMutation({
    mutationFn: async (vars: { action: 'add' | 'remove'; topicId: string }) => {
      const res = await apiClient.post<{ data: AiFeedback }>('/ai/roadmap-feedback', {
        userRoadmapId: roadmapId,
        action: vars.action,
        topicId: vars.topicId,
      })
      return res.data.data
    },
    onSuccess: (fb) => setAiFeedback(fb),
    onError: (error) => {
      logger.error(
        'Failed to fetch AI feedback:',
        error instanceof Error ? error.message : String(error),
      )
      setAiFeedback(null)
    },
  })

  const handleRemoveTopic = () => {
    if (!selectedId) return
    const meta = topicMeta.get(selectedId)
    if (meta?.hasProgress) {
      toast.error("You can't remove a topic you've already started.")
      return
    }
    if (nodes.length <= 1) {
      toast.error('A roadmap must keep at least one topic.')
      return
    }

    const removedTopicId = selectedId
    const remaining = nodes.filter((n) => n.id !== removedTopicId)
    relayout(remaining)
    setSelectedId(remaining[0]?.id ?? null)

    // Advisory only: tell the learner what removing this topic implies.
    aiFeedbackMutation.mutate({ action: 'remove', topicId: removedTopicId })
  }

  const handleMoveUp = () => {
    if (!selectedId) return
    const idx = nodes.findIndex((n) => n.id === selectedId)
    if (idx <= 0) return
    const next = [...nodes]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    relayout(next)
  }

  const handleMoveDown = () => {
    if (!selectedId) return
    const idx = nodes.findIndex((n) => n.id === selectedId)
    if (idx < 0 || idx >= nodes.length - 1) return
    const next = [...nodes]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    relayout(next)
  }

  const handleAddTopic = () => {
    const name = addTopicInput.trim()
    if (!name) return
    const tempId = `new-${Date.now()}`
    const newNode: Node<BaseNodeData> = {
      id: tempId,
      type: 'roadmapNode',
      position: { x: COLUMN_X, y: nodes.length * VERTICAL_GAP },
      data: { number: String(nodes.length + 1), label: name, status: 'locked' },
    }
    relayout([...nodes, newNode])
    setTopicMeta((prev) => {
      const m = new Map(prev)
      m.set(tempId, {
        name,
        status: 'locked',
        estimatedHours: 0,
        sectionTotal: 0,
        sectionCompleted: 0,
        hasProgress: false,
      })
      return m
    })
    setSelectedId(tempId)
    setAddTopicInput('')
    setAddTopicOpen(false)
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const addedNames = nodes.filter((n) => n.id.startsWith('new-')).map((n) => n.data.label)
      const res = await apiClient.patch(`/roadmaps/${roadmapId}`, {
        removeTopicIds: removedIds,
        ...(addedNames.length > 0 && { addTopicNames: addedNames }),
      })
      return res.data
    },
    onSuccess: () => {
      logger.info('Roadmap changes saved successfully', roadmapId || 'unknown_id')
      toast.success('Your roadmap has been updated.')
      queryClient.invalidateQueries({ queryKey: ['roadmap-detail', roadmapId] })
      queryClient.invalidateQueries({ queryKey: ['my-roadmaps'] })
      navigate(`/roadmaps/${roadmapId}`)
    },
    onError: (error) => {
      const code = errorCode(error)
      logger.error(
        'Failed to save roadmap changes:',
        error instanceof Error ? error.message : String(error),
      )
      if (code === 'TOPIC_NOT_REMOVABLE') {
        toast.error('One of those topics has learning progress and cannot be removed.')
      } else if (code === 'ROADMAP_EMPTY') {
        toast.error('A roadmap must keep at least one topic.')
      } else {
        toast.error('Could not save your changes. Please try again.')
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="text-text-muted flex items-center gap-3">
          <RiLoader4Line className="animate-spin text-xl" /> Loading roadmap...
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-10 text-center">
        <RiAlertLine className="text-error-text text-4xl" />
        <p className="text-text-primary font-bold">Failed to load this roadmap.</p>
        <button
          onClick={() => navigate(-1)}
          className="border-border-soft text-text-secondary hover:bg-bg-section rounded-xl border px-5 py-2 font-semibold"
        >
          Go back
        </button>
      </div>
    )
  }

  const addedCount = nodes.filter((n) => n.id.startsWith('new-')).length
  const hasChanges = removedIds.length > 0 || addedCount > 0

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex h-full w-full flex-col bg-white p-6 duration-500 ease-out lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-brand-purple-600 hover:text-brand-purple-700 mb-3 flex items-center gap-2 text-sm font-semibold transition"
        >
          <RiArrowLeftLine /> Back
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-text-primary text-3xl font-bold">Edit current roadmap</h1>
          <RiBookmarkLine className="text-brand-purple-600 text-2xl" />
        </div>
      </div>

      {/* Alert Warning */}
      {showAlert && (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-orange-200 bg-orange-50 p-4 transition-all">
          <div className="flex gap-3">
            <RiAlertLine className="mt-0.5 text-lg text-orange-500" />
            <div>
              <h4 className="font-bold text-orange-900">Edits may affect your future progress.</h4>
              <p className="text-sm text-orange-700">
                Topics you have already started cannot be removed.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="rounded-lg p-1 text-orange-500 hover:bg-orange-100"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex min-h-150 flex-1 flex-col gap-6 lg:flex-row">
        {/* === CANVAS === */}
        <div className="border-border-soft flex flex-1 flex-col rounded-2xl border bg-white">
          <div className="border-border-soft flex flex-wrap items-center justify-between border-b p-4">
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setAddTopicOpen((o) => !o)}
                className="border-border-soft text-text-secondary hover:bg-bg-section flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold"
              >
                <RiAddLine /> Add topic
              </button>
              {addTopicOpen && (
                <div className="absolute top-full left-0 z-20 mt-1 flex gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-md">
                  <input
                    autoFocus
                    value={addTopicInput}
                    onChange={(e) => setAddTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTopic()
                      if (e.key === 'Escape') setAddTopicOpen(false)
                    }}
                    placeholder="Topic name…"
                    className="border-border-soft focus:border-brand-purple-500 w-52 rounded-lg border px-3 py-1.5 text-sm outline-none"
                  />
                  <button
                    onClick={handleAddTopic}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              )}
              <button
                onClick={handleRemoveTopic}
                disabled={!selectedId || selectedMeta?.hasProgress}
                className="border-border-soft text-text-secondary hover:bg-bg-section flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
              >
                <RiSubtractLine className="text-error-text" /> Remove topic
              </button>
              <div className="mx-2 h-5 w-px bg-slate-200" />
              <button
                onClick={handleMoveUp}
                disabled={!selectedId || nodes.findIndex((n) => n.id === selectedId) <= 0}
                className="border-border-soft text-text-secondary hover:bg-bg-section flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
              >
                <RiArrowUpLine /> Move up
              </button>
              <button
                onClick={handleMoveDown}
                disabled={
                  !selectedId || nodes.findIndex((n) => n.id === selectedId) >= nodes.length - 1
                }
                className="border-border-soft text-text-secondary hover:bg-bg-section flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
              >
                <RiArrowDownLine /> Move down
              </button>
            </div>
          </div>

          <div className="bg-bg-section/50 relative flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#cbd5e1" gap={20} size={1} />
              <Controls className="top-4! right-4! bottom-auto! flex! flex-row! gap-1! border-none! shadow-sm!" />
            </ReactFlow>
          </div>
        </div>

        {/* Backdrop for the mobile bottom sheet */}
        {sheetOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSheetOpen(false)}
            aria-hidden
          />
        )}

        {/* === TOPIC DETAILS (read-only) ===
            Mobile: bottom sheet that slides up. Desktop (lg+): static sidebar. */}
        <div
          className={`border-border-soft flex flex-col border bg-white shadow-sm transition-transform duration-300 ease-out lg:static! lg:z-auto lg:max-h-none lg:w-100 lg:translate-y-0 lg:overflow-visible lg:rounded-2xl ${
            sheetOpen ? 'translate-y-0' : 'translate-y-full'
          } fixed inset-x-0 bottom-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-2xl p-6`}
        >
          {/* Mobile sheet header: drag handle + close */}
          <div className="relative mb-4 lg:hidden">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
            <button
              onClick={() => setSheetOpen(false)}
              aria-label="Close topic details"
              className="text-text-placeholder hover:bg-bg-section absolute -top-2 right-0 rounded-lg p-1"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>
          <h2 className="text-text-primary mb-6 text-lg font-bold">Topic details</h2>

          {selectedMeta ? (
            <div className="flex flex-1 flex-col gap-5">
              <div>
                <p className="text-text-secondary mb-1.5 text-sm font-bold">Title</p>
                <p className="text-text-primary text-base font-semibold">{selectedMeta.name}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-text-secondary mb-1.5 text-sm font-bold">Status</p>
                  <span className="bg-bg-section text-text-primary inline-block rounded-lg px-3 py-1 text-sm font-semibold">
                    {STATUS_LABEL[selectedMeta.status]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-text-secondary mb-1.5 text-sm font-bold">Estimated time</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {selectedMeta.estimatedHours} hrs
                  </p>
                </div>
              </div>

              <div>
                <p className="text-text-secondary mb-1.5 text-sm font-bold">Sections</p>
                <p className="text-text-primary text-sm font-semibold">
                  {selectedMeta.sectionCompleted} / {selectedMeta.sectionTotal} completed
                </p>
              </div>

              <div className="border-border-soft mt-auto border-t pt-4">
                {selectedMeta.hasProgress ? (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    You have already started this topic, so it can&apos;t be removed.
                  </p>
                ) : (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    Use the toolbar to remove or reorder this topic.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-text-placeholder flex flex-1 items-center justify-center text-sm">
              Select a topic on the canvas to see its details.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-end gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          className={`flex w-full flex-1 items-center gap-4 rounded-xl border p-4 lg:w-auto ${
            aiFeedback?.severity === 'warning'
              ? 'border-orange-200 bg-orange-50'
              : 'border-border-purple bg-bg-lavender/50'
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${
              aiFeedback?.severity === 'warning' ? 'text-orange-500' : 'text-brand-purple-600'
            }`}
          >
            {aiFeedbackMutation.isPending ? (
              <RiLoader4Line className="animate-spin text-xl" />
            ) : (
              <RiSparklingFill className="text-xl" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-text-primary font-bold">AI feedback</h4>
              <span className="bg-bg-lavender text-brand-purple-700 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                Beta
              </span>
            </div>
            <p className="text-text-secondary text-xs">
              {aiFeedbackMutation.isPending
                ? 'Reviewing your change...'
                : aiFeedback
                  ? aiFeedback.feedback
                  : 'Remove a topic and the AI will tell you how it affects your path.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="border-border-soft text-text-secondary hover:bg-bg-section rounded-xl border bg-white px-6 py-2.5 font-bold transition"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !hasChanges}
            className="flex items-center gap-2 rounded-xl bg-[#0B1528] px-6 py-2.5 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saveMutation.isPending && <RiLoader4Line className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
