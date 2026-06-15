import { Routes, Route } from 'react-router'
// import LandingPage from './pages/landing-page'
import OnboardingMain from '@/features/onboarding/components/onboarding-main'
import DashboardPage from '@/pages/dashboard-page'
import SectionDetailPage from '@/features/section/section-detail-page'
import DemoRoadmapPage from '@/pages/demo-roadmap-page'
import { QuizMCQPage } from '@/features/quiz/quiz-mcq-page'
import { MainLayout } from '@/components/shared/layout/main_layout'
/**
 * Central route config for the app.
 * Add new pages here as features come online.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* --- NHÓM TRANG ĐỘC LẬP (FULL MÀN HÌNH) --- */}
      <Route path="/" element={<OnboardingMain />} />
      <Route path="/demo-roadmap" element={<DemoRoadmapPage />} />

      {/* Cảnh báo vàng dòng 7 sẽ hết vì QuizMCQPage đã được dùng ở đây: */}
      <Route path="/quizzes/:quizId/attempt" element={<QuizMCQPage />} />

      {/* --- NHÓM TRANG DÙNG CHUNG NAVBAR / SIDEBAR --- */}
      {/* Cảnh báo vàng dòng 8 sẽ hết vì MainLayout đã được dùng ở đây: */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sections/:id" element={<SectionDetailPage />} />

        <Route
          path="/roadmaps/browse"
          element={
            <div className="flex h-full items-center justify-center text-2xl font-bold text-base-content/30">
              🚧 Trang Browse Roadmaps (Task 14 sẽ làm)
            </div>
          }
        />

        <Route
          path="/roadmaps/:id"
          element={
            <div className="flex h-full items-center justify-center text-2xl font-bold text-base-content/30">
              🚧 Trang Roadmap View (Đang chờ Khôi code)
            </div>
          }
        />

        <Route
          path="/dashboard/add-role"
          element={
            <div className="flex h-full items-center justify-center text-2xl font-bold text-base-content/30">
              🚧 Trang Add Role (Task 20 sẽ làm)
            </div>
          }
        />
      </Route>

      {/* --- FALLBACK 404 --- */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold">
            404 Not Found
          </div>
        }
      />
    </Routes>
  )
}
