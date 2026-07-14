import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar, Navbar } from '@/components/shared/'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useRouteFade } from '@/hooks/use-route-fade'
import { SidebarContext } from './sidebar-context'

const SIDEBAR_COLLAPSED_KEY = 'vora:sidebar-collapsed'

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsedState] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1',
  )
  const isMobile = useIsMobile()
  const mainRef = useRouteFade<HTMLElement>()
  const effectiveCollapsed = isCollapsed && !isMobile

  const setIsCollapsed = (collapsed: boolean) => {
    setIsCollapsedState(collapsed)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, effectiveCollapsed }}>
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
          <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
