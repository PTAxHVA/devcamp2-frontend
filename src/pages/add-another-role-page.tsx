import { Link } from 'react-router'
import { FiCompass, FiArrowLeft } from 'react-icons/fi'
import RoadmapCard from '@/features/roadmap/components/roadmap-card'
import { useBrowseRoadmaps } from '@/features/roadmap/hooks/use-browse-roadmaps'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'

export function AddAnotherRolePage() {
  const { data: allRoadmaps, isLoading, isError, refetch, isFetching } = useBrowseRoadmaps()
  const { data: myRoadmaps, isLoading: isMyRoadmapsLoading } = useMyRoadmaps()

  // Roles the user already follows — exclude them so this page only offers NEW roles.
  const enrolled = new Set((myRoadmaps ?? []).map((r) => (r.roleName ?? '').toLowerCase()))
  const available = (allRoadmaps ?? []).filter(
    (r) => !enrolled.has((r.roleName ?? '').toLowerCase()),
  )
  // Proactively tell the learner when they're at the 2-roadmap cap (L10).
  const atCap = (myRoadmaps ?? []).length >= 2

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-5xl p-6 duration-500">
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
      >
        <FiArrowLeft /> Back to dashboard
      </Link>

      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
          <FiCompass className="h-8 w-8" />
        </div>
        <h1 className="text-text-primary text-3xl font-extrabold">Add a new goal</h1>
        <p className="text-text-muted mt-2 font-medium">
          Choose a new role to learn alongside your current roadmap.
        </p>
      </div>

      {isLoading || isMyRoadmapsLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-indigo-600" />
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 py-12 text-center text-red-500">
          <p className="text-lg font-bold">Failed to load roadmaps</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isFetching ? <span className="loading loading-spinner loading-xs" /> : 'Try again'}
          </button>
        </div>
      ) : available.length === 0 ? (
        <div className="bg-bg-card mx-auto max-w-md rounded-2xl border border-slate-100 py-12 text-center shadow-sm">
          <p className="text-text-secondary text-lg font-bold">
            {atCap ? "You've reached the maximum of 2 active roadmaps" : 'No new roles available'}
          </p>
          <p className="text-text-muted mt-1 text-sm">
            {atCap
              ? 'Remove a roadmap from your dashboard first to add a different one.'
              : "You're already following every roadmap we offer."}
          </p>
          <Link
            to="/roadmaps/browse"
            className="border-border-soft text-text-secondary hover:bg-bg-section mt-4 inline-block rounded-xl border px-5 py-2 text-sm font-bold"
          >
            Browse all roadmaps
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {available.map((r) => (
            <RoadmapCard key={r._id} data={r} />
          ))}
        </div>
      )}
    </div>
  )
}
