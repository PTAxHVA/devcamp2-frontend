import { RiCheckLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { SHADOW_CARD } from '../lib/landing-styles'

type NodeStatus = 'done' | 'current' | 'upcoming'

interface PreviewNode {
  title: string
  sub: string
  status: NodeStatus
}

const NODES: PreviewNode[] = [
  { title: 'HTML', sub: 'Structure & semantics', status: 'done' },
  { title: 'CSS & Layout', sub: 'Flexbox, grid, responsive', status: 'done' },
  { title: 'JavaScript', sub: 'Section 3 of 6 · quiz next', status: 'current' },
  { title: 'React', sub: 'Components & state', status: 'upcoming' },
  { title: 'Capstone Project', sub: 'Ship a real app', status: 'upcoming' },
]

const NodeToken = ({ status }: { status: NodeStatus }) => {
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
      <span
        aria-hidden
        className="border-brand-purple-500 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border-2 bg-white shadow-[0_0_0_6px_rgba(124,58,237,0.12)]"
      >
        <span className="bg-brand-purple-600 h-[9px] w-[9px] rounded-full" />
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

/** Static hero roadmap preview — the personalized-path snapshot from the mockup. */
export const RoadmapPreviewCard = () => (
  <div
    className={cn('border-border-soft w-full rounded-[20px] border bg-white p-[22px]', SHADOW_CARD)}
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
          <NodeToken status={node.status} />
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
            <span className="font-secondary bg-bg-lavender text-brand-purple-700 ml-auto rounded-md px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.1em] uppercase">
              Now
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
)
