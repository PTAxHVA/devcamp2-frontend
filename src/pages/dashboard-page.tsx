import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { StatsGrid } from '@/features/dashboard/components/stats-grid'
import { MyRoadmapsGrid } from '@/features/dashboard/components/my-roadmaps-grid'
import { ContinueLearningCard } from '@/features/dashboard/components/continue-learning-card'
import { EmptyDashboard } from '@/features/dashboard/components/empty-dashboard'
import { HiMiniSparkles, HiMiniMap } from 'react-icons/hi2'

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-error">
        An error occurred while loading data. Please try again!
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        Welcome back! <HiMiniSparkles className="w-8 h-8 text-warning" />
      </h1>

      {data.roadmaps.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <>
          <ContinueLearningCard continueLearning={data.continueLearning} />

          <StatsGrid
            roadmapProgress={data.stats.roadmapProgress}
            completedTopics={data.stats.completedTopics}
            daysStreak={data.streak.currentStreak}
            quizAvg={data.stats.quizAvg}
          />

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HiMiniMap className="w-6 h-6 text-primary" /> My Roadmaps
            </h2>
            <MyRoadmapsGrid
              roadmaps={data.roadmaps}
              hasAvailableRoles={data.availableRolesForAdd.length > 0}
            />
          </div>

          <div className="p-8 border-2 border-dashed border-base-300 rounded-xl text-center mt-8 text-base-content/50">
            Chart & Calendar (Task 12, 13)
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
