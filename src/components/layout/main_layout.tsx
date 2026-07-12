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
      {/* isolate creates a stacking context so descendant z-indexes (e.g. React
          Flow's internal z-index:1001 connection line on the edit-roadmap canvas)
          stay contained here and can't paint over the z-40 sidebar / its collapse
          toggle. Still sits below the z-50 modal/toast layer portalled to body. */}
      <div className="relative isolate flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
