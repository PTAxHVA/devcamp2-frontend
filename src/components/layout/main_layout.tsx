import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar, Navbar } from '@/components/shared/'

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-bg-section/50 text-text-primary flex h-screen w-full overflow-hidden font-sans">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
