import { useNavigate } from 'react-router'
import { FiArrowRight, FiExternalLink } from 'react-icons/fi'

export interface ContinueLearningData {
  sectionId: string
  topicId: string
  userRoadmapId: string
  topicName: string
  sectionName: string
  roadmapName: string
  progressPercentage: number
  completedSections: number
  totalSections: number
}

export function ContinueLearningCard({
  continueLearning,
}: {
  continueLearning: ContinueLearningData
}) {
  const navigate = useNavigate()

  if (!continueLearning) return null

  const progress = continueLearning.progressPercentage || 0
  const completed = continueLearning.completedSections || 0
  const total = continueLearning.totalSections || 0

  return (
    <div className="card overflow-hidden rounded-2xl border-none bg-[#F4F0FF] shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
        {/* Vòng tròn Progress */}
        <div className="flex-shrink-0">
          <div
            className="radial-progress text-primary bg-bg-card border-[6px] border-[#EAE2FF] shadow-sm"
            style={
              {
                '--value': progress,
                '--size': '8rem',
                '--thickness': '0.5rem',
              } as React.CSSProperties
            }
          >
            <div className="flex h-full flex-col items-center justify-center">
              <span className="text-text-primary text-2xl font-extrabold">{progress}%</span>
              <span className="text-text-muted mt-1 text-[10px] font-bold tracking-wider uppercase">
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
          {/* Navigate by id, not by a slug derived from roadmapName: roadmapName can
              be a display fallback that round-trips to no roadmap. /roadmaps/:id
              resolves the real roleName server-side and redirects to my-learning. */}
          <h3
            className="group text-text-primary hover:text-primary flex cursor-pointer items-center gap-2 text-2xl font-bold transition-colors duration-200"
            onClick={() => navigate(`/roadmaps/${continueLearning.userRoadmapId}`)}
          >
            <span className="min-w-0 break-words">{continueLearning.roadmapName}</span>
            <FiExternalLink className="group-hover:text-primary text-text-placeholder h-5 w-5 shrink-0 transition-colors duration-200" />
          </h3>
          <div className="bg-border-soft/60 my-4 h-px w-full"></div>

          <div>
            <p className="text-text-muted mb-2 text-[11px] font-bold tracking-widest uppercase">
              Next up
            </p>
            <div className="flex items-center gap-3">
              <div className="border-border-soft text-text-secondary bg-bg-card flex h-8 w-8 shrink-0 items-center justify-center rounded-md border font-bold shadow-sm">
                {completed}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-text-primary font-bold break-words">
                  {continueLearning.topicName}
                </span>
                <span className="text-text-muted text-xs font-medium">
                  {completed} of {total} sections completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer chứa Nút bấm */}
      <div className="flex flex-wrap gap-3 bg-[#EBE4FF] px-6 py-4">
        <button
          className="btn btn-primary focus-visible:ring-brand-purple-300 group rounded-lg border-none px-6 shadow-sm transition-colors duration-200 focus-visible:ring-2"
          onClick={() =>
            navigate(
              `/my-learning/topics/${continueLearning.topicId}/sections/${continueLearning.sectionId}?roadmapId=${continueLearning.userRoadmapId}`,
            )
          }
        >
          Continue Learning{' '}
          <FiArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
        <button
          className="btn btn-outline border-border-soft text-text-secondary hover:border-border-input hover:bg-bg-section bg-bg-card focus-visible:ring-brand-purple-300 rounded-lg px-5 transition-colors duration-200 focus-visible:ring-2"
          onClick={() => navigate(`/roadmaps/${continueLearning.userRoadmapId}`)}
        >
          View Roadmap <FiExternalLink className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
