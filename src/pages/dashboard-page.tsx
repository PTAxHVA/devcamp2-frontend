import type { DashboardData } from '../features/dashboard/types'

export function DashboardPage() {
  // Mock tĩnh để dev UI (sau này thay bằng hook useDashboard)
  const isLoading = false
  const isError = false

  const mockData: DashboardData = {
    continueLearning: null,
    roadmaps: [
      {
        id: '1',
        roleName: 'Frontend Developer',
        progressPercentage: 20,
        sourceType: 'from_library',
      },
    ],
    streak: {
      currentStreak: 3,
      longestStreak: 5,
      lastActivityDate: '2026-05-25',
      todayCompleted: true,
    },
    stats: { roadmapProgress: 20, completedTopics: 4, quizAvg: 85 },
    availableRolesForAdd: [],
  }

  // 3 nhánh xử lý bắt buộc theo Task 1
  if (isLoading) {
    return <div className="p-6">Đang tải... {/* <DashboardSkeleton/> task 19 */}</div>
  }

  if (isError) {
    return (
      <div className="p-6">
        <button className="btn btn-error">Thử lại</button>
      </div>
    )
  }

  if (mockData.roadmaps.length === 0) {
    return <div className="p-6">Chưa có roadmap nào {/* <EmptyDashboard/> task 6 */}</div>
  }

  // Khung UI chính
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Chào mừng quay lại!</h1>

      <div className="flex flex-col gap-6">
        {/* TODO task 2-5,12,13 */}
        <div className="p-8 border-2 border-dashed border-base-300 rounded-box flex items-center justify-center text-base-content/50">
          Continue Learning card (Task 2)
        </div>

        <div className="p-8 border-2 border-dashed border-base-300 rounded-box flex items-center justify-center text-base-content/50">
          Stats grid (Task 3)
        </div>

        <div className="p-8 border-2 border-dashed border-base-300 rounded-box flex items-center justify-center text-base-content/50">
          My Roadmaps card grid (Task 4)
        </div>

        <div className="p-8 border-2 border-dashed border-base-300 rounded-box flex items-center justify-center text-base-content/50">
          Chart & Calendar (Task 12, 13)
        </div>
      </div>
    </div>
  )
}
