import { Routes, Route } from 'react-router'
// import LandingPage from './pages/landing-page'
import OnboardingMain from '@/features/onboarding/components/onboarding-main'
import DashboardPage from '@/pages/dashboard-page'

/**
 * Central route config for the app.
 * Add new pages here as features come online.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingMain />} />
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route
        path="/roadmaps/browse"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-base-content/30">
            🚧 Trang Browse Roadmaps (Task 14 sẽ làm)
          </div>
        }
      />

      <Route
        path="/roadmaps/:id"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-base-content/30">
            🚧 Trang Roadmap View (Đang chờ Khôi code)
          </div>
        }
      />
      <Route
        path="/dashboard/add-role"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-base-content/30">
            🚧 Trang Add Role (Task 20 sẽ làm)
          </div>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
