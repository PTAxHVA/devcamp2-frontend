import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { StatsGrid } from '@/features/dashboard/components/stats-grid'
import { MyRoadmapsGrid } from '@/features/dashboard/components/my-roadmaps-grid'
import { ContinueLearningCard } from '@/features/dashboard/components/continue-learning-card'
import { EmptyDashboard } from '@/features/dashboard/components/empty-dashboard'
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton'
import { WeeklyProgressChart } from '@/features/dashboard/components/weekly-progress-chart'
import { StreakCalendar } from '@/features/dashboard/components/streak-calendar'
import { Link } from 'react-router'
import { FiExternalLink } from 'react-icons/fi'
import { useAuthStore } from '@/stores/auth-store'

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard()
  const authUser = useAuthStore((s) => s.user)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <div className="text-error flex h-full w-full items-center justify-center">
        An error occurred while loading data. Please try again!
      </div>
    )
  }

  if (!data) return null

  const displayName = authUser?.username || data.userName || 'Student'

  return (
    <div className="fade-in animate-in mx-auto h-full w-full max-w-[1400px] p-6 duration-500 lg:p-8">
      {/* 1. Header Khu vực Lời chào */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-text-primary text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-base-content/60 mt-2 font-medium">
            Pick up where you left off and keep building your skills.
          </p>
        </div>
        <Link
          to="/roadmaps/browse"
          className="btn btn-outline btn-sm border-border-input hover:bg-bg-section rounded-full bg-white px-4 shadow-sm"
        >
          Browse all Roadmaps <FiExternalLink className="ml-1" />
        </Link>
      </div>

      {data.roadmaps.length === 0 ? (
        <EmptyDashboard />
      ) : (
        /* 2. Cấu trúc 2 cột chính */
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* CỘT TRÁI (Chiếm 7/12 chiều rộng) */}
          <div className="flex flex-col gap-8 xl:col-span-7">
            {data.continueLearning && (
              <div className="flex flex-col gap-3">
                <h2 className="text-text-primary text-xl font-bold">Continue Learning</h2>
                <ContinueLearningCard continueLearning={data.continueLearning} />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <h2 className="text-text-primary text-xl font-bold">My Roadmaps</h2>
                <Link
                  to="/roadmaps/browse"
                  className="text-primary flex items-center gap-1 text-sm font-bold hover:underline"
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
          <div className="flex flex-col gap-6 xl:col-span-5">
            <StatsGrid
              roadmapProgress={data.stats.roadmapProgress}
              completedTopics={data.stats.completedTopics}
              daysStreak={data.streak.currentStreak}
              quizAvg={data.stats.quizAvg}
            />

            {data.weeklyProgressCounts?.some((count) => count > 0) && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-text-primary text-xl font-bold">Weekly Progress</h2>
                </div>
                <WeeklyProgressChart counts={data.weeklyProgressCounts} />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-text-primary text-xl font-bold">Learning Streak</h2>
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
