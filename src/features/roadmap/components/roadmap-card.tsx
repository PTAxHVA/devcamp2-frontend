import { useNavigate } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { RiTimeLine, RiListUnordered, RiBarChartBoxLine } from 'react-icons/ri'
import { apiClient } from '@/lib/api-client'

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
}

export default function RoadmapCard({ data }: RoadmapCardProps) {
  const navigate = useNavigate()
  const displayTitle = data.roleName ?? 'Roadmap'

  const { data: branches = [] } = useQuery<MasterBranch[]>({
    queryKey: ['master-roadmap-branches', data._id],
    queryFn: async () => {
      const res = await apiClient.get(`/master-roadmaps/${data._id}/branches`)
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (branches.length === 0) throw new Error('No branches available.')
      await apiClient.post('/roadmaps', {
        masterRoadmapId: data._id,
        branchSelections: branches.map((b) => b._id),
        sourceType: 'SUGGESTED',
      })
    },
    onSuccess: () => {
      toast.success(`Enrolled in ${displayTitle}!`)
      navigate('/my-learning')
    },
    onError: (err: unknown) => {
      const code = (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data
        ?.error?.code
      if (code === 'ROADMAP_CAP_REACHED') {
        toast.error('You have reached the limit of 2 active roadmaps.')
      } else if (code === 'ROADMAP_ALREADY_ACTIVE') {
        toast.error('You are already enrolled in this roadmap.')
      } else {
        toast.error('Cannot enroll right now. Please try again.')
      }
    },
  })

  const gradientCls = displayTitle.toLowerCase().includes('frontend')
    ? 'bg-linear-to-br from-blue-50 to-indigo-100 border-indigo-200'
    : displayTitle.toLowerCase().includes('backend')
      ? 'bg-linear-to-br from-emerald-50 to-teal-100 border-teal-200'
      : 'bg-linear-to-br from-slate-50 to-gray-100 border-slate-200'

  const textCls = displayTitle.toLowerCase().includes('frontend')
    ? 'text-indigo-600'
    : displayTitle.toLowerCase().includes('backend')
      ? 'text-teal-600'
      : 'text-slate-400'

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div
        className={`mb-4 flex h-36 items-center justify-center rounded-2xl border border-transparent p-4 text-center ${gradientCls}`}
      >
        <span className={`text-xl font-black opacity-80 ${textCls}`}>{displayTitle}</span>
      </div>

      <div>
        <h3 className="mb-1.5 text-[17px] leading-tight font-bold text-slate-900">
          {displayTitle}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-500">
          {data.description ?? 'No description available.'}
        </p>
      </div>

      <div className="mt-auto">
        <div className="mb-5 flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <RiBarChartBoxLine size={16} className="text-slate-400" />
            {data.difficulty ?? 'Beginner'}
          </span>
          <span className="flex items-center gap-1">
            <RiTimeLine size={16} className="text-slate-400" />
            {data.duration ?? '8–10 weeks'}
          </span>
          <span className="flex items-center gap-1">
            <RiListUnordered size={16} className="text-slate-400" />
            {data.topicsCount ?? 0} topics
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/roadmaps/${data._id}`)}
            className="border-brand-purple-600 text-brand-purple-600 hover:bg-brand-purple-50 flex-1 rounded-xl border-2 py-2 text-sm font-bold transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => enrollMutation.mutate()}
            disabled={enrollMutation.isPending || branches.length === 0}
            className="flex-1 rounded-xl bg-[#0f3460] py-2 text-sm font-bold text-white transition-colors hover:bg-[#0a2545] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enrollMutation.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              'Use roadmap'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
