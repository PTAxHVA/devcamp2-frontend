import { Link } from 'react-router'
import { HiMiniAcademicCap, HiMiniPlus } from 'react-icons/hi2'
import type { DashboardData } from '@/features/dashboard/types'

interface MyRoadmapsGridProps {
  roadmaps: DashboardData['roadmaps']
  hasAvailableRoles: boolean
}

const formatBadge = (type: DashboardData['roadmaps'][number]['sourceType']) => {
  switch (type) {
    case 'SUGGESTED':
      return { text: 'Suggested', class: 'badge-primary badge-outline' }
    case 'CUSTOMIZED':
      return { text: 'Customized', class: 'badge-secondary badge-outline' }
    default:
      return { text: String(type), class: 'badge-ghost' }
  }
}

export function MyRoadmapsGrid({ roadmaps, hasAvailableRoles }: MyRoadmapsGridProps) {
  // 1. Chỉ lấy tối đa 2 roadmaps để hiển thị
  const displayedRoadmaps = roadmaps.slice(0, 2)

  return (
    // 2. Chỉnh lại lưới thành tối đa 2 cột
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {displayedRoadmaps.map((roadmap) => {
        const badgeInfo = formatBadge(roadmap.sourceType)

        return (
          <Link
            key={roadmap.id}
            to={`/roadmaps/${roadmap.id}`}
            className="card bg-base-100 border-base-200 hover:border-primary/40 group focus:ring-primary border no-underline shadow-sm transition-all duration-200 hover:shadow-md focus:border-transparent focus:ring-2 focus:outline-none"
          >
            <div className="card-body flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 group-hover:bg-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors">
                    <HiMiniAcademicCap className="text-primary group-hover:text-primary-content h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base-content group-hover:text-primary line-clamp-2 leading-tight font-semibold transition-colors">
                      {roadmap.roleName}
                    </h3>
                  </div>
                </div>
                <div
                  className={`badge text-[10px] font-bold tracking-wider whitespace-nowrap uppercase ${badgeInfo.class}`}
                >
                  {badgeInfo.text}
                </div>
              </div>

              <div className="flex-grow"></div>

              <div className="space-y-1.5">
                <div className="flex items-end justify-between text-sm">
                  <span className="text-base-content/70 font-medium">Progress</span>
                  <span className="text-base-content font-bold">{roadmap.progressPercentage}%</span>
                </div>
                <progress
                  className="progress progress-primary h-2 w-full"
                  value={roadmap.progressPercentage}
                  max="100"
                ></progress>
              </div>
            </div>
          </Link>
        )
      })}

      {/* 3. Render nút Add Role khi có ÍT HƠN 2 roadmaps */}
      {hasAvailableRoles && roadmaps.length < 2 && (
        <Link
          to="/dashboard/add-role"
          className="card bg-base-200/50 border-base-300 hover:border-primary/60 hover:bg-primary/5 group focus:ring-primary min-h-[160px] border-2 border-dashed no-underline transition-all focus:border-transparent focus:ring-2 focus:outline-none"
        >
          <div className="card-body text-base-content/60 group-hover:text-primary flex flex-col items-center justify-center p-5 transition-colors">
            <div className="bg-base-200 group-hover:bg-primary/20 mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <HiMiniPlus className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Add another role</p>
          </div>
        </Link>
      )}
    </div>
  )
}
