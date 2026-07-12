import { useMemo, useState, useEffect, useRef, type RefObject } from 'react'
import { BaseRoadmapNode, type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router'
import { useRoadmapDetail, type BEGraphTopic } from '@/features/roadmap/hooks/use-roadmap-detail'
import {
  useAvailableTopics,
  type AvailableTopic,
} from '@/features/roadmap/hooks/use-available-topics'
import { useMasterRoadmap } from '@/features/roadmap/hooks/use-master-roadmap'
import { useMasterRoadmapGraph } from '@/features/roadmap/hooks/use-master-roadmap-graph'
import { buildFlowGraph } from '@/features/roadmap/lib/build-flow-graph'
import { buildEditorLayout } from './lib/build-editor-layout'
import { resolveAiFeedbackView, type AiFeedbackData } from './lib/resolve-ai-feedback-view'
import {
  findDependentTopicIds,
  insertAtIndex,
  resolveOnCanvasPrereqNames,
} from './lib/editor-remove-ops'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useReactFlow,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiAlertLine,
  RiSubtractLine,
  RiAddLine,
  RiCloseLine,
  RiSparklingFill,
  RiLoader4Line,
  RiInformationLine,
  RiLockLine,
} from 'react-icons/ri'

interface TopicMeta {
  name: string
  status: BEGraphTopic['status']
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  /** A topic the learner has started cannot be removed (backend enforces this too). */
  hasProgress: boolean
  /** MasterTopic ids this topic depends on — shown in the details panel and used to
   *  guard removals (you can't drop a topic another on-canvas topic requires). */
  prerequisiteTopicIds: string[]
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

// Keep the whole fork (chosen column + inline ghost branches) framed in the canvas
// at every viewport. The top padding reserves screen space so the first node never
// hides under the fit-view Controls overlay (top-left of the canvas); the percent
// sides give breathing room; maxZoom 1 stops a small (non-forked) roadmap from
// blowing up past 100%.
const FIT_VIEW_OPTIONS = {
  padding: { top: '64px', right: '8%', bottom: '8%', left: '8%' },
  maxZoom: 1,
} as const

/**
 * Re-fits the React Flow viewport so the fork is never clipped. The fork can be
 * ~3 node-columns wide, so a narrow canvas needs a small zoom to show it whole;
 * the plain `fitView` prop only runs once on mount (before the async nodes land),
 * so we re-fit here whenever the node set OR the canvas size changes.
 * Rendered inside <ReactFlow> so it can read the flow instance via useReactFlow.
 */
function FitViewController({
  wrapperRef,
  signature,
}: {
  wrapperRef: RefObject<HTMLDivElement | null>
  signature: string
}) {
  const { fitView } = useReactFlow()

  // Node set changed: initial async load, add topic, remove topic, add-in-parallel
  // ghost. rAF lets React Flow measure the new nodes before we frame them.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      void fitView(FIT_VIEW_OPTIONS)
    })
    return () => cancelAnimationFrame(raf)
  }, [signature, fitView])

  // Canvas resized: viewport/orientation change, the mobile↔desktop and lg↔xl
  // breakpoint reflows, or the alert card being dismissed. Debounced via rAF.
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    let raf = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        void fitView(FIT_VIEW_OPTIONS)
      })
    })
    observer.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [wrapperRef, fitView])

  return null
}

export default function EditCurrentRoadmapPage() {
  const { id: roadmapId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const nodeTypes = useMemo(() => ({ roadmapNode: BaseRoadmapNode }), [])
  // The canvas wrapper — observed so the graph re-fits when its size changes.
  const flowWrapperRef = useRef<HTMLDivElement>(null)
  const [showAlert, setShowAlert] = useState(true)
  // Below xl the topic-details panel is a bottom sheet that opens when a node is
  // tapped; on xl+ it is a static sidebar and this flag is ignored.
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const { data, isLoading, isError } = useRoadmapDetail(roadmapId ?? '')
  const { data: availableTopics, isLoading: isLoadingTopics } = useAvailableTopics(roadmapId ?? '')
  // Master branches carry the fork metadata (selectionGroup + topicIds) that
  // powers the "Learning path" switch card for forked roadmaps.
  const { data: masterPreview } = useMasterRoadmap(data?.roadmap.masterRoadmapId)
  // The all-branches master graph resolves a ghost branch's topics when the learner
  // clicks "+ Add" to learn it in parallel (see handleAddGhostBranch). The ghost
  // NODES themselves are derived from the branch metadata by buildEditorLayout.
  const { data: masterGraph } = useMasterRoadmapGraph(data?.roadmap.masterRoadmapId)

  const [nodes, setNodes] = useNodesState<Node<BaseNodeData>>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackData | null>(null)
  const [aiError, setAiError] = useState(false)

  // Captured once from the fetched roadmap: per-topic metadata (for removal rules
  // and the details panel) and the original topic set (to diff into removeTopicIds).
  const initializedRef = useRef(false)
  // The id of the outstanding "Removed … / Undo" toast, if any. A single undo is live
  // at a time: any later structural change (add/remove/add-branch) dismisses it, so
  // undo can never restore a stale snapshot on top of newer edits.
  const undoToastIdRef = useRef<string | null>(null)
  const [topicMeta, setTopicMeta] = useState<Map<string, TopicMeta>>(new Map())
  const [originalIds, setOriginalIds] = useState<string[]>([])
  // Seed the editor from real roadmap data the first time it arrives. Node ids are
  // the real MasterTopic ObjectIds, so the diff produces valid PATCH payloads.
  useEffect(() => {
    if (!data || initializedRef.current) return
    initializedRef.current = true

    // neverLocked: the editor shows every topic as editable, never a dashed "lock".
    // Positions, fork rows, ghosts and edges are derived below by buildEditorLayout.
    const graph = buildFlowGraph(data, { neverLocked: true })
    setNodes(graph.nodes)

    const meta = new Map<string, TopicMeta>()
    for (const t of data.topics) {
      meta.set(t.masterTopicId, {
        name: t.name,
        status: t.status,
        estimatedHours: t.estimatedHours,
        sectionTotal: t.sectionTotal,
        sectionCompleted: t.sectionCompleted,
        hasProgress: t.sectionCompleted > 0,
        prerequisiteTopicIds: t.prerequisiteTopicIds ?? [],
      })
    }
    setTopicMeta(meta)
    setOriginalIds(data.topics.map((t) => t.masterTopicId))
    setSelectedId(graph.nodes[0]?.id ?? null)
  }, [data, setNodes])

  // Topics present at load but no longer on the canvas — the PATCH removal diff.
  const removedIds = useMemo(() => {
    const present = new Set(nodes.map((n) => n.id))
    return originalIds.filter((id) => !present.has(id))
  }, [nodes, originalIds])

  // Topics on canvas that were NOT in the original load — queued to add on save.
  const addedIds = useMemo(() => {
    const origSet = new Set(originalIds)
    return nodes.map((n) => n.id).filter((id) => !origSet.has(id))
  }, [nodes, originalIds])

  // Available topics that aren't already on the canvas (original or newly added).
  const canvasIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes])
  const filteredAvailableTopics = useMemo(
    () => (availableTopics ?? []).filter((t) => !canvasIds.has(t.masterTopicId)),
    [availableTopics, canvasIds],
  )

  // Fork-aware display layout: enrolled topics as a vertical column, with the chosen
  // fork branch badged in-column and the unchosen branches inline to its right as
  // add-in-parallel "ghost" cards under a "Choose one" pill. Derived purely from the
  // canvas topics + the roadmap's branches, so a non-forked roadmap renders as a
  // plain column exactly as before.
  const { nodes: displayNodes, edges: displayEdges } = useMemo(
    () =>
      buildEditorLayout({
        canvasTopics: nodes.map((n) => ({ id: n.id, label: n.data.label, status: n.data.status })),
        branches: masterPreview?.branches,
      }),
    [nodes, masterPreview],
  )

  // A stable signature of the displayed node set — changes on load, add, remove,
  // or add-in-parallel — so FitViewController can re-frame the canvas.
  const nodeSignature = useMemo(() => displayNodes.map((n) => n.id).join('|'), [displayNodes])

  const selectedMeta = selectedId ? topicMeta.get(selectedId) : undefined

  // Prerequisite topics of the selected topic, resolved to names (only those still
  // on the canvas can be named). Surfaces the dependency the graph edges imply.
  const selectedPrereqNames = useMemo(
    () =>
      resolveOnCanvasPrereqNames(
        selectedMeta?.prerequisiteTopicIds,
        (id) => canvasIds.has(id),
        (id) => topicMeta.get(id)?.name,
      ),
    [selectedMeta, topicMeta, canvasIds],
  )

  // Topics still on the canvas that list the selected topic as a prerequisite — used
  // to warn that removing it would break their chain.
  const selectedRequiredByNames = useMemo(
    () =>
      selectedId
        ? findDependentTopicIds(
            nodes.map((n) => n.id),
            (id) => topicMeta.get(id)?.prerequisiteTopicIds,
            selectedId,
          )
            .map((id) => topicMeta.get(id)?.name)
            .filter((name): name is string => !!name)
        : [],
    [selectedId, nodes, topicMeta],
  )

  // Update the canvas topic set + order after a structural change. Positions,
  // numbering, fork rows, ghosts and edges are all derived from `nodes` by
  // buildEditorLayout (display), so this just keeps `nodes` as the ordered
  // membership list that the save diff (added/removed ids) reads.
  const relayout = (nextNodes: Node<BaseNodeData>[]) => setNodes(nextNodes)

  const aiFeedbackMutation = useMutation({
    mutationFn: async (vars: { action: 'add' | 'remove'; topicId: string }) => {
      const res = await apiClient.post<{ data: AiFeedbackData }>('/ai/roadmap-feedback', {
        userRoadmapId: roadmapId,
        action: vars.action,
        topicId: vars.topicId,
      })
      return res.data.data
    },
    onMutate: () => setAiError(false),
    onSuccess: (fb) => {
      setAiFeedback(fb)
      setAiError(false)
    },
    onError: (error) => {
      // Surface the failure in the card (see resolveAiFeedbackView) instead of
      // silently blanking it, which read as "the AI did nothing".
      logger.error(
        'Failed to fetch AI feedback:',
        error instanceof Error ? error.message : String(error),
      )
      setAiError(true)
    },
  })

  // Dismiss the outstanding undo toast, if any. Called before every structural change
  // so a stale undo can never fire against a canvas that has since moved on.
  const dismissUndo = () => {
    if (undoToastIdRef.current) {
      toast.dismiss(undoToastIdRef.current)
      undoToastIdRef.current = null
    }
  }

  const handleRemoveTopic = () => {
    if (!selectedId) return
    const meta = topicMeta.get(selectedId)
    if (meta?.hasProgress) {
      toast.error("You can't remove a topic you've already started.")
      return
    }
    // Guard the prerequisite chain: refuse to remove a topic that another topic
    // still on the canvas depends on, and name the dependents so the reason is clear.
    const dependentIds = findDependentTopicIds(
      nodes.map((n) => n.id),
      (id) => topicMeta.get(id)?.prerequisiteTopicIds,
      selectedId,
    )
    if (dependentIds.length > 0) {
      const names = dependentIds.map((id) => topicMeta.get(id)?.name ?? 'another topic')
      toast.error(`Required by ${names.join(', ')} — remove those first.`)
      return
    }
    if (nodes.length <= 1) {
      toast.error('A roadmap must keep at least one topic.')
      return
    }

    dismissUndo()
    const removedTopicId = selectedId
    const removedName = meta?.name ?? 'Topic'
    // Remember the removed node and its column position so undo can splice it back
    // exactly where it was, rather than restoring a full-canvas snapshot that would
    // clobber any edits made in the undo window. Display + edges are re-derived.
    const removedIndex = nodes.findIndex((n) => n.id === removedTopicId)
    // Unreachable today (selectedId is always a real on-canvas node id), but guards a
    // future mutation path that forgets to keep selectedId in sync: splicing an
    // undefined node back in on undo would hard-crash the next render.
    if (removedIndex === -1) return
    const removedNode = nodes[removedIndex]
    const remaining = nodes.filter((n) => n.id !== removedTopicId)
    relayout(remaining)
    setSelectedId(remaining[0]?.id ?? null)

    // Advisory only: tell the learner what removing this topic implies.
    aiFeedbackMutation.mutate({ action: 'remove', topicId: removedTopicId })

    const toastId = toast(
      () => (
        <span className="flex items-center gap-3">
          <span className="text-sm">
            Removed <span className="font-semibold">{removedName}</span>.
          </span>
          <button
            onClick={() => {
              // Splice the removed node back at its original slot. No structural change
              // can have happened since (any would have dismissed this toast), so
              // `remaining` is still the live canvas; the display is re-derived.
              relayout(insertAtIndex(remaining, removedNode, removedIndex))
              setSelectedId(removedTopicId)
              dismissUndo()
            }}
            className="text-brand-purple-600 hover:text-brand-purple-700 shrink-0 text-sm font-bold"
          >
            Undo
          </button>
        </span>
      ),
      { icon: <RiSubtractLine className="text-error-text" />, duration: 6000 },
    )
    undoToastIdRef.current = toastId
  }

  const handleAddTopic = (topic: AvailableTopic) => {
    dismissUndo()
    const newNode: Node<BaseNodeData> = {
      id: topic.masterTopicId,
      type: 'roadmapNode',
      position: { x: 0, y: 0 }, // display position is derived by buildEditorLayout
      data: { label: topic.name, status: 'upcoming' },
    }
    setTopicMeta((prev) => {
      const next = new Map(prev)
      next.set(topic.masterTopicId, {
        name: topic.name,
        status: 'available',
        estimatedHours: topic.estimatedHours,
        sectionTotal: topic.sectionTotal,
        sectionCompleted: 0,
        hasProgress: false,
        // Symmetric prereq guard: once /available-topics returns prerequisiteTopicIds,
        // a picker-added topic's prerequisites are protected too. Defaults to [] until
        // the backend field lands.
        prerequisiteTopicIds: topic.prerequisiteTopicIds ?? [],
      })
      return next
    })
    relayout([...nodes, newNode])
    setSelectedId(topic.masterTopicId)
    aiFeedbackMutation.mutate({ action: 'add', topicId: topic.masterTopicId })
  }

  // Add every not-yet-enrolled topic of a ghost branch to the canvas in one pass —
  // learn it in parallel (keeps the current path, only adds). Save persists it via the
  // normal PATCH addTopicIds. Fires AI feedback once so the branch-conflict warning
  // (two frameworks at once) surfaces, degrading to data when Gemini is down.
  const handleAddGhostBranch = (branchId?: string, branchName?: string) => {
    if (!branchId) return
    // The ghost card renders from the branch list, but adding its topics needs the
    // heavier all-branches graph. If that hasn't loaded yet (or the endpoint is cold),
    // tell the learner instead of dead-clicking — mirrors the switch-path panel.
    if (!masterGraph) {
      toast.error('Still loading the other paths — try again in a moment.')
      return
    }
    const branch = masterPreview?.branches.find((b) => b._id === branchId)
    if (!branch?.topicIds?.length) return
    const canvas = new Set(nodes.map((n) => n.id))
    const topicById = new Map(masterGraph.topics.map((t) => [t.masterTopicId, t]))
    const toAdd = branch.topicIds
      .map((id) => topicById.get(id))
      .filter((t): t is BEGraphTopic => !!t && !canvas.has(t.masterTopicId))
    if (toAdd.length === 0) return

    dismissUndo()
    setTopicMeta((prev) => {
      const next = new Map(prev)
      for (const t of toAdd) {
        next.set(t.masterTopicId, {
          name: t.name,
          status: 'available',
          estimatedHours: t.estimatedHours,
          sectionTotal: t.sectionTotal,
          sectionCompleted: 0,
          hasProgress: false,
          prerequisiteTopicIds: t.prerequisiteTopicIds ?? [],
        })
      }
      return next
    })

    const newNodes: Node<BaseNodeData>[] = toAdd.map((t) => ({
      id: t.masterTopicId,
      type: 'roadmapNode',
      position: { x: 0, y: 0 }, // display position is derived by buildEditorLayout
      data: { label: t.name, status: 'upcoming' },
    }))
    relayout([...nodes, ...newNodes])
    setSelectedId(toAdd[0].masterTopicId)
    aiFeedbackMutation.mutate({ action: 'add', topicId: toAdd[0].masterTopicId })
    toast.success(`Added the ${branchName ?? branch.name} path — press Save changes to apply.`)
  }

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    // The "choose one" pill is an inert label, not a topic — ignore clicks on it.
    if (node.id.startsWith('fork-label:')) return
    // A ghost node = an unchosen fork branch. Clicking it adds that branch in parallel;
    // a real topic node just opens its details.
    if (node.id.startsWith('ghost:')) {
      const ghostData = node.data as BaseNodeData
      handleAddGhostBranch(ghostData.branchId, ghostData.branchName)
      return
    }
    setSelectedId(node.id)
    setSheetOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch(`/roadmaps/${roadmapId}`, {
        addTopicIds: addedIds,
        removeTopicIds: removedIds,
      })
      return res.data
    },
    onSuccess: () => {
      logger.info('Roadmap changes saved successfully', roadmapId || 'unknown_id')
      toast.success('Your roadmap has been updated.')
      queryClient.invalidateQueries({ queryKey: ['roadmap-detail', roadmapId] })
      queryClient.invalidateQueries({ queryKey: ['my-roadmaps'] })
      queryClient.invalidateQueries({ queryKey: ['available-topics', roadmapId] })
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
          className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-xl border px-5 py-2 font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Go back
        </button>
      </div>
    )
  }

  const hasChanges = removedIds.length > 0 || addedIds.length > 0
  const aiView = resolveAiFeedbackView({
    pending: aiFeedbackMutation.isPending,
    error: aiError,
    feedback: aiFeedback,
  })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 bg-bg-card flex h-full w-full flex-col p-6 duration-500 ease-out lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-brand-purple-600 hover:text-brand-purple-700 focus-visible:ring-brand-purple-300 mb-3 flex items-center gap-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
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
        <div className="mb-6 flex items-start justify-between rounded-xl border border-orange-200 bg-orange-50 p-4">
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
            className="focus-visible:ring-brand-purple-300 rounded-lg p-1 text-orange-500 transition-colors duration-200 hover:bg-orange-100 focus-visible:ring-2 focus-visible:outline-none"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>
      )}

      {/* AI feedback (F19) — surfaced above the canvas so it's visible right after an
          edit, with an explicit busy/error state instead of silently blanking out. */}
      <div
        className={`mb-6 flex items-start gap-4 rounded-xl border p-4 ${
          aiView.tone === 'warning'
            ? 'border-orange-200 bg-orange-50'
            : 'border-border-purple bg-bg-lavender/50'
        }`}
      >
        <div
          className={`bg-bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${
            aiView.tone === 'warning' ? 'text-orange-500' : 'text-brand-purple-600'
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
          <p className="text-text-secondary text-sm text-wrap break-words">{aiView.message}</p>
          {aiView.note && (
            <p className="text-text-muted mt-1 flex items-start gap-1.5 text-xs">
              <RiInformationLine className="mt-0.5 shrink-0" />
              {aiView.note}
            </p>
          )}
        </div>
      </div>

      {/* Main Container — canvas keeps full width until xl (1280px); below that the
          topic details open as a tap-to-reveal bottom sheet so the fork stays
          readable on tablets/small laptops (~1024px) instead of being squeezed by
          a side panel. Two-column layout only where there's room for both. */}
      <div className="flex min-h-150 flex-1 flex-col gap-6 xl:flex-row">
        {/* === CANVAS === */}
        <div className="border-border-soft bg-bg-card flex flex-1 flex-col rounded-2xl border">
          <div className="border-border-soft flex flex-wrap items-center justify-between border-b p-4">
            <div className="relative flex items-center gap-2">
              <button
                onClick={handleRemoveTopic}
                disabled={!selectedId || selectedMeta?.hasProgress}
                className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
              >
                <RiSubtractLine className="text-error-text" /> Remove topic
              </button>

              <button
                onClick={() => setPickerOpen((o) => !o)}
                className={`border-border-soft focus-visible:ring-brand-purple-300 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none ${pickerOpen ? 'bg-brand-purple-600 text-white' : 'text-text-secondary hover:bg-bg-section'}`}
              >
                <RiAddLine /> Add topic
              </button>

              {pickerOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
                  <div className="border-border-soft bg-bg-card absolute top-full left-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border shadow-lg">
                    <div className="border-border-soft flex items-center justify-between border-b px-4 py-3">
                      <h3 className="text-text-primary text-sm font-bold">Add Topics</h3>
                      <button
                        onClick={() => setPickerOpen(false)}
                        className="text-text-placeholder hover:text-text-secondary focus-visible:ring-brand-purple-300 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <RiCloseLine className="text-xl" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {isLoadingTopics ? (
                        <div className="flex items-center justify-center py-8">
                          <RiLoader4Line className="text-text-muted animate-spin text-xl" />
                        </div>
                      ) : filteredAvailableTopics.length === 0 ? (
                        <p className="text-text-muted py-8 text-center text-sm">
                          No more topics to add.
                        </p>
                      ) : (
                        <ul className="p-2">
                          {filteredAvailableTopics.map((topic) => (
                            <li
                              key={topic.masterTopicId}
                              className="hover:bg-bg-section flex items-center justify-between gap-3 rounded-lg p-3 transition-colors duration-200"
                            >
                              <div className="min-w-0">
                                <p className="text-text-primary truncate text-sm font-semibold">
                                  {topic.name}
                                </p>
                                <p className="text-text-muted text-xs">
                                  {topic.estimatedHours}h · {topic.sectionTotal} sections
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddTopic(topic)}
                                className="text-brand-purple-600 hover:bg-bg-lavender focus-visible:ring-brand-purple-300 flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                              >
                                <RiAddLine /> Add
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* isolate = a stacking context scoped to THIS canvas so React Flow's high
              internal z-indexes stay contained and can't paint over the app sidebar.
              Scoped here (not on the global layout wrapper) so page modals are unaffected. */}
          <div ref={flowWrapperRef} className="bg-bg-section/50 relative isolate flex-1">
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              fitView
              fitViewOptions={FIT_VIEW_OPTIONS}
              // A ~3-column-wide fork can't fit a narrow canvas at the default
              // minZoom (0.5) — it clips the column left and the last ghost right.
              // Allow a smaller zoom so fitView always frames the whole fork.
              minZoom={0.2}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
            >
              <FitViewController wrapperRef={flowWrapperRef} signature={nodeSignature} />
              <Background color="#cbd5e1" gap={20} size={1} />
              {/* Same fit options as the auto-fit so the manual fit-view button frames
                  the whole fork and clears the Controls too. */}
              <Controls
                position="top-right"
                fitViewOptions={FIT_VIEW_OPTIONS}
                className="flex! flex-row! gap-1! border-none! shadow-sm!"
              />
            </ReactFlow>
          </div>
        </div>

        {/* Backdrop for the mobile bottom sheet */}
        {sheetOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 xl:hidden"
            onClick={() => setSheetOpen(false)}
            aria-hidden
          />
        )}

        {/* === TOPIC DETAILS (read-only) ===
            Below xl: bottom sheet that slides up. xl+: static sidebar. */}
        <div
          className={`border-border-soft bg-bg-card flex flex-col border shadow-sm transition-transform duration-300 ease-out xl:static! xl:z-auto xl:max-h-none xl:w-100 xl:translate-y-0 xl:overflow-visible xl:rounded-2xl ${
            sheetOpen ? 'translate-y-0' : 'translate-y-full'
          } fixed inset-x-0 bottom-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-2xl p-6`}
        >
          {/* Mobile/tablet sheet header: drag handle + close (hidden once the panel
              becomes a static sidebar at xl). */}
          <div className="relative mb-4 xl:hidden">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
            <button
              onClick={() => setSheetOpen(false)}
              aria-label="Close topic details"
              className="text-text-placeholder hover:bg-bg-section focus-visible:ring-brand-purple-300 absolute -top-2 right-0 rounded-lg p-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
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

              <div>
                <p className="text-text-secondary mb-1.5 text-sm font-bold">Prerequisites</p>
                {selectedPrereqNames.length > 0 ? (
                  <ul className="flex flex-wrap gap-1.5">
                    {selectedPrereqNames.map((name) => (
                      <li
                        key={name}
                        className="border-border-soft text-text-secondary inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold"
                      >
                        <RiLockLine className="text-text-placeholder text-xs" />
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-text-muted text-sm">None — this topic has no prerequisites.</p>
                )}
              </div>

              <div className="border-border-soft mt-auto border-t pt-4">
                {selectedMeta.hasProgress ? (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    You have already started this topic, so it can&apos;t be removed.
                  </p>
                ) : selectedRequiredByNames.length > 0 ? (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    Required by {selectedRequiredByNames.join(', ')} — remove those first.
                  </p>
                ) : (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    Use the toolbar to remove this topic.
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

      {/* Footer — the AI feedback card now lives above the canvas. */}
      <div className="mt-6 flex justify-end">
        <div className="flex w-full gap-3 sm:w-100">
          <button
            onClick={() => navigate(-1)}
            className="border-border-soft text-text-secondary hover:bg-bg-section bg-bg-card focus-visible:ring-brand-purple-300 flex flex-1 items-center justify-center rounded-xl border py-2.5 font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !hasChanges}
            className="focus-visible:ring-brand-purple-300 flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B1528] py-2.5 font-bold text-white transition-colors duration-200 hover:bg-slate-800 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
          >
            {saveMutation.isPending && <RiLoader4Line className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
