import { useNavigate } from 'react-router'
import type { DashboardData } from '../types'

interface ContinueLearningCardProps {
  continueLearning: DashboardData['continueLearning']
}

export function ContinueLearningCard({ continueLearning }: ContinueLearningCardProps) {
  const navigate = useNavigate()

  // Nhánh i: Nếu null -> return null (ẩn card)
  if (!continueLearning) {
    return null
  }

  // Nhánh ii: Có giá trị -> hiện thông tin và nút bấm
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Continue learning
        </h2>
        <h3 className="card-title text-2xl mt-1">{continueLearning.topicName}</h3>
        <p className="text-base-content/70">Section: {continueLearning.sectionName}</p>

        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/my-learning/topics/${continueLearning.topicId}/sections/${continueLearning.sectionId}?roadmapId=${continueLearning.roadmapId}`,
              )
            }
          >
            Continue learning
          </button>
        </div>
      </div>
    </div>
  )
}
