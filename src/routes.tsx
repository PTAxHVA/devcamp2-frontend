import { Routes, Route } from 'react-router'

/**
 * Central route config for the app.
 * Add new pages here as features come online.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
