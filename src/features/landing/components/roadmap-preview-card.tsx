import { useEffect, useMemo, useState } from 'react'
import { RiCheckLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { SHADOW_CARD } from '../lib/landing-styles'
import { usePrefersReducedMotion } from '../lib/use-prefers-reduced-motion'

type NodeStatus = 'done' | 'current' | 'upcoming'

interface PreviewNode {
  title: string
  sub: string
  status: NodeStatus
}

const NODES: PreviewNode[] = [
  { title: 'HTML', sub: 'Structure & semantics', status: 'done' },
  { title: 'CSS & Layout', sub: 'Flexbox, grid, responsive', status: 'done' },
  { title: 'JavaScript', sub: 'In progress · quiz next', status: 'current' },
  { title: 'React', sub: 'Components & state', status: 'upcoming' },
  { title: 'Capstone Project', sub: 'Ship a real app', status: 'upcoming' },
]

const NodeToken = ({ status, animate }: { status: NodeStatus; animate: boolean }) => {
  if (status === 'done') {
    return (
      <span
        aria-hidden
        className="bg-brand-navy-900 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-white"
      >
        <RiCheckLine className="h-4 w-4" />
      </span>
    )
  }
  if (status === 'current') {
    return (
      <span className="relative grid h-[34px] w-[34px] shrink-0 place-items-center">
        {/* Live pulse on the active checkpoint — a ping ring behind the token.
            Suppressed under reduced-motion so nothing animates involuntarily. */}
        {animate && (
          <span
            aria-hidden
            className="bg-brand-purple-400/30 absolute inset-0 animate-ping rounded-full"
          />
        )}
        <span
          aria-hidden
          className="border-brand-purple-500 relative grid h-[34px] w-[34px] place-items-center rounded-full border-2 bg-white shadow-[0_0_0_6px_rgba(124,58,237,0.12)]"
        >
          <span className="bg-brand-purple-600 h-[9px] w-[9px] rounded-full" />
        </span>
      </span>
    )
  }
  return (
    <span
      aria-hidden
      className="border-border-input grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border-2 bg-white"
    >
      <span className="bg-border-input h-2 w-2 rounded-full" />
    </span>
  )
}

const LEGEND = [
  { label: 'Done', dot: 'bg-brand-navy-900' },
  { label: 'Current', dot: 'bg-brand-purple-500' },
  { label: 'Upcoming', dot: 'border-border-input border-2 bg-white' },
]

/**
 * Hero roadmap preview — a static personalized-path snapshot. The active checkpoint
 * pulses and the completion meter fills once on mount; both are gated on the LIVE
 * reduced-motion preference so the card degrades to fully static. Presentational
 * only (no controls) — the interactive roadmap lives at /demo-roadmap.
 */
export const RoadmapPreviewCard = () => {
  const reduced = usePrefersReducedMotion()

  // The verified-stage meter. Base the fill on how many nodes are `done` so the
  // number and the bar can never drift apart.
  const { doneCount, total, pct } = useMemo(() => {
    const done = NODES.filter((n) => n.status === 'done').length
    return { doneCount: done, total: NODES.length, pct: Math.round((done / NODES.length) * 100) }
  }, [])

  // Fill the meter from 0 → pct once mounted. Under reduced-motion it starts at the
  // target and the effect no-ops, so nothing animates.
  const [fill, setFill] = useState(reduced ? pct : 0)
  useEffect(() => {
    if (reduced) return
    const raf = requestAnimationFrame(() => setFill(pct))
    return () => cancelAnimationFrame(raf)
  }, [pct, reduced])

  return (
    <div
      className={cn(
        'border-border-soft w-full rounded-[20px] border bg-white p-[18px] sm:p-[22px]',
        SHADOW_CARD,
      )}
    >
      <div className="border-border-soft flex flex-wrap items-center justify-between gap-2.5 border-b pb-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-secondary text-text-muted text-[0.68rem] tracking-[0.12em] uppercase">
            Your roadmap
          </span>
          <span className="border-brand-purple-300/55 bg-bg-lavender text-brand-purple-700 inline-flex items-center rounded-full border px-2.5 py-1 text-[0.72rem] font-bold">
            Frontend Developer
          </span>
        </div>
        <div className="text-text-muted hidden gap-3 text-[0.72rem] font-semibold min-[520px]:flex">
          {LEGEND.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <i
                aria-hidden
                className={cn('inline-block h-[11px] w-[11px] rounded-full', item.dot)}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Completion meter — animated fill + verified-stage count. */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-text-secondary text-[0.78rem] font-semibold">Overall progress</span>
          <span className="text-brand-purple-700 text-[0.78rem] font-bold tabular-nums">
            {doneCount}/{total} verified · {pct}%
          </span>
        </div>
        <div
          className="bg-bg-lavender h-2 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Roadmap progress"
        >
          <span
            className={cn(
              'from-brand-purple-500 to-brand-purple-400 block h-full rounded-full bg-gradient-to-r',
              !reduced && 'transition-[width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            )}
            style={{ width: `${fill}%` }}
          />
        </div>
      </div>

      <div className="relative mt-4 flex flex-col gap-2.5">
        <span
          aria-hidden
          className="border-border-input absolute top-3.5 bottom-3.5 left-[29px] w-0 border-l border-dashed"
        />
        {NODES.map((node) => (
          <div
            key={node.title}
            className={cn(
              'relative z-[1] flex items-center gap-3 rounded-[14px] border px-3 py-[9px]',
              node.status === 'current'
                ? 'border-brand-purple-300/50 bg-bg-lavender'
                : 'border-border-soft bg-white',
            )}
          >
            <NodeToken status={node.status} animate={!reduced} />
            <div className="min-w-0">
              <b className="text-text-primary block text-[0.92rem] leading-tight font-bold">
                {node.title}
              </b>
              {/* On the current node the subtitle sits on lavender, where text-muted
                  dips below AA (4.38:1) — use the darker secondary there. */}
              <small
                className={cn(
                  'text-[0.75rem]',
                  node.status === 'current' ? 'text-text-secondary' : 'text-text-muted',
                )}
              >
                {node.sub}
              </small>
            </div>
            {node.status === 'current' && (
              <span className="font-secondary bg-brand-purple-600 ml-auto rounded-md px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.1em] text-white uppercase">
                Now
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
