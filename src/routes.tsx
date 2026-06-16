import { Routes, Route } from 'react-router'
import LandingPage from './pages/landing-page'
import OnboardingLayout from './features/onboarding/OnboardingLayout'
import AuthLayout from './features/auth/auth-layout'
import LoginPage from './features/auth/login-page'
import SignupPage from './features/auth/signup-page'
import ForgotPasswordPage from './features/auth/forgot-password-page'
import ResetPasswordPage from './features/auth/reset-password-page'
import { ProtectedRoute } from './components/shared/protected-route'
import AppLayout from './components/shared/app-layout'
import ResetPasswordSuccessPage from './features/auth/reset-password-success-page'
import ProfilePage from './pages/profile-page'
import SettingsPage from './pages/settings-page'
import DashboardPage from './pages/dashboard-page'
import NotFoundPage from './pages/not-found-page'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/demo-roadmap"
        element={<div className="p-10 text-center text-xl">Demo Roadmap — coming soon</div>}
      />

      {/* Onboarding (semi-public — user bị redirect vào đây sau signup) */}
      <Route path="/onboarding" element={<OnboardingLayout />} />

      {/* Auth pages — share header logo */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/reset-password/success" element={<ResetPasswordSuccessPage />} />
      </Route>

      {/* Protected — cần token */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/roadmaps"
            element={<div className="p-6 text-xl">Roadmaps — coming soon</div>}
          />
          <Route
            path="/learning"
            element={<div className="p-6 text-xl">My Learning — coming soon</div>}
          />
          <Route
            path="/ai-assistant"
            element={<div className="p-6 text-xl">AI Assistant — coming soon</div>}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
