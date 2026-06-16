import {
  useBrowseRoadmaps,
  type MasterRoadmapItem,
} from '@/features/roadmap-discovery/hooks/use-browse-roadmaps'
import { useBrowseStore } from '@/features/roadmap-discovery/browse-store'
import { RoadmapCard } from '@/features/roadmap-discovery/components/roadmap-card'
import { FiSearch } from 'react-icons/fi'

export function BrowseRoadmapsPage() {
  const { data: items, isLoading, isError } = useBrowseRoadmaps()
  const { search, setFilter } = useBrowseStore()

  const filteredItems = items?.filter((item: MasterRoadmapItem) =>
    item.roleName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Roadmap Discovery</h1>
        <div className="join w-full md:w-auto shadow-sm">
          <div className="relative w-full md:w-80">
            <input
              className="input input-bordered join-item w-full pl-10 transition-all focus:ring-2 focus:ring-primary"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          </div>
        </div>
      </div>

      {isError && (
        <div className="alert alert-error mb-6">
          <span>Failed to load roadmaps. Please refresh and try again.</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 w-full rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item: MasterRoadmapItem) => (
            <RoadmapCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}
