import { Link } from 'react-router'
import { HiMiniAcademicCap, HiMiniPlus, HiMiniLockClosed } from 'react-icons/hi2'
import type { DashboardData } from '@/features/dashboard/types'
import { formatRoadmapSource } from '@/features/roadmap/lib/roadmap-source-label'
import { roadmapSlug } from '@/features/learning/lib/roadmap-slug'

interface MyRoadmapsGridProps {
  roadmaps: DashboardData['roadmaps']
  hasAvailableRoles: boolean
}

const formatBadge = (type: DashboardData['roadmaps'][number]['sourceType']) => {
  const text = formatRoadmapSource(type)
  switch (type) {
    case 'SUGGESTED':
      return { text, class: 'badge-primary badge-outline' }
    case 'CUSTOMIZED':
      return { text, class: 'badge-secondary badge-outline' }
    default:
      return { text, class: 'badge-ghost' }
  }
}

export function MyRoadmapsGrid({ roadmaps, hasAvailableRoles }: MyRoadmapsGridProps) {
  // 1. Chỉ lấy tối đa 2 roadmaps để hiển thị
  const displayedRoadmaps = roadmaps.slice(0, 2)

  // Task 21: Kiểm tra xem user đã đạt giới hạn chưa (>= 2 roadmaps hoặc không còn role nào)
  const isCapped = roadmaps.length >= 2 || !hasAvailableRoles

  return (
    // 2. Chỉnh lại lưới thành tối đa 2 cột
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {displayedRoadmaps.map((roadmap) => {
        const badgeInfo = formatBadge(roadmap.sourceType)

        return (
          <Link
            key={roadmap.id}
            to={`/my-learning/${roadmapSlug(roadmap.roleName)}`}
            className="card bg-base-100 border-base-200 hover:border-primary/40 group focus:ring-primary border no-underline shadow-sm transition-all duration-200 hover:shadow-md focus:border-transparent focus:ring-2 focus:outline-none"
          >
            <div className="card-body flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 group-hover:bg-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200">
                    <HiMiniAcademicCap className="text-primary group-hover:text-primary-content h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base-content group-hover:text-primary line-clamp-2 leading-tight font-semibold transition-colors duration-200">
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

      {/* 3. Render nút Add Role (Luôn hiện, nhưng Disable và có Tooltip nếu đạt giới hạn - Task 21) */}
      <div
        className={`tooltip tooltip-bottom flex w-full ${isCapped ? 'cursor-not-allowed' : ''}`}
        data-tip={isCapped ? 'Limit reached: Max 2 roadmaps' : 'Add a new learning path'}
      >
        {isCapped ? (
          // Trạng thái vô hiệu hóa (Bỏ Link, bỏ hover, thêm icon ổ khóa)
          <div className="card bg-base-200/30 border-base-300 min-h-[160px] w-full border-2 border-dashed">
            <div className="card-body text-base-content/40 flex flex-col items-center justify-center p-5">
              <div className="bg-base-200/50 mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                <HiMiniLockClosed className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Add another role</p>
            </div>
          </div>
        ) : (
          // Trạng thái bình thường (GIỮ NGUYÊN 100% CODE CỦA FILE GỐC)
          <Link
            to="/dashboard/add-role"
            className="card bg-base-200/50 border-base-300 hover:border-primary/60 hover:bg-primary/5 group focus:ring-primary min-h-[160px] w-full border-2 border-dashed no-underline transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
          >
            <div className="card-body text-base-content/60 group-hover:text-primary flex flex-col items-center justify-center p-5 transition-colors duration-200">
              <div className="bg-base-200 group-hover:bg-primary/20 mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200">
                <HiMiniPlus className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Add another role</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
