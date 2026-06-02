import { Routes, Route } from 'react-router'
// import LandingPage from './pages/landing-page'
import OnboardingMain from '@/features/onboarding/components/onboarding-main'
import SectionDetailPage from './features/section/section-detail-page'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SectionDetailPage />} />

      <Route path="/onboarding" element={<OnboardingMain />} />

      <Route
        path="/roadmaps/browse"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-base-content/30">
            Trang Browse Roadmaps (Task 14 sẽ làm)
          </div>
        }
      />

      <Route
        path="/roadmaps/:id"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-base-content/30">
            Trang Roadmap View (Đang chờ Khôi code)
          </div>
        }
      />

      <Route
        path="/dashboard/add-role"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-base-content/30">
            Trang Add Role (Task 20 sẽ làm)
          </div>
        }
      />

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
