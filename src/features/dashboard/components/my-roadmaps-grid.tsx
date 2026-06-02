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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {roadmaps.map((roadmap) => {
        const badgeInfo = formatBadge(roadmap.sourceType)

        return (
          <Link
            key={roadmap.id}
            to={`/roadmaps/${roadmap.id}`}
            className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:border-primary/40 transition-all duration-200 group no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <div className="card-body p-5 flex flex-col h-full gap-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <HiMiniAcademicCap className="w-6 h-6 text-primary group-hover:text-primary-content" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {roadmap.roleName}
                    </h3>
                  </div>
                </div>
                <div
                  className={`badge text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${badgeInfo.class}`}
                >
                  {badgeInfo.text}
                </div>
              </div>

              <div className="flex-grow"></div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-base-content/70 font-medium">Progress</span>
                  <span className="font-bold text-base-content">{roadmap.progressPercentage}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full h-2"
                  value={roadmap.progressPercentage}
                  max="100"
                ></progress>
              </div>
            </div>
          </Link>
        )
      })}

      {/* MEDIUM Fix: Chỉ render nút Add Role khi hasAvailableRoles hợp lệ */}
      {hasAvailableRoles && (
        <Link
          to="/dashboard/add-role"
          className="card bg-base-200/50 border-2 border-dashed border-base-300 hover:border-primary/60 hover:bg-primary/5 transition-all min-h-[160px] group no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <div className="card-body p-5 flex flex-col items-center justify-center text-base-content/60 group-hover:text-primary transition-colors">
            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
              <HiMiniPlus className="w-6 h-6" />
            </div>
            <p className="font-medium text-sm">Add another role</p>
          </div>
        </Link>
      )}
    </div>
  )
}
