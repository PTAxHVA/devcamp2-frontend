import { useNavigate } from 'react-router'
import { FiArrowRight, FiExternalLink } from 'react-icons/fi'

export interface ContinueLearningData {
  sectionId: string
  topicId: string
  userRoadmapId: string
  topicName: string
  sectionName: string
  progressPercentage?: number
  completedTopics?: number
  totalTopics?: number
}

export function ContinueLearningCard({
  continueLearning,
}: {
  continueLearning: ContinueLearningData
}) {
  const navigate = useNavigate()

  if (!continueLearning) return null

  const progress = continueLearning.progressPercentage || 0
  const completed = continueLearning.completedTopics || 0
  const total = continueLearning.totalTopics || 0

  return (
    <div className="card overflow-hidden rounded-2xl border-none bg-[#F4F0FF] shadow-sm">
      <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
        {/* Vòng tròn Progress */}
        <div className="flex-shrink-0">
          <div
            className="radial-progress text-primary border-[6px] border-[#EAE2FF] bg-white shadow-sm"
            style={
              {
                '--value': progress,
                '--size': '8rem',
                '--thickness': '0.5rem',
              } as React.CSSProperties
            }
          >
            <div className="flex h-full flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-800">{progress}%</span>
              <span className="mt-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin khóa học */}
        <div className="flex w-full flex-grow flex-col">
          <p className="text-primary mb-1 text-xs font-bold tracking-widest uppercase">
            Current roadmap
          </p>
          <h3
            className="group flex w-fit cursor-pointer items-center gap-2 text-2xl font-bold text-slate-900"
            onClick={() => navigate(`/roadmaps/${continueLearning.userRoadmapId}`)}
          >
            {continueLearning.sectionName}
            <FiExternalLink className="group-hover:text-primary h-5 w-5 text-slate-400 transition-colors" />
          </h3>
          <div className="my-4 h-px w-full bg-slate-200/60"></div>

          <div>
            <p className="mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Next up
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-100 bg-white font-bold text-slate-700 shadow-sm">
                {completed}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">{continueLearning.topicName}</span>
                <span className="text-xs font-medium text-slate-500">
                  {completed} of {total} topics completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer chứa Nút bấm */}
      <div className="flex flex-wrap gap-3 bg-[#EBE4FF] px-6 py-4">
        <button
          className="btn btn-primary rounded-lg border-none px-6 shadow-sm"
          onClick={() =>
            navigate(
              `/my-learning/topics/${continueLearning.topicId}/sections/${continueLearning.sectionId}?roadmapId=${continueLearning.userRoadmapId}`,
            )
          }
        >
          Continue Learning <FiArrowRight className="ml-1 h-4 w-4" />
        </button>
        <button
          className="btn btn-outline rounded-lg border-slate-200 bg-white px-5 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          onClick={() => navigate(`/roadmaps/${continueLearning.userRoadmapId}`)}
        >
          View Roadmap <FiExternalLink className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
