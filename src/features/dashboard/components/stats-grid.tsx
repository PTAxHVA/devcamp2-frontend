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
          <div
            key={stat.id}
            className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body p-5 items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${stat.bgClass}`}
              >
                <Icon className={`w-6 h-6 ${stat.textClass}`} />
              </div>
              <h3 className="text-sm font-medium text-base-content/70">{stat.label}</h3>
              <p className="text-3xl font-bold text-base-content mt-1">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
