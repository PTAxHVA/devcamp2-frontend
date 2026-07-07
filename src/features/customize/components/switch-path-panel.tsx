import { RiGitBranchLine, RiArrowLeftRightLine, RiInformationLine } from 'react-icons/ri'
import {
  computeBranchSwap,
  deriveForkContext,
  type ForkableBranch,
} from '@/features/roadmap/lib/branch-selection'

export interface PathSwap {
  addTopicIds: string[]
  removeTopicIds: string[]
  toName: string
}

interface SwitchPathPanelProps {
  /** Master-roadmap branches (with fork metadata + topicIds). */
  branches: ForkableBranch[] | undefined
  /** Topic ids currently on the editor canvas, in order. */
  canvasTopicIds: string[]
  /** True when the given topic already has learning progress (remove-gate). */
  hasProgressOn: (topicId: string) => boolean
  /** Disables the action while a save (or the incoming topic list) is pending. */
  isBusy: boolean
  onSwitch: (swap: PathSwap) => void
}

/**
 * "Learning path" card for roadmaps with a mutually-exclusive branch group:
 * shows which side of the fork the canvas currently follows and offers a
 * one-click switch to the alternative. The switch only edits the CANVAS —
 * the existing Save button persists it through PATCH /roadmaps/:id, so the
 * remove-gate, reorder and edit-log all apply unchanged.
 */
export default function SwitchPathPanel({
  branches,
  canvasTopicIds,
  hasProgressOn,
  isBusy,
  onSwitch,
}: SwitchPathPanelProps) {
  const fork = deriveForkContext(branches ?? [], canvasTopicIds)
  if (!fork || fork.state === 'none') return null

  if (fork.state === 'both') {
    return (
      <div className="border-border-purple bg-bg-lavender/50 mb-6 flex items-start gap-3 rounded-xl border p-4">
        <RiGitBranchLine className="text-brand-purple-600 mt-0.5 text-lg" />
        <div>
          <h4 className="text-text-primary text-sm font-bold">
            {fork.selectionGroup}: both paths are in this roadmap
          </h4>
          <p className="text-text-secondary text-xs">
            This roadmap includes every {fork.selectionGroup.toLowerCase()} option, so there is
            nothing to switch. Remove one of them if you want a single path.
          </p>
        </div>
      </div>
    )
  }

  const { current, alternative } = fork
  if (!current || !alternative) return null

  const startedCurrent = (current.topicIds ?? []).some(
    (id) => canvasTopicIds.includes(id) && hasProgressOn(id),
  )
  const disabled = isBusy || startedCurrent

  const handleClick = () => {
    if (disabled) return
    onSwitch({
      ...computeBranchSwap(canvasTopicIds, current, alternative),
      toName: alternative.name,
    })
  }

  return (
    <div className="border-border-purple bg-bg-lavender/50 mb-6 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <RiGitBranchLine className="text-brand-purple-600 mt-0.5 text-lg" />
        <div>
          <h4 className="text-text-primary text-sm font-bold">
            {fork.selectionGroup} path: {current.name}
          </h4>
          {startedCurrent ? (
            <p className="text-text-secondary flex items-start gap-1 text-xs">
              <RiInformationLine className="mt-0.5 shrink-0" />
              You have already started {current.name}, so the path can&apos;t be switched.
            </p>
          ) : (
            <p className="text-text-secondary text-xs">
              Switching replaces it with {alternative.name} and marks the roadmap as customized —
              review the canvas, then press Save changes.
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="border-brand-purple-600 text-brand-purple-600 hover:bg-bg-lavender focus-visible:ring-brand-purple-300 flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RiArrowLeftRightLine /> Switch to {alternative.name}
      </button>
    </div>
  )
}
