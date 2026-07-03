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

import { RoadmapCompletePage } from '@/pages/roadmap-complete-page'
import { AddAnotherRolePage } from '@/pages/add-another-role-page'
import { TermsPage, PrivacyPage } from '@/pages/legal-pages'

export function AppRoutes() {
  return (
    <Routes>
      {/* Landing — nếu đã login thì về dashboard */}
      <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      <Route path="/demo-roadmap" element={<DemoRoadmapPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Auth pages (Public Routes) */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Giải pháp A: Giữ cả 2 route để link email cũ không bị 404 */}
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/reset-password-success" element={<ResetPasswordSuccessPage />} />
      </Route>

      {/* Onboarding + full-screen quiz & results — cần đăng nhập (no sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingMain />} />
        <Route path="/quizzes/:quizId/attempt" element={<QuizAttemptPage />} />
        <Route path="/quizzes/:attemptId/result/pass" element={<QuizResultPassPage />} />
        <Route path="/quizzes/:attemptId/result/fail" element={<QuizResultFailPage />} />
      </Route>

      {/* Main App Routes — Bảo mật bằng ProtectedRoute và bọc trong MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/my-learning/topics/:topicId/sections/:sectionId"
            element={<SectionDetailPage />}
          />
          <Route path="/my-learning/topics/:id" element={<TopicDetailPage />} />

          <Route path="/roadmaps/browse" element={<BrowseRoadmapsPage />} />
          <Route path="/roadmaps/:id/complete" element={<RoadmapCompletePage />} />

          <Route path="/roadmaps/:id" element={<RoadmapViewPage />} />
          <Route path="/roadmaps/:id/edit" element={<EditCurrentRoadmapPage />} />
          <Route path="/roadmaps" element={<BrowseRoadmapsPage />} />

          <Route path="/my-learning" element={<MylearningJourneyPage />} />
          <Route path="/my-learning/:slug" element={<MylearningJourneyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route
            path="/goals"
            element={
              <div className="text-text-placeholder flex h-full items-center justify-center text-2xl font-bold">
                🚧 Goals (Coming soon)
              </div>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <div className="text-text-placeholder flex h-full items-center justify-center text-2xl font-bold">
                🚧 AI Assistant (Coming soon)
              </div>
            }
          />
          <Route
            path="/support"
            element={
              <div className="text-text-placeholder flex h-full items-center justify-center text-2xl font-bold">
                🚧 Help & Support (Coming soon)
              </div>
            }
          />
          <Route path="/dashboard/add-role" element={<AddAnotherRolePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
