import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { RiCloseLine, RiListUnordered, RiGitBranchLine, RiCircleLine } from 'react-icons/ri'
import { useMasterRoadmap } from '../hooks/use-master-roadmap'
import { useEnrollRoadmap } from '../hooks/use-enroll-roadmap'
import { roadmapSlug } from '@/features/learning/lib/roadmap-slug'
import { applyBranchToggle, resolveDefaultBranchSelection } from '../lib/branch-selection'
import BranchTree from './branch-tree'

interface RoadmapPreviewModalProps {
  roadmapId: string
  roleName?: string
  isEnrolled?: boolean
  onClose: () => void
}

export default function RoadmapPreviewModal({
  roadmapId,
  roleName,
  isEnrolled = false,
  onClose,
}: RoadmapPreviewModalProps) {
  const { data, isLoading, isError, refetch, isFetching } = useMasterRoadmap(roadmapId)
  const navigate = useNavigate()
  const enroll = useEnrollRoadmap()
  // null = user hasn't touched the picker yet → derive the default selection
  // (all ungrouped branches + the default path per exclusive fork group).
  const [selected, setSelected] = useState<Set<string> | null>(null)

  const selectedBranches = useMemo(
    () => selected ?? new Set(resolveDefaultBranchSelection(data?.branches ?? [])),
    [selected, data?.branches],
  )

  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const toggleBranch = (id: string) =>
    setSelected(applyBranchToggle(data?.branches ?? [], selectedBranches, id))

  const title = data?.roleName ?? roleName ?? 'Roadmap'
  const branches = data?.branches ?? []
  const selectedCount = selectedBranches.size
  const selectedTopics = branches
    .filter((b) => selectedBranches.has(b._id))
    .reduce((sum, b) => sum + (b.topicCount || 0), 0)

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-in zoom-in-95 bg-bg-card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-xl duration-200 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="text-text-placeholder hover:bg-bg-section hover:text-text-secondary absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        >
          <RiCloseLine size={22} />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-brand-purple-600" />
          </div>
        ) : isError ? (
          <div className="text-error-text flex flex-col items-center py-16 text-center">
            <p className="text-lg font-bold">Failed to load preview</p>
            <p className="mb-5 text-sm">Please check your connection and try again.</p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
            >
              {isFetching ? <span className="loading loading-spinner loading-xs" /> : 'Try again'}
            </button>
          </div>
        ) : (
          <>
            <p className="text-brand-purple-600 mb-1 text-xs font-bold tracking-wider uppercase">
              Roadmap preview
            </p>
            <h2 className="text-text-primary mb-2 pr-8 text-2xl font-black">{title}</h2>
            <p className="text-text-muted mb-5 text-sm">
              {data?.description ?? 'No description available.'}
            </p>

            <div className="text-text-secondary mb-6 flex flex-wrap gap-3 text-xs font-bold">
              <span className="border-border-soft flex items-center gap-1.5 rounded-lg border px-3 py-1.5">
                <RiGitBranchLine className="text-text-placeholder" /> {selectedCount}/
                {branches.length} branch{branches.length === 1 ? '' : 'es'} selected
              </span>
              <span className="border-border-soft flex items-center gap-1.5 rounded-lg border px-3 py-1.5">
                <RiListUnordered className="text-text-placeholder" /> {selectedTopics} topics
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-primary text-sm font-bold">Choose your learning path</h3>
              <span className="text-text-muted text-xs">
                {branches.some((b) => b.selectionGroup && b.isMutuallyExclusive)
                  ? 'Pick one path where the roadmap splits'
                  : 'Click to select / deselect'}
              </span>
            </div>

            {branches.length > 0 ? (
              <div className="mb-6">
                <BranchTree
                  branches={branches}
                  selected={selectedBranches}
                  onToggle={toggleBranch}
                />
              </div>
            ) : (
              <div className="text-text-placeholder mb-6 flex items-center gap-2 text-sm">
                <RiCircleLine /> No content available yet.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="border-border-soft text-text-secondary hover:bg-bg-section flex-1 rounded-xl border py-3 text-sm font-bold transition-colors"
              >
                Close
              </button>
              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/my-learning/${roadmapSlug(title)}`)}
                  className="bg-btn-primary-bg hover:bg-btn-primary-hover flex-1 rounded-xl py-3 text-sm font-bold text-white transition-colors"
                >
                  Continue learning
                </button>
              ) : (
                <button
                  onClick={() =>
                    enroll.mutate({
                      masterRoadmapId: roadmapId,
                      roleName: title,
                      branchSelections: [...selectedBranches],
                    })
                  }
                  disabled={enroll.isPending || selectedBranches.size === 0}
                  className="bg-btn-primary-bg hover:bg-btn-primary-hover flex-1 rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enroll.isPending ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    `Use roadmap (${selectedCount} branch${selectedCount === 1 ? '' : 'es'})`
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
