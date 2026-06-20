import { useState, useMemo } from 'react'
import RoadmapCard from '@/features/roadmap/components/roadmap-card'
import { useBrowseRoadmaps } from '@/features/roadmap/hooks/use-browse-roadmaps'

type Tab = 'recommended' | 'all' | 'popular' | 'new'

export default function BrowseRoadmapsPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [tab, setTab] = useState<Tab>('recommended')

  const { data: rawRoadmaps = [], isLoading, isError, isFetching, refetch } = useBrowseRoadmaps()

  const clearFilters = () => {
    setSearch('')
    setRole('all')
  }

  const filteredRoadmaps = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return rawRoadmaps.filter((r) => {
      const matchSearch = !search || r.roleName.toLowerCase().includes(lowerSearch)
      const matchRole = role === 'all' || r.roleName.toLowerCase().includes(role.toLowerCase())
      return matchSearch && matchRole
    })
  }, [rawRoadmaps, search, role])

  const displayRoadmaps = useMemo(() => {
    const arr = [...filteredRoadmaps]
    if (tab === 'recommended' || tab === 'popular') {
      return arr.sort((a, b) => a.roleName.localeCompare(b.roleName))
    }
    if (tab === 'new') {
      return arr.reverse()
    }
    return arr // 'all' — API insertion order
  }, [filteredRoadmaps, tab])

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-375 p-6 duration-500 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Browse all roadmaps</h1>
        <p className="text-slate-500">
          Explore curated learning paths and choose the one that fits you best.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="focus:border-brand-purple-500 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none"
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
          className="focus:border-brand-purple-500 min-w-50 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
        />

        <button
          onClick={clearFilters}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-6">
          {(['recommended', 'all', 'popular', 'new'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-bold capitalize transition-colors ${
                tab === t
                  ? 'border-brand-purple-600 text-brand-purple-600 border-b-2'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="pb-3 text-sm font-medium text-slate-500">
          {displayRoadmaps.length} roadmaps found
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-spinner loading-lg text-brand-purple-600" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center text-red-500">
          <p className="text-lg font-bold">Failed to load roadmaps</p>
          <p className="mb-5 text-sm">Please check your API connection and try again.</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetching ? <span className="loading loading-spinner loading-xs" /> : 'Try again'}
          </button>
        </div>
      ) : displayRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayRoadmaps.map((item) => (
            <RoadmapCard key={item._id} data={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-slate-500">
          <p className="mb-1 text-lg font-bold text-slate-700">No roadmaps found</p>
          <p className="text-sm">Try clearing your filters or check back later.</p>
        </div>
      )}
    </div>
  )
}
