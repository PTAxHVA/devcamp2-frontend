import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { StatsGrid } from '@/features/dashboard/components/stats-grid'
import { MyRoadmapsGrid } from '@/features/dashboard/components/my-roadmaps-grid'
import { ContinueLearningCard } from '@/features/dashboard/components/continue-learning-card'
import { EmptyDashboard } from '@/features/dashboard/components/empty-dashboard'
import { HiMiniSparkles, HiMiniMap } from 'react-icons/hi2'
import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout'

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard()

  // 1. Trạng thái Loading: Vẫn giữ Layout để Sidebar không bị giật/biến mất
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </DashboardLayout>
    )
  }

  // 2. Trạng thái Lỗi
  if (isError) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center text-error">
          An error occurred while loading data. Please try again!
        </div>
      </DashboardLayout>
    )
  }

  if (!data) return null

  // 3. Trạng thái Thành công có Data
  return (
    <DashboardLayout>
      {/* Đã bỏ min-h-screen và bg-base-100, thêm hiệu ứng fade-in mượt mà */}
      <div className="w-full fade-in animate-in duration-500">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          Welcome back! <HiMiniSparkles className="w-8 h-8 text-warning" />
        </h1>

        {data.roadmaps.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="flex flex-col gap-8">
            {' '}
            {/* Thêm flex-col và gap-8 để tách biệt các khu vực */}
            {/* Chỉ hiển thị card Continue Learning nếu có data */}
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
            <div className="p-8 border-2 border-dashed border-base-300 rounded-xl text-center text-base-content/50">
              Chart & Calendar (Task 12, 13)
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
