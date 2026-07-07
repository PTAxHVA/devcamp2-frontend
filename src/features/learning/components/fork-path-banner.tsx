import { Link } from 'react-router'
import { RiGitBranchLine, RiArrowLeftRightLine } from 'react-icons/ri'
import { useMasterRoadmap } from '@/features/roadmap/hooks/use-master-roadmap'
import { deriveForkContext } from '@/features/roadmap/lib/branch-selection'
import type { LearningTopic } from '../types'

interface ForkPathBannerProps {
  /** Master roadmap this enrollment came from — carries the fork branch metadata. */
  masterRoadmapId: string | null | undefined
  /** User roadmap id, for the "switch in Edit" link. */
  roadmapId: string | null | undefined
  /** Enrolled topics of the current roadmap (any order — sorted here). */
  topics: LearningTopic[]
}

/**
 * Lightweight fork indicator for the learner's roadmap view. When the roadmap
 * follows one side of a mutually-exclusive branch group (e.g. MongoDB vs
 * PostgreSQL), it names the chosen path and points to Edit to switch. The full
 * ghost-node + one-click switch lives in the editor (SwitchPathPanel); this is
 * just the read-only heads-up that used to appear on /roadmaps/:id.
 */
export default function ForkPathBanner({
  masterRoadmapId,
  roadmapId,
  topics,
}: ForkPathBannerProps) {
  const { data: master } = useMasterRoadmap(masterRoadmapId)

  const enrolledTopicIds = [...topics]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((t) => t.masterTopicId)
  const fork = deriveForkContext(master?.branches ?? [], enrolledTopicIds)

  // Only surface the "you're on one side of a fork" case. 'both' (holds every
  // option) has no unchosen path to advertise, and 'none' can't happen for an
  // enrolled roadmap.
  if (!fork || fork.state !== 'single' || !fork.current || !fork.alternative) return null

  return (
    <div className="border-border-purple bg-bg-lavender/50 flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <RiGitBranchLine className="text-brand-purple-600 mt-0.5 text-lg" />
        <div>
          <h4 className="text-text-primary text-sm font-bold">
            {fork.selectionGroup} path: {fork.current.name}
          </h4>
          <p className="text-text-secondary text-xs">
            This roadmap follows one path. Switch to {fork.alternative.name} in Edit.
          </p>
        </div>
      </div>
      {roadmapId && (
        <Link
          to={`/roadmaps/${roadmapId}/edit`}
          className="border-brand-purple-600 text-brand-purple-600 hover:bg-bg-lavender focus-visible:ring-brand-purple-300 flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          <RiArrowLeftRightLine /> Switch path
        </Link>
      )}
    </div>
  )
}
