import { useState, useMemo } from 'react'
import RoadmapCard from '@/features/roadmap/components/roadmap-card'
import { useBrowseRoadmaps } from '@/features/roadmap/hooks/use-browse-roadmaps'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'
import { enrolledMasterToUserRoadmapId } from '@/features/roadmap/lib/enrolled-roadmaps'

export default function BrowseRoadmapsPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')

  const { data: rawRoadmaps = [], isLoading, isError, isFetching, refetch } = useBrowseRoadmaps()
  const { data: myRoadmaps } = useMyRoadmaps()
  const enrolledMap = useMemo(() => enrolledMasterToUserRoadmapId(myRoadmaps), [myRoadmaps])

  const clearFilters = () => {
    setSearch('')
    setRole('all')
  }

  const displayRoadmaps = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return rawRoadmaps
      .filter((r) => {
        // Search matches the role name OR the description (M11) — so "React" can
        // surface the Frontend roadmap, not just an exact role-name hit.
        const matchSearch =
          !search ||
          r.roleName.toLowerCase().includes(lowerSearch) ||
          (r.description ?? '').toLowerCase().includes(lowerSearch)
        const matchRole = role === 'all' || r.roleName.toLowerCase().includes(role.toLowerCase())
        return matchSearch && matchRole
      })
      .sort((a, b) => a.roleName.localeCompare(b.roleName))
  }, [rawRoadmaps, search, role])

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-375 p-6 duration-500 lg:p-8">
      <div className="mb-8">
        <h1 className="text-text-primary mb-2 text-3xl font-extrabold tracking-tight">
          Browse all roadmaps
        </h1>
        <p className="text-text-muted">
          Explore curated learning paths and choose the one that fits you best.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="focus:border-brand-purple-500 border-border-soft bg-bg-card rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-200 outline-none"
        >
          <option value="all">All Roles</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>

        <input
          type="text"
          placeholder="Search roadmaps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus:border-brand-purple-500 border-border-soft min-w-50 flex-1 rounded-xl border px-4 py-2.5 text-sm transition-colors duration-200 outline-none"
        />

        <button
          onClick={clearFilters}
          className="border-border-soft text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Clear filters
        </button>
      </div>

      <div className="border-border-soft mb-8 flex items-center justify-end border-b pb-3">
        <div className="text-text-muted text-sm font-medium">
          {displayRoadmaps.length} roadmaps found
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-spinner loading-lg text-brand-purple-600" />
        </div>
      ) : isError ? (
        <div className="border-error-border bg-error-bg text-error-text flex flex-col items-center rounded-2xl border py-16 text-center">
          <p className="text-lg font-bold">Failed to load roadmaps</p>
          <p className="mb-5 text-sm">Please check your API connection and try again.</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="focus-visible:ring-brand-purple-300 rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-600 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetching ? <span className="loading loading-spinner loading-xs" /> : 'Try again'}
          </button>
        </div>
      ) : displayRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {displayRoadmaps.map((item) => (
            <RoadmapCard
              key={item._id}
              data={item}
              isEnrolled={enrolledMap.has(item._id)}
              userRoadmapId={enrolledMap.get(item._id)}
            />
          ))}
        </div>
      ) : (
        <div className="border-border-soft bg-bg-section text-text-muted flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
          <p className="text-text-secondary mb-1 text-lg font-bold">No roadmaps found</p>
          <p className="text-sm">Try clearing your filters or check back later.</p>
        </div>
      )}
    </div>
  )
}
