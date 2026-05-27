import { Link } from 'react-router'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { StatsGrid } from '@/features/dashboard/components/stats-grid'
import { MyRoadmapsGrid } from '@/features/dashboard/components/my-roadmaps-grid'
import { ContinueLearningCard } from '@/features/dashboard/components/continue-learning-card'

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
        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!
      </div>
    )
  }

  if (!data) return null

  // MEDIUM Fix: Trả lại trạng thái empty-state bắt buộc của Task 1 nếu chưa đăng ký lộ trình nào
  if (data.roadmaps.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-base-100 text-base-content p-8 items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Chào mừng quay lại!</h1>
        <p className="text-base-content/60 max-w-sm mb-6">
          Bạn chưa chọn lộ trình học nào. Hãy tạo hoặc chọn một vai trò để bắt đầu nhé!
        </p>
        <Link to="/dashboard/add-role" className="btn btn-primary px-6">
          Khám phá ngay
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content p-8">
      <h1 className="text-3xl font-bold mb-8">Chào mừng quay lại!</h1>

      {/* HIGH Fix: Đưa component ContinueLearningCard quay trở lại trang */}
      <ContinueLearningCard continueLearning={data.continueLearning} />

      <StatsGrid
        roadmapProgress={data.stats.roadmapProgress}
        completedTopics={data.stats.completedTopics}
        daysStreak={data.streak.currentStreak}
        quizAvg={data.stats.quizAvg}
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My Roadmaps</h2>
        <MyRoadmapsGrid
          roadmaps={data.roadmaps}
          hasAvailableRoles={data.availableRolesForAdd.length > 0}
        />
      </div>

      <div className="p-8 border-2 border-dashed border-base-300 rounded-xl text-center mt-8 text-base-content/50">
        Chart & Calendar (Task 12, 13)
      </div>
    </div>
  )
}

export default DashboardPage
