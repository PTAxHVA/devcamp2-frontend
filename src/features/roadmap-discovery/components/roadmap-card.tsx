import { useMutation, useQuery } from '@tanstack/react-query'
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

interface MasterBranch {
  _id: string
  name: string
}

interface BranchesResponse {
  success: boolean
  data: MasterBranch[]
}

interface EnrollPayload {
  masterRoadmapId: string
  branchSelections: string[]
  sourceType: 'SUGGESTED'
}

interface EnrollResponse {
  success: boolean
  data: {
    _id: string
    roadmapId: string
    roleName: string
    sourceType: string
    isActive: boolean
    topicCount: number
    reactivated: boolean
  }
}

export function RoadmapCard({
  id,
  roleName,
  description,
  topicCount,
  isEnrolledByUser,
}: RoadmapCardProps) {
  const navigate = useNavigate()

  const { data: branchesData } = useQuery<MasterBranch[]>({
    queryKey: ['master-roadmap-branches', id],
    queryFn: async () => {
      const res = await apiClient.get<BranchesResponse>(`/master-roadmaps/${id}/branches`)
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const enrollMutation = useMutation<EnrollResponse['data'], Error, void>({
    mutationFn: async () => {
      const branches = branchesData ?? []
      if (branches.length === 0) {
        throw new Error('No branches available for this roadmap.')
      }
      const payload: EnrollPayload = {
        masterRoadmapId: id,
        branchSelections: branches.map((b) => b._id),
        sourceType: 'SUGGESTED',
      }
      const res = await apiClient.post<EnrollResponse>('/roadmaps', payload)
      return res.data.data
    },
    onSuccess: () => {
      toast.success(`Enrolled in ${roleName}!`)
      navigate('/dashboard')
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { error?: { code?: string } } }; message?: string }
      const code = e.response?.data?.error?.code
      if (code === 'ROADMAP_CAP_REACHED') {
        toast.error('You have reached the limit of 2 active roadmaps.')
      } else if (code === 'ROADMAP_ALREADY_ACTIVE') {
        toast.error('You are already enrolled in this roadmap.')
      } else if (code === 'MASTER_BRANCH_NOT_FOUND') {
        toast.error('Roadmap branches not found. Please try again.')
      } else {
        toast.error(e.message ?? 'Cannot enroll in this roadmap. Please try again later.')
      }
    },
  })

  const canEnroll = !isEnrolledByUser && (branchesData?.length ?? 0) > 0

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
            onClick={() => enrollMutation.mutate()}
            disabled={enrollMutation.isPending || isEnrolledByUser || !canEnroll}
          >
            {enrollMutation.isPending ? (
              <span className="loading loading-spinner"></span>
            ) : isEnrolledByUser ? (
              'Already Enrolled'
            ) : (
              'Use roadmap'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
