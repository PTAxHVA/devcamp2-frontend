import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { RiTimeLine, RiListUnordered, RiBarChartBoxLine } from 'react-icons/ri'
import { apiClient } from '@/lib/api-client'
import { useEnrollRoadmap } from '../hooks/use-enroll-roadmap'
import { roadmapSlug } from '@/features/learning/lib/roadmap-slug'
import RoadmapPreviewModal from './roadmap-preview-modal'

interface MasterBranch {
  _id: string
  name: string
}

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
}

export default function RoadmapCard({ data, isEnrolled = false }: RoadmapCardProps) {
  const displayTitle = data.roleName ?? 'Roadmap'
  const [previewOpen, setPreviewOpen] = useState(false)
  const navigate = useNavigate()
  const enroll = useEnrollRoadmap()

  const { data: branches = [], isLoading: branchesLoading } = useQuery<MasterBranch[]>({
    queryKey: ['master-roadmap-branches', data._id],
    queryFn: async () => {
      const res = await apiClient.get(`/master-roadmaps/${data._id}/branches`)
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleEnroll = () =>
    enroll.mutate({
      masterRoadmapId: data._id,
      roleName: displayTitle,
      branchSelections: branches.map((b) => b._id),
    })

  const gradientCls = displayTitle.toLowerCase().includes('frontend')
    ? 'bg-linear-to-br from-blue-50 to-indigo-100 border-indigo-200'
    : displayTitle.toLowerCase().includes('backend')
      ? 'bg-linear-to-br from-emerald-50 to-teal-100 border-teal-200'
      : 'bg-linear-to-br from-slate-50 to-gray-100 border-border-soft'

  const textCls = displayTitle.toLowerCase().includes('frontend')
    ? 'text-indigo-600'
    : displayTitle.toLowerCase().includes('backend')
      ? 'text-teal-600'
      : 'text-text-placeholder'

  return (
    <div className="border-border-soft flex h-full flex-col justify-between rounded-3xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div
        className={`mb-4 flex h-36 items-center justify-center rounded-2xl border border-transparent p-4 text-center ${gradientCls}`}
      >
        <span className={`text-xl font-black opacity-80 ${textCls}`}>{displayTitle}</span>
      </div>

      <div>
        <h3 className="text-text-primary mb-1.5 text-[17px] leading-tight font-bold">
          {displayTitle}
        </h3>
        <p className="text-text-muted mb-4 line-clamp-2 text-sm">
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
            className="border-brand-purple-600 text-brand-purple-600 hover:bg-bg-lavender flex-1 rounded-xl border-2 py-2 text-sm font-bold transition-colors"
          >
            Preview
          </button>
          {isEnrolled ? (
            <button
              onClick={() => navigate(`/my-learning/${roadmapSlug(displayTitle)}`)}
              className="bg-btn-primary-bg hover:bg-btn-primary-hover flex-1 rounded-xl py-2 text-sm font-bold text-white transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enroll.isPending || branchesLoading || branches.length === 0}
              className="bg-btn-primary-bg hover:bg-btn-primary-hover flex-1 rounded-xl py-2 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
