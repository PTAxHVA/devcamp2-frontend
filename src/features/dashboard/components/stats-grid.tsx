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
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Ô 1: Roadmap Progress */}
      <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200">
        <div className="card-body p-5 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <HiMiniMap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-base-content/70">Roadmap Progress</h3>
          <p className="text-3xl font-bold text-base-content mt-1">{roadmapProgress}%</p>
        </div>
      </div>

      {/* Ô 2: Completed Topics */}
      <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200">
        <div className="card-body p-5 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <HiMiniBookOpen className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-base-content/70">Completed Topics</h3>
          <p className="text-3xl font-bold text-base-content mt-1">{completedTopics}</p>
        </div>
      </div>

      {/* Ô 3: Days Streak */}
      <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200">
        <div className="card-body p-5 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <HiMiniFire className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-sm font-medium text-base-content/70">Days Streak</h3>
          <p className="text-3xl font-bold text-base-content mt-1">{daysStreak}</p>
        </div>
      </div>

      {/* Ô 4: Quiz Avg */}
      <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200">
        <div className="card-body p-5 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <HiMiniSparkles className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-sm font-medium text-base-content/70">Quiz Avg</h3>
          <p className="text-3xl font-bold text-base-content mt-1">{quizAvg}%</p>
        </div>
      </div>
    </div>
  )
}
