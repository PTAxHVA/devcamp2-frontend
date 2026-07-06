import { Navigate, useParams } from 'react-router'

import { useRoadmapDetail } from './hooks/use-roadmap-detail'
import { roadmapSlug } from '@/features/learning/lib/roadmap-slug'

/**
 * `/roadmaps/:id` is consolidated into the my-learning journey — both rendered the
 * same snake roadmap, so this page is now a thin redirect instead of a duplicate
 * view. Keeping the route (rather than deleting it) means existing links and old
 * bookmarks resolve instead of 404ing: we look up the roadmap's role name and
 * bounce to `/my-learning/<slug>`, where the full learning experience lives
 * (graph + topic sidebar with progress, prerequisites, and Edit roadmap access).
 */
const RoadmapViewPage = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useRoadmapDetail(id as string)

  if (isLoading) {
    return (
      <div className="bg-bg-section flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-brand-purple-600" />
      </div>
    )
  }

  // Unknown/failed id: fall back to the bare hub, which picks the first roadmap.
  if (isError || !data) {
    return <Navigate to="/my-learning" replace />
  }

  return <Navigate to={`/my-learning/${roadmapSlug(data.roadmap.roleName)}`} replace />
}

export default RoadmapViewPage
