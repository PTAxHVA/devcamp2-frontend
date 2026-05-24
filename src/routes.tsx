import { Routes, Route } from 'react-router'
// import LandingPage from './pages/landing-page'
import OnboardingMain from './features/onboarding/components/onboarding-main'
/**
 * Central route config for the app.
 * Add new pages here as features come online.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingMain />} />
      {/* <Route path="/" element={<LandingPage />} /> */}

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
