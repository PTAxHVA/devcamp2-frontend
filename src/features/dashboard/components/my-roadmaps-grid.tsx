import { useNavigate } from 'react-router'
import { HiMiniAcademicCap, HiMiniPlus } from 'react-icons/hi2'

interface Roadmap {
  id: string
  roleName: string
  progressPercentage: number
  sourceType: 'SUGGESTED' | 'CUSTOMIZED'
}

interface MyRoadmapsGridProps {
  roadmaps: Roadmap[]
}

// Hàm helper để đổi màu và chữ của Badge dựa vào loại Roadmap
const formatBadge = (type: string) => {
  switch (type) {
    case 'suggested':
      return { text: 'Suggested', class: 'badge-primary badge-outline' }
    case 'customized':
      return { text: 'Customized', class: 'badge-secondary badge-outline' }
    case 'from_library':
      return { text: 'Library', class: 'badge-accent badge-outline' }
    default:
      return { text: type, class: 'badge-ghost' }
  }
}

export function MyRoadmapsGrid({ roadmaps }: MyRoadmapsGridProps) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {roadmaps.map((roadmap) => {
        const badgeInfo = formatBadge(roadmap.sourceType)

        return (
          <div
            key={roadmap.id}
            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
            className="card bg-base-100 shadow-sm border border-base-200 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200 group"
          >
            <div className="card-body p-5 flex flex-col h-full gap-4">
              {/* Phần Header: Icon + Tiêu đề + Badge */}
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
                {/* Badge được canh phải */}
                <div
                  className={`badge text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${badgeInfo.class}`}
                >
                  {badgeInfo.text}
                </div>
              </div>

              {/* Khoảng trống đẩy thanh Progress xuống đáy nếu nội dung card ngắn */}
              <div className="flex-grow"></div>

              {/* Phần Thanh tiến độ */}
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
          </div>
        )
      })}

      {/* Khung "Add another role" (Task 20/21) */}
      <div
        onClick={() => navigate('/dashboard/add-role')}
        className="card bg-base-50/50 border-2 border-dashed border-base-300 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer min-h-[160px] group"
      >
        <div className="card-body p-5 flex flex-col items-center justify-center text-base-content/60 group-hover:text-primary transition-colors">
          <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
            <HiMiniPlus className="w-6 h-6" />
          </div>
          <p className="font-medium text-sm">Add another role</p>
        </div>
      </div>
    </div>
  )
}
