import { useEffect } from 'react'
import { RiCloseLine, RiListUnordered, RiGitBranchLine, RiBookOpenLine } from 'react-icons/ri'
import { useMasterRoadmap } from '../hooks/use-master-roadmap'
import { useEnrollRoadmap } from '../hooks/use-enroll-roadmap'

interface RoadmapPreviewModalProps {
  roadmapId: string
  roleName?: string
  onClose: () => void
}

export default function RoadmapPreviewModal({
  roadmapId,
  roleName,
  onClose,
}: RoadmapPreviewModalProps) {
  const { data, isLoading, isError, refetch, isFetching } = useMasterRoadmap(roadmapId)
  const enroll = useEnrollRoadmap()

  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const title = data?.roleName ?? roleName ?? 'Roadmap'
  const branches = data?.branches ?? []
  const totalTopics = branches.reduce((sum, b) => sum + (b.topicCount || 0), 0)

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-in zoom-in-95 relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl duration-200 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <RiCloseLine size={22} />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-brand-purple-600" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-16 text-center text-red-500">
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
            <h2 className="mb-2 pr-8 text-2xl font-black text-slate-900">{title}</h2>
            <p className="mb-5 text-sm text-slate-500">
              {data?.description ?? 'No description available.'}
            </p>

            <div className="mb-6 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5">
                <RiGitBranchLine className="text-slate-400" /> {branches.length} branch
                {branches.length === 1 ? '' : 'es'}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5">
                <RiListUnordered className="text-slate-400" /> {totalTopics} topics
              </span>
            </div>

            <h3 className="mb-3 text-sm font-bold text-slate-900">What you'll learn</h3>
            {branches.length > 0 ? (
              <ul className="mb-8 space-y-2.5">
                {branches.map((b) => (
                  <li
                    key={b._id}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <RiBookOpenLine className="text-brand-purple-500 mt-0.5 shrink-0 text-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800">{b.name}</p>
                      {b.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {b.description}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-400">
                      {b.topicCount} topics
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-8 text-sm text-slate-500">No content available yet.</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() =>
                  enroll.mutate({
                    masterRoadmapId: roadmapId,
                    roleName: title,
                    branchSelections: branches.map((b) => b._id),
                  })
                }
                disabled={enroll.isPending || branches.length === 0}
                className="flex-1 rounded-xl bg-[#0f3460] py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a2545] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enroll.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  'Use roadmap'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
