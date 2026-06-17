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
import { QuizMCQPage } from '@/features/quiz/quiz-mcq-page'
import { MainLayout } from '@/components/layout/main_layout'
import { QuizResultPassPage } from '@/features/quiz/quiz-result-pass-page'
import { QuizResultFailPage } from '@/features/quiz/quiz-result-fail-page'
import { BrowseRoadmapsPage } from '@/pages/browse-roadmaps-page'

/**
 * Central route config for the app.
 * Add new pages here as features come online.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* First visit / not logged in -> Landing. Returning logged-in user -> Dashboard. */}
      <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route path="/onboarding" element={<OnboardingMain />} />
      <Route path="/LandingPage" element={<LandingPage />} />
      <Route path="/demo-roadmap" element={<DemoRoadmapPage />} />

      {/* Full-screen section quiz & results (no sidebar/navbar) */}
      <Route path="/quizzes/:quizId/attempt" element={<QuizMCQPage />} />
      <Route path="/quizzes/:attemptId/result/pass" element={<QuizResultPassPage />} />
      <Route path="/quizzes/:attemptId/result/fail" element={<QuizResultFailPage />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/my-learning/topics/:topicId/sections/:sectionId"
          element={<SectionDetailPage />}
        />
        <Route path="/my-learning/topics/:id" element={<TopicDetailPage />} />
        {/* Browse Roadmaps — must come before /roadmaps/:id to avoid :id="browse" */}
        <Route path="/roadmaps/browse" element={<BrowseRoadmapsPage />} />

        <Route path="/roadmaps/:id" element={<RoadmapViewPage />} />
        <Route path="/roadmaps/:id/edit" element={<EditCurrentRoadmapPage />} />

        <Route
          path="/roadmaps"
          element={
            <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
              🚧 Trang All Roadmaps (Đang xây dựng)
            </div>
          }
        />

        <Route
          path="/my-learning"
          element={
            <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
              🚧 Trang My Learning (Đang xây dựng)
            </div>
          }
        />

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
          path="/settings"
          element={
            <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
              🚧 Trang Settings (Đang xây dựng)
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

      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center text-2xl font-bold text-slate-800">
            404 Not Found
          </div>
        }
      />
    </Routes>
  )
}
