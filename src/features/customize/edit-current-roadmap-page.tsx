import { useMemo, useState, useEffect, useRef, type RefObject } from 'react'
import { BaseRoadmapNode, type NodeStatus } from '@/features/roadmap/components/base-roadmap-node'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router'
import { useRoadmapDetail } from '@/features/roadmap/hooks/use-roadmap-detail'
import { useMasterRoadmap } from '@/features/roadmap/hooks/use-master-roadmap'
import { useMasterRoadmapGraph } from '@/features/roadmap/hooks/use-master-roadmap-graph'
import { buildEditorLayout, type EditorTopic } from './lib/build-editor-layout'
import { resolveAiFeedbackView, type AiFeedbackData } from './lib/resolve-ai-feedback-view'
import { resolveOnCanvasPrereqNames } from './lib/editor-remove-ops'
import { computeMembershipDiff, canRemoveTopic, resolveAddBlocker } from './lib/membership-ops'
import { ReactFlow, Background, Controls, useReactFlow, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiAlertLine,
  RiSubtractLine,
  RiAddLine,
  RiArrowGoBackLine,
  RiCloseLine,
  RiSparklingFill,
  RiLoader4Line,
  RiInformationLine,
  RiLockLine,
} from 'react-icons/ri'

/** Per-topic metadata for the details panel + remove rules (built for EVERY topic
 *  in the master graph, with the enrolled ones' real progress merged in). */
interface TopicMeta {
  name: string
  /** Display status when enrolled (never 'locked' — the editor shows everything editable). */
  status: NodeStatus
  estimatedHours: number
  sectionTotal: number
  sectionCompleted: number
  /** A topic the learner has started cannot be removed (backend enforces this too). */
  hasProgress: boolean
  /** Prerequisite master topic ids — guards removals + shown in the details panel. */
  prerequisiteTopicIds: string[]
}

const STATUS_LABEL: Record<NodeStatus, string> = {
  completed: 'Completed',
  current: 'In progress',
  upcoming: 'Available',
  locked: 'Locked',
}

/** Backend 4-state status → node status, mapping `locked`/`available` to `upcoming`
 *  (the editor shows every enrolled topic as editable, never a dashed lock). */
const toNodeStatus = (s: 'locked' | 'available' | 'in_progress' | 'completed'): NodeStatus =>
  s === 'completed' ? 'completed' : s === 'in_progress' ? 'current' : 'upcoming'

/** Pull the backend error code out of an axios error, if present. */
const errorCode = (error: unknown): string | undefined =>
  (error as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error?.code

// Keep the whole graph (spine + parallel fork branches) framed at every viewport.
// Top padding reserves room so the first node never hides under the fit-view
// Controls overlay; the percent sides give breathing room; maxZoom 1 stops a small
// roadmap from blowing up past 100%.
const FIT_VIEW_OPTIONS = {
  padding: { top: '64px', right: '8%', bottom: '8%', left: '8%' },
  maxZoom: 1,
} as const

/**
 * Re-fits the React Flow viewport so the full graph is never clipped. Rendered
 * inside <ReactFlow> so it can read the flow instance; re-fits whenever the node
 * set OR the canvas size changes (the plain `fitView` prop only runs once on mount,
 * before the async nodes land).
 */
function FitViewController({
  wrapperRef,
  signature,
}: {
  wrapperRef: RefObject<HTMLDivElement | null>
  signature: string
}) {
  const { fitView } = useReactFlow()

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      void fitView(FIT_VIEW_OPTIONS)
    })
    return () => cancelAnimationFrame(raf)
  }, [signature, fitView])

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
  const flowWrapperRef = useRef<HTMLDivElement>(null)
  const [showAlert, setShowAlert] = useState(true)
  // Below xl the topic-details panel is a bottom sheet that opens on node tap.
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data, isLoading, isError } = useRoadmapDetail(roadmapId ?? '')
  // Branch metadata (selectionGroup + topicIds) powers the fork bands.
  const { data: masterPreview } = useMasterRoadmap(data?.roadmap.masterRoadmapId)
  // The all-branches master graph is the FIXED node set — every parallel branch's
  // topics, so not-enrolled topics show greyed instead of disappearing.
  const { data: masterGraph, isFetching: graphFetching } = useMasterRoadmapGraph(
    data?.roadmap.masterRoadmapId,
  )

  // Enrolled topic ids (the "membership"). Adding/removing a topic only toggles this
  // set — nodes never move. `originalMembership` is the load-time snapshot the save
  // diff reads; `history` is the multi-step undo stack of prior membership snapshots.
  const [membership, setMembership] = useState<ReadonlySet<string>>(new Set())
  const [originalMembership, setOriginalMembership] = useState<ReadonlySet<string>>(new Set())
  const [history, setHistory] = useState<ReadonlySet<string>[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackData | null>(null)
  const [aiError, setAiError] = useState(false)

  // Seed membership from the enrolled roadmap the first time it arrives.
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!data || initializedRef.current) return
    initializedRef.current = true
    const ids = data.topics.map((t) => t.masterTopicId)
    setMembership(new Set(ids))
    setOriginalMembership(new Set(ids))
    setSelectedId(ids[0] ?? null)
  }, [data])

  // The node set: the full master graph if loaded, else the enrolled topics (so the
  // editor works — showing the current path — even if /graph is cold or down; the
  // greyed alternatives appear once the graph lands).
  const graphTopics = useMemo(() => masterGraph?.topics ?? data?.topics ?? [], [masterGraph, data])

  // Per-topic metadata for EVERY graph topic, merging the enrolled ones' progress.
  const topicMeta = useMemo(() => {
    const enrolledById = new Map((data?.topics ?? []).map((t) => [t.masterTopicId, t]))
    const meta = new Map<string, TopicMeta>()
    for (const t of graphTopics) {
      const enrolled = enrolledById.get(t.masterTopicId)
      meta.set(t.masterTopicId, {
        name: t.name,
        status: enrolled ? toNodeStatus(enrolled.status) : 'upcoming',
        estimatedHours: t.estimatedHours,
        sectionTotal: t.sectionTotal,
        sectionCompleted: enrolled?.sectionCompleted ?? 0,
        hasProgress: (enrolled?.sectionCompleted ?? 0) > 0,
        // Enrolled → in-roadmap-filtered prereqs; not-enrolled → master graph prereqs.
        prerequisiteTopicIds: (enrolled ?? t).prerequisiteTopicIds ?? [],
      })
    }
    return meta
  }, [graphTopics, data])

  // Fork-aware full-graph layout: enrolled topics in real colour, not-enrolled greyed
  // in the SAME slot. Derived purely from the topics + branches + membership.
  const layoutTopics = useMemo<EditorTopic[]>(
    () =>
      graphTopics.map((t) => ({ id: t.masterTopicId, label: t.name, orderIndex: t.orderIndex })),
    [graphTopics],
  )
  const { nodes: displayNodes, edges: displayEdges } = useMemo(
    () =>
      buildEditorLayout({
        topics: layoutTopics,
        branches: masterPreview?.branches,
        membership,
        statusOf: (id) => topicMeta.get(id)?.status ?? 'upcoming',
      }),
    [layoutTopics, masterPreview, membership, topicMeta],
  )

  // A stable signature so FitViewController re-frames when the node set changes.
  const nodeSignature = useMemo(() => displayNodes.map((n) => n.id).join('|'), [displayNodes])

  // Save diff — what changed vs the load-time enrolled set.
  const { addTopicIds, removeTopicIds } = useMemo(
    () => computeMembershipDiff(originalMembership, membership),
    [originalMembership, membership],
  )
  const hasChanges = addTopicIds.length > 0 || removeTopicIds.length > 0
  const canUndo = history.length > 0

  // Warn before a reload / tab-close discards unsaved topic edits. Only armed while
  // there are pending changes; a normal in-app navigate (Save/Cancel/Back) doesn't
  // fire beforeunload, so the save redirect stays clean.
  useEffect(() => {
    if (!hasChanges) return
    const warnOnLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnOnLeave)
    return () => window.removeEventListener('beforeunload', warnOnLeave)
  }, [hasChanges])

  const selectedMeta = selectedId ? topicMeta.get(selectedId) : undefined
  const selectedEnrolled = selectedId ? membership.has(selectedId) : false

  // Prerequisites of the selected topic that are still enrolled (named for the panel).
  const selectedPrereqNames = useMemo(
    () =>
      resolveOnCanvasPrereqNames(
        selectedMeta?.prerequisiteTopicIds,
        (id) => membership.has(id),
        (id) => topicMeta.get(id)?.name,
      ),
    [selectedMeta, topicMeta, membership],
  )

  // Enrolled topics that require the selected one — removing it would break them.
  const selectedRemoveCheck = useMemo(
    () =>
      selectedId && selectedEnrolled
        ? canRemoveTopic({
            topicId: selectedId,
            membership,
            hasProgress: (id) => !!topicMeta.get(id)?.hasProgress,
            prerequisitesOf: (id) => topicMeta.get(id)?.prerequisiteTopicIds,
          })
        : null,
    [selectedId, selectedEnrolled, membership, topicMeta],
  )

  // A greyed continuation topic (e.g. Next.js) can't be added until its in-branch
  // predecessor (React) is enrolled — otherwise it would save as a permanently
  // locked orphan. undefined = freely addable. Only relevant when not enrolled.
  // The greyed topics render from the /graph query, but resolveAddBlocker needs the
  // branch metadata from the separate /master-roadmaps/:id query. Guard on that being
  // loaded: in the window where /graph resolves first, the blocker would read
  // undefined and a continuation could be added head-less (see addPending below).
  const branchesReady = !!masterPreview?.branches
  const addBlockerId = useMemo(
    () =>
      selectedId && !selectedEnrolled && branchesReady
        ? resolveAddBlocker(selectedId, masterPreview?.branches, membership)
        : undefined,
    [selectedId, selectedEnrolled, branchesReady, masterPreview, membership],
  )
  // Not-enrolled topic while branch metadata is still loading: add-eligibility can't
  // be evaluated yet, so hold Add rather than risk a head-less continuation add.
  const addPending = !!selectedId && !selectedEnrolled && !branchesReady

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
      logger.error(
        'Failed to fetch AI feedback:',
        error instanceof Error ? error.message : String(error),
      )
      setAiError(true)
    },
  })

  // Snapshot the current membership onto the undo stack before a structural change.
  const pushHistory = () => setHistory((h) => [...h, new Set(membership)])

  const handleAddTopic = (topicId: string) => {
    if (membership.has(topicId)) return
    // Can't evaluate the branch chain until branch metadata loads — hold rather than
    // risk adding a continuation topic without its head (a permanently-locked orphan).
    if (!masterPreview?.branches) {
      toast.error('Still loading the roadmap paths — try again in a moment.')
      return
    }
    // Guard the branch chain: don't add a continuation topic before its head.
    const blocker = resolveAddBlocker(topicId, masterPreview.branches, membership)
    if (blocker) {
      toast.error(
        `Add ${topicMeta.get(blocker)?.name ?? 'its prerequisite'} first to add this topic.`,
      )
      return
    }
    pushHistory()
    const next = new Set(membership)
    next.add(topicId)
    setMembership(next)
    setSelectedId(topicId)
    aiFeedbackMutation.mutate({ action: 'add', topicId })
  }

  const handleRemoveTopic = (topicId: string) => {
    const check = canRemoveTopic({
      topicId,
      membership,
      hasProgress: (id) => !!topicMeta.get(id)?.hasProgress,
      prerequisitesOf: (id) => topicMeta.get(id)?.prerequisiteTopicIds,
    })
    if (!check.ok) {
      if (check.reason === 'has-progress') {
        toast.error("You can't remove a topic you've already started.")
      } else if (check.reason === 'last-topic') {
        toast.error('A roadmap must keep at least one topic.')
      } else {
        const names = check.dependentIds.map((id) => topicMeta.get(id)?.name ?? 'another topic')
        toast.error(`Required by ${names.join(', ')} — remove those first.`)
      }
      return
    }
    pushHistory()
    const next = new Set(membership)
    next.delete(topicId)
    setMembership(next)
    // Keep the topic selected so the learner sees it flip to greyed (and can undo).
    aiFeedbackMutation.mutate({ action: 'remove', topicId })
  }

  const handleUndo = () => {
    if (history.length === 0) return
    setMembership(new Set(history[history.length - 1]))
    setHistory(history.slice(0, -1))
  }

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    // The "choose one" pill is an inert label, not a topic.
    if (node.id.startsWith('fork-label:')) return
    setSelectedId(node.id)
    setSheetOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch(`/roadmaps/${roadmapId}`, { addTopicIds, removeTopicIds })
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
      } else if (code === 'TOPIC_NOT_IN_BRANCH') {
        toast.error("That topic isn't part of this roadmap.")
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
        <p className="text-text-muted mt-1 text-sm">
          Click any topic to see its details. Greyed topics aren&apos;t in your roadmap yet — open
          one and press <span className="font-semibold">Add topic</span> to learn it (parallel
          branches stay side by side).
        </p>
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

      {/* AI feedback (F19) — above the canvas so it's visible right after an edit,
          with an explicit busy/error state instead of silently blanking out. */}
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

      {/* Main Container — canvas full width until xl; below that the details open as a
          bottom sheet so the fork stays readable on tablets/small laptops. */}
      <div className="flex min-h-150 flex-1 flex-col gap-6 xl:flex-row">
        {/* === CANVAS === */}
        <div className="border-border-soft bg-bg-card flex flex-1 flex-col rounded-2xl border">
          <div className="border-border-soft flex flex-wrap items-center justify-between gap-2 border-b p-4">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
            >
              <RiArrowGoBackLine /> Undo
            </button>
            {graphFetching && !masterGraph && (
              <span className="text-text-muted flex items-center gap-1.5 text-xs">
                <RiLoader4Line className="animate-spin" /> Loading other paths…
              </span>
            )}
          </div>

          {/* isolate = a stacking context scoped to THIS canvas so React Flow's high
              internal z-indexes can't paint over the app sidebar. */}
          <div ref={flowWrapperRef} className="bg-bg-section/50 relative isolate flex-1">
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              fitView
              fitViewOptions={FIT_VIEW_OPTIONS}
              minZoom={0.2}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
            >
              <FitViewController wrapperRef={flowWrapperRef} signature={nodeSignature} />
              <Background color="#cbd5e1" gap={20} size={1} />
              {/* showInteractive={false} drops the lock button — in this editor it only
                  toggled node selection off, which read as "the graph is broken". */}
              <Controls
                position="top-right"
                showInteractive={false}
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

        {/* === TOPIC DETAILS ===
            Below xl: bottom sheet that slides up. xl+: static sidebar. */}
        <div
          className={`border-border-soft bg-bg-card flex flex-col border shadow-sm transition-transform duration-300 ease-out xl:static! xl:z-auto xl:max-h-none xl:w-100 xl:translate-y-0 xl:overflow-visible xl:rounded-2xl ${
            sheetOpen ? 'translate-y-0' : 'translate-y-full'
          } fixed inset-x-0 bottom-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-2xl p-6`}
        >
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
                    {selectedEnrolled ? STATUS_LABEL[selectedMeta.status] : 'Not added yet'}
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

              {/* Actions — both buttons, each disabled when it doesn't apply to the
                  selected topic (D4). */}
              <div className="border-border-soft mt-auto flex flex-col gap-3 border-t pt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => selectedId && handleAddTopic(selectedId)}
                    disabled={selectedEnrolled || !!addBlockerId || addPending}
                    className="border-brand-purple-600 text-brand-purple-600 hover:bg-bg-lavender focus-visible:ring-brand-purple-300 flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RiAddLine /> Add topic
                  </button>
                  <button
                    onClick={() => selectedId && handleRemoveTopic(selectedId)}
                    disabled={!selectedEnrolled || !selectedRemoveCheck?.ok}
                    className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RiSubtractLine className="text-error-text" /> Remove topic
                  </button>
                </div>
                {!selectedEnrolled ? (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    {addPending
                      ? 'Loading the roadmap paths…'
                      : addBlockerId
                        ? `Add ${topicMeta.get(addBlockerId)?.name ?? 'its earlier topic'} first — this topic continues that branch.`
                        : 'Not in your roadmap yet — add it to learn it (parallel branches stay side by side).'}
                  </p>
                ) : selectedRemoveCheck && !selectedRemoveCheck.ok ? (
                  <p className="text-text-muted flex items-start gap-2 text-xs">
                    <RiInformationLine className="mt-0.5 shrink-0 text-sm" />
                    {selectedRemoveCheck.reason === 'has-progress'
                      ? "You've already started this topic, so it can't be removed."
                      : selectedRemoveCheck.reason === 'last-topic'
                        ? 'A roadmap must keep at least one topic.'
                        : `Required by ${selectedRemoveCheck.dependentIds
                            .map((id) => topicMeta.get(id)?.name ?? 'another topic')
                            .join(', ')} — remove those first.`}
                  </p>
                ) : null}
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
