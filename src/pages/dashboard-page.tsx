import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { StatsGrid } from '@/features/dashboard/components/stats-grid'
import { MyRoadmapsGrid } from '@/features/dashboard/components/my-roadmaps-grid'
import { ContinueLearningCard } from '@/features/dashboard/components/continue-learning-card'
import { EmptyDashboard } from '@/features/dashboard/components/empty-dashboard'
import { WeeklyProgressChart } from '@/features/dashboard/components/weekly-progress-chart'
import { StreakCalendar } from '@/features/dashboard/components/streak-calendar'
import { Link } from 'react-router'
import { FiExternalLink } from 'react-icons/fi'

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-full w-full flex items-center justify-center text-error">
        An error occurred while loading data. Please try again!
      </div>
    )
  }

  if (!data) return null

  const displayName = (data as typeof data & { userName?: string }).userName || 'Student'

  return (
    <div className="w-full h-full p-6 lg:p-8 fade-in animate-in duration-500 max-w-[1400px] mx-auto">
      {/* 1. Header Khu vực Lời chào */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-base-content/60 mt-2 font-medium">
            Pick up where you left off and keep building your skills.
          </p>
        </div>
        <Link
          to="/roadmaps/browse"
          className="btn btn-outline btn-sm bg-white rounded-full px-4 border-slate-300 shadow-sm hover:bg-slate-50"
        >
          Browse all Roadmaps <FiExternalLink className="ml-1" />
        </Link>
      </div>

      {data.roadmaps.length === 0 ? (
        <EmptyDashboard />
      ) : (
        /* 2. Cấu trúc 2 cột chính */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* CỘT TRÁI (Chiếm 7/12 chiều rộng) */}
          <div className="xl:col-span-7 flex flex-col gap-8">
            {data.continueLearning && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
                <ContinueLearningCard continueLearning={data.continueLearning} />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-slate-900">My Roadmaps</h2>
                <Link
                  to="/roadmaps/browse"
                  className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                >
                  View all <span className="text-lg leading-none">›</span>
                </Link>
              </div>
              <MyRoadmapsGrid
                roadmaps={data.roadmaps}
                hasAvailableRoles={data.availableRolesForAdd.length > 0}
              />
            </div>
          </div>

          {/* CỘT PHẢI (Chiếm 5/12 chiều rộng) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <StatsGrid
              roadmapProgress={data.stats.roadmapProgress}
              completedTopics={data.stats.completedTopics}
              daysStreak={data.streak.currentStreak}
              quizAvg={data.stats.quizAvg}
            />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Weekly Progress</h2>
                <select className="select select-bordered select-sm rounded-full bg-white font-medium">
                  <option>This week</option>
                  <option>Last week</option>
                </select>
              </div>
              <WeeklyProgressChart counts={[4, 8, 5, 9, 6, 2, 3]} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Learning Streak</h2>
                <div className="flex items-center gap-2 text-sm font-bold">
                  This week <span className="text-warning text-lg">🔥</span>
                </div>
              </div>
              <StreakCalendar streak={data.streak} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
