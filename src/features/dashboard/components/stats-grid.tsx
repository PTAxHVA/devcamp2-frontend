import { HiMiniMap, HiMiniBookOpen, HiMiniFire, HiMiniSparkles } from 'react-icons/hi2'

interface StatsGridProps {
  roadmapProgress: number
  completedTopics: number
  daysStreak: number
  quizAvg: number
}

export function StatsGrid({
  roadmapProgress,
  completedTopics,
  daysStreak,
  quizAvg,
}: StatsGridProps) {
  const stats = [
    {
      id: 'progress',
      label: 'Roadmap Progress',
      value: `${roadmapProgress}%`,
      Icon: HiMiniMap,
      bgClass: 'bg-primary/10',
      textClass: 'text-primary',
    },
    {
      id: 'completed',
      label: 'Completed Topics',
      value: completedTopics === -1 ? '--' : completedTopics,
      Icon: HiMiniBookOpen,
      bgClass: 'bg-success/10',
      textClass: 'text-success',
    },
    {
      id: 'streak',
      label: 'Days Streak',
      value: daysStreak,
      Icon: HiMiniFire,
      bgClass: 'bg-warning/10',
      textClass: 'text-warning',
    },
    {
      id: 'quiz',
      label: 'Quiz Avg',
      value: quizAvg === -1 ? '--' : `${quizAvg}%`,
      Icon: HiMiniSparkles,
      bgClass: 'bg-secondary/10',
      textClass: 'text-secondary',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const { Icon } = stat
        return (
          <div key={stat.id} className="card bg-base-100 border-base-200 border shadow-sm">
            <div className="card-body items-center p-5 text-center">
              <div
                className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${stat.bgClass}`}
              >
                <Icon className={`h-6 w-6 ${stat.textClass}`} />
              </div>
              {/* Fixed two-line label box: at widths where only SOME labels wrap
                  (e.g. ~1700px effective), the values sat on different baselines —
                  "first two low, last two floating" (Y5). */}
              <h3 className="text-base-content/70 flex min-h-10 items-center justify-center text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-base-content mt-1 text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
