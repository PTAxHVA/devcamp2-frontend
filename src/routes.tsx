import { Routes, Route, Navigate } from 'react-router'
import LandingPage from './pages/landing-page'
import { isAuthenticated } from '@/lib/auth'
import OnboardingMain from '@/features/onboarding/components/onboarding-main'
import DashboardPage from '@/pages/dashboard-page'
import SectionDetailPage from '@/features/section/section-detail-page'
import DemoRoadmapPage from '@/pages/demo-roadmap-page'
import TopicDetailPage from '@/features/topic/topic-detail-page'
import RoadmapViewPage from '@/features/roadmap/roadmap-view-page'
import EditCurrentRoadmapPage from '@/features/customize/edit-current-roadmap-page'
import { QuizAttemptPage } from '@/features/quiz/quiz-attempt-page'
import { MainLayout } from '@/components/layout/main_layout'
import { QuizResultPassPage } from '@/features/quiz/quiz-result-pass-page'
import { QuizResultFailPage } from '@/features/quiz/quiz-result-fail-page'
import BrowseRoadmapsPage from '@/pages/browse-roadmaps-page'
import MylearningJourneyPage from '@/pages/my-learning-page'
import AuthLayout from './features/auth/auth-layout'
import LoginPage from './features/auth/login-page'
import SignupPage from './features/auth/signup-page'
import ForgotPasswordPage from './features/auth/forgot-password-page'
import ResetPasswordPage from './features/auth/reset-password-page'
import ResetPasswordSuccessPage from './features/auth/reset-password-success-page'
import { ProtectedRoute } from '@/components/shared/protected-route'
import NotFoundPage from '@/pages/not-found-page'
import ProfilePage from '@/pages/profile-page'
import SettingsPage from '@/pages/settings-page'

export function AppRoutes() {
  return (
    <Routes>
      {/* Landing — nếu đã login thì về dashboard */}
      <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      <Route path="/demo-roadmap" element={<DemoRoadmapPage />} />

      {/* Auth pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/reset-password/success" element={<ResetPasswordSuccessPage />} />
      </Route>

      {/* Onboarding + full-screen quiz & results — cần đăng nhập (no sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingMain />} />
        <Route path="/quizzes/:quizId/attempt" element={<QuizAttemptPage />} />
        <Route path="/quizzes/:attemptId/result/pass" element={<QuizResultPassPage />} />
        <Route path="/quizzes/:attemptId/result/fail" element={<QuizResultFailPage />} />
      </Route>

      {/* App pages — cần đăng nhập (ProtectedRoute), dùng MainLayout của team */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/my-learning/topics/:topicId/sections/:sectionId"
            element={<SectionDetailPage />}
          />
          <Route path="/my-learning/topics/:id" element={<TopicDetailPage />} />
          <Route path="/roadmaps/browse" element={<BrowseRoadmapsPage />} />
          <Route path="/roadmaps/:id" element={<RoadmapViewPage />} />
          <Route path="/roadmaps/:id/edit" element={<EditCurrentRoadmapPage />} />
          <Route path="/roadmaps" element={<BrowseRoadmapsPage />} />
          <Route path="/my-learning" element={<MylearningJourneyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/goals"
            element={
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
                🚧 Trang Goals (Đang xây dựng)
              </div>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
                🚧 Trang AI Assistant (Đang xây dựng)
              </div>
            }
          />
          <Route
            path="/support"
            element={
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
                🚧 Trang Help & Support (Đang xây dựng)
              </div>
            }
          />
          <Route
            path="/dashboard/add-role"
            element={
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
                🚧 Trang Add Role (Task 20 sẽ làm)
              </div>
            }
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
