import { Link } from 'react-router'
import { FiCompass, FiArrowLeft } from 'react-icons/fi'
import RoadmapCard from '@/features/roadmap/components/roadmap-card'
import { useBrowseRoadmaps } from '@/features/roadmap/hooks/use-browse-roadmaps'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'

export function AddAnotherRolePage() {
  const { data: allRoadmaps, isLoading, isError, refetch, isFetching } = useBrowseRoadmaps()
  const { data: myRoadmaps } = useMyRoadmaps()

  // Roles the user already follows — exclude them so this page only offers NEW roles.
  const enrolled = new Set((myRoadmaps ?? []).map((r) => (r.roleName ?? '').toLowerCase()))
  const available = (allRoadmaps ?? []).filter(
    (r) => !enrolled.has((r.roleName ?? '').toLowerCase()),
  )

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
        <h1 className="text-3xl font-extrabold text-slate-800">Add a new goal</h1>
        <p className="mt-2 font-medium text-slate-500">
          Choose a new role to learn alongside your current roadmap.
        </p>
      </div>

      {isLoading ? (
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
        <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white py-12 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-700">No new roles available</p>
          <p className="mt-1 text-sm text-slate-500">
            You're already following every roadmap we offer.
          </p>
          <Link
            to="/roadmaps/browse"
            className="mt-4 inline-block rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
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
