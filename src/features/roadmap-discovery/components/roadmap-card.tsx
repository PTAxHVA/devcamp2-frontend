import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { FiBook, FiLayers } from 'react-icons/fi'
export interface RoadmapCardProps {
  id: string
  roleName: string
  description: string
  topicCount: number
  isEnrolledByUser: boolean
}
export function RoadmapCard({
  id,
  roleName,
  description,
  topicCount,
  isEnrolledByUser,
}: RoadmapCardProps) {
  const navigate = useNavigate()

  const enrollMutation = useMutation({
    mutationFn: async (masterRoadmapId: string) => {
      const res = await apiClient.post('/roadmaps', { masterRoadmapId, sourceType: 'from_library' })
      return res.data.data
    },
    onSuccess: () => navigate('/roadmaps/save-success'),
    onError: (err: unknown) => {
      const e = err as { response?: { status?: number } }
      if (e.response?.status === 409)
        toast.error('You already have this roadmap or have reached the limit of 2 roadmaps')
      else toast.error('Can not enroll in this roadmap, please try again later.')
    },
  })

  return (
    <div className="card bg-base-100 shadow-md border border-base-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-xl font-bold flex items-center gap-2">
            <FiBook className="text-primary group-hover:animate-pulse" />
            {roleName}
          </h2>
          {isEnrolledByUser && <div className="badge badge-primary badge-outline">Enrolled</div>}
        </div>
        <p className="text-base-content/80 text-sm mt-2 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 mt-4 text-sm font-medium">
          <FiLayers className="text-secondary" />
          <span>{topicCount} Topics</span>
        </div>
        <div className="card-actions mt-6">
          <button
            className="btn btn-primary w-full transition-transform active:scale-95"
            onClick={() => enrollMutation.mutate(id)}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Use roadmap'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
