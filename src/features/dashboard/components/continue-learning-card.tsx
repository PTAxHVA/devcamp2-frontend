import { useNavigate } from 'react-router'
import { FiArrowRight, FiExternalLink } from 'react-icons/fi'
interface ContinueLearningData {
  sectionId: string
  topicId: string
  userRoadmapId: string
  topicName: string
  sectionName: string
  progressPercentage: number
  completedTopics: number
  totalTopics: number
}
export function ContinueLearningCard({
  continueLearning,
}: {
  continueLearning: ContinueLearningData
}) {
  const navigate = useNavigate()

  if (!continueLearning) return null

  return (
    <div className="card bg-[#F4F0FF] border-none shadow-sm rounded-2xl overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Vòng tròn Progress */}
        <div className="flex-shrink-0">
          <div
            className="radial-progress bg-white text-primary border-[6px] border-[#EAE2FF] shadow-sm"
            style={
              {
                '--value': continueLearning.progressPercentage,
                '--size': '8rem',
                '--thickness': '0.5rem',
              } as React.CSSProperties
            }
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-2xl font-extrabold text-slate-800">
                {continueLearning.progressPercentage}%
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin khóa học */}
        <div className="flex-grow flex flex-col w-full">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
            Current roadmap
          </p>
          <h3
            className="text-2xl font-bold text-slate-900 flex items-center gap-2 group cursor-pointer w-fit"
            onClick={() => navigate(`/roadmaps/${continueLearning.userRoadmapId}`)}
          >
            {continueLearning.sectionName}
            <FiExternalLink className="text-slate-400 w-5 h-5 group-hover:text-primary transition-colors" />
          </h3>
          <div className="w-full h-px bg-slate-200/60 my-4"></div>

          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Next up
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 border border-slate-100">
                {continueLearning.completedTopics}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">{continueLearning.topicName}</span>
                <span className="text-xs text-slate-500 font-medium">
                  {continueLearning.completedTopics} of {continueLearning.totalTopics} topics
                  completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer chứa Nút bấm */}
      <div className="bg-[#EBE4FF] px-6 py-4 flex flex-wrap gap-3">
        <button
          className="btn btn-primary rounded-lg shadow-sm border-none px-6"
          onClick={() =>
            navigate(
              `/my-learning/topics/${continueLearning.topicId}/sections/${continueLearning.sectionId}?roadmapId=${continueLearning.userRoadmapId}`,
            )
          }
        >
          Continue Learning <FiArrowRight className="w-4 h-4 ml-1" />
        </button>
        <button
          className="btn btn-outline bg-white rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-5"
          onClick={() => navigate(`/roadmaps/${continueLearning.userRoadmapId}`)}
        >
          View Roadmap <FiExternalLink className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}
