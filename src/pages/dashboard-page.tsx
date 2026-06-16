import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { StatsGrid } from '@/features/dashboard/components/stats-grid'
import { MyRoadmapsGrid } from '@/features/dashboard/components/my-roadmaps-grid'
import { ContinueLearningCard } from '@/features/dashboard/components/continue-learning-card'
import { EmptyDashboard } from '@/features/dashboard/components/empty-dashboard'
import { WeeklyProgressChart } from '@/features/dashboard/components/weekly-progress-chart'
import { StreakCalendar } from '@/features/dashboard/components/streak-calendar'
import { HiMiniSparkles, HiMiniMap } from 'react-icons/hi2'

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

  return (
    <div className="w-full h-full p-6 lg:p-8 fade-in animate-in duration-500">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        Welcome back! <HiMiniSparkles className="w-8 h-8 text-warning" />
      </h1>

      {data.roadmaps.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <div className="flex flex-col gap-8">
          {' '}
          {data.continueLearning && (
            <ContinueLearningCard continueLearning={data.continueLearning} />
          )}
          <StatsGrid
            roadmapProgress={data.stats.roadmapProgress}
            completedTopics={data.stats.completedTopics}
            daysStreak={data.streak.currentStreak}
            quizAvg={data.stats.quizAvg}
          />
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HiMiniMap className="w-6 h-6 text-primary" /> My Roadmaps
            </h2>
            <MyRoadmapsGrid
              roadmaps={data.roadmaps}
              hasAvailableRoles={data.availableRolesForAdd.length > 0}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TODO: wire to real API — dashboard endpoint does not yet return weekly quiz counts */}
            <WeeklyProgressChart counts={[2, 5, 3, 0, 4, 1, 6]} />
            <StreakCalendar
              streak={data.streak} // Truyền data thật từ API của dashboard vào đây
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
