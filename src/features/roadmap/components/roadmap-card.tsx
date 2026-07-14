import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { RiTimeLine, RiListUnordered, RiBarChartBoxLine } from 'react-icons/ri'
import { apiClient } from '@/lib/api-client'
import { useEnrollRoadmap } from '../hooks/use-enroll-roadmap'
import { roadmapSlug } from '@/features/learning/lib/roadmap-slug'
import RoadmapPreviewModal from './roadmap-preview-modal'
import { RoadmapArt } from './roadmap-art'
import { resolveDefaultBranchSelection, type ForkableBranch } from '../lib/branch-selection'

interface RoadmapCardData {
  _id: string
  roleName?: string
  description?: string
  difficulty?: string
  duration?: string
  topicsCount?: number
}

interface RoadmapCardProps {
  data: RoadmapCardData
  isEnrolled?: boolean
  /** Present only for an enrolled roadmap — the user-roadmap id the preview's
   *  "Edit Roadmap" button opens in the editor (/roadmaps/:id/edit). */
  userRoadmapId?: string
}

export default function RoadmapCard({ data, isEnrolled = false, userRoadmapId }: RoadmapCardProps) {
  const displayTitle = data.roleName ?? 'Roadmap'
  const [previewOpen, setPreviewOpen] = useState(false)
  const navigate = useNavigate()
  const enroll = useEnrollRoadmap()

  const { data: branches = [], isLoading: branchesLoading } = useQuery<ForkableBranch[]>({
    queryKey: ['master-roadmap-branches', data._id],
    queryFn: async () => {
      const res = await apiClient.get(`/master-roadmaps/${data._id}/branches`)
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  // Quick-enroll uses the default path per exclusive group (the BE rejects
  // selecting two branches of one group); picking a path lives in the preview.
  const handleEnroll = () =>
    enroll.mutate({
      masterRoadmapId: data._id,
      roleName: displayTitle,
      branchSelections: resolveDefaultBranchSelection(branches),
    })

  return (
    <div className="border-border-soft bg-bg-card flex h-full flex-col justify-between rounded-3xl border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <RoadmapArt title={displayTitle} variant="default" />

      <div className="mt-4">
        <h3 className="text-text-primary mb-1.5 text-[17px] leading-tight font-bold break-words">
          {displayTitle}
        </h3>
        <p className="text-text-muted mb-4 line-clamp-2 text-sm break-words">
          {data.description ?? 'No description available.'}
        </p>
      </div>

      <div className="mt-auto">
        {(data.difficulty || data.duration || !!data.topicsCount) && (
          <div className="text-text-secondary mb-5 flex items-center justify-between text-xs font-bold">
            {data.difficulty && (
              <span className="flex items-center gap-1">
                <RiBarChartBoxLine size={16} className="text-text-placeholder" />
                {data.difficulty}
              </span>
            )}
            {data.duration && (
              <span className="flex items-center gap-1">
                <RiTimeLine size={16} className="text-text-placeholder" />
                {data.duration}
              </span>
            )}
            {!!data.topicsCount && (
              <span className="flex items-center gap-1">
                <RiListUnordered size={16} className="text-text-placeholder" />
                {data.topicsCount} topics
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="border-brand-purple-600 text-brand-purple-600 hover:bg-bg-lavender focus-visible:ring-brand-purple-300 flex-1 rounded-xl border-2 py-2 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            Customize
          </button>
          {isEnrolled ? (
            <button
              onClick={() => navigate(`/my-learning/${roadmapSlug(displayTitle)}`)}
              className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 flex-1 rounded-xl py-2 text-sm font-bold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enroll.isPending || branchesLoading || branches.length === 0}
              className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 flex-1 rounded-xl py-2 text-sm font-bold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enroll.isPending || branchesLoading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                'Use roadmap'
              )}
            </button>
          )}
        </div>
      </div>

      {previewOpen && (
        <RoadmapPreviewModal
          roadmapId={data._id}
          roleName={displayTitle}
          isEnrolled={isEnrolled}
          userRoadmapId={userRoadmapId}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
