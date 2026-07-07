import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { TbTargetArrow } from 'react-icons/tb'
import {
  RiHome6Line,
  RiMapPinLine,
  RiBookOpenLine,
  RiPassportLine,
  RiRobot2Line,
  RiSettings4Line,
  RiQuestionLine,
  RiArrowLeftSLine,
  RiCloseLine,
} from 'react-icons/ri'
import { VoraMark, VoraWordmark } from '@/components/ui/vora-logo'
import { useIsMobile } from '@/hooks/use-is-mobile'

const SIDEBAR_COLLAPSED_KEY = 'vora:sidebar-collapsed'

interface SidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
  // Persist the collapse choice so it survives a reload (was reset on every F5).
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1',
  )
  const location = useLocation()
  const isMobile = useIsMobile()
  // Collapse is a desktop-only affordance (the toggle button is md:grid). On mobile
  // the drawer must always render expanded, otherwise a desktop-persisted collapse
  // leaves the mobile menu icon-only with no labels and no way to expand it.
  const effectiveCollapsed = isCollapsed && !isMobile

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
      return next
    })
  }

  const isMenuMatch = (pathKeywords: string | string[]) => {
    const currentPath = location.pathname.toLowerCase()

    if (Array.isArray(pathKeywords)) {
      return pathKeywords.some((keyword) => currentPath.includes(keyword.toLowerCase()))
    }

    return currentPath.includes(pathKeywords.toLowerCase())
  }

  const getNavClass = (keywords: string | string[]) => {
    const isActive = isMenuMatch(keywords)

    return `flex items-center ${
      effectiveCollapsed ? 'justify-center' : 'gap-3 px-4'
    } py-3 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-purple-300 focus-visible:outline-none ${
      isActive
        ? 'bg-bg-lavender text-brand-purple-700 font-semibold'
        : 'text-text-muted hover:bg-bg-section hover:text-text-secondary font-medium'
    }`
  }

  return (
    <aside
      className={`border-border-soft fixed inset-y-0 left-0 z-40 flex h-full w-65 shrink-0 flex-col justify-between border-r bg-white transition-transform duration-300 ease-in-out md:relative md:inset-auto md:z-auto md:translate-x-0 md:transition-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${effectiveCollapsed ? 'md:w-22' : 'md:w-65'}`}
    >
      <div>
        {/* Header / Logo */}
        <div className={`flex h-20 items-center ${effectiveCollapsed ? 'justify-center' : 'px-8'}`}>
          {/* Logo links home so clicking the brand returns to the dashboard. */}
          <Link to="/dashboard" aria-label="VORA — go to dashboard" onClick={onClose}>
            {effectiveCollapsed ? (
              <VoraMark className="h-9 w-9" />
            ) : (
              <VoraWordmark className="overflow-hidden" />
            )}
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-text-muted hover:text-text-secondary focus-visible:ring-brand-purple-300 ml-auto rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none md:hidden"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1 overflow-hidden px-4 py-4" onClick={onClose}>
          <NavLink to="/dashboard" className={getNavClass('/dashboard')}>
            <RiHome6Line className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/roadmaps" className={getNavClass(['/roadmaps', '/edit-roadmap'])}>
            <RiMapPinLine className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>Roadmaps</span>}
          </NavLink>

          <NavLink to="/goals" className={getNavClass('/goal')}>
            <TbTargetArrow className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>Goals</span>}
          </NavLink>

          <NavLink
            to="/my-learning"
            className={getNavClass(['/my-learning', '/sections', '/topic'])}
          >
            <RiBookOpenLine className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>My Learning</span>}
          </NavLink>

          <NavLink to="/passport" className={getNavClass('/passport')}>
            <RiPassportLine className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>Passport</span>}
          </NavLink>

          <NavLink to="/ai-assistant" className={getNavClass('/ai')}>
            <RiRobot2Line className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>AI Assistant</span>}
          </NavLink>

          <NavLink to="/settings" className={getNavClass('/setting')}>
            <RiSettings4Line className="h-5 w-5 shrink-0" />
            {!effectiveCollapsed && <span>Settings</span>}
          </NavLink>
        </nav>
      </div>

      <div className="mb-4 flex flex-col gap-2 p-4">
        <button
          onClick={toggleCollapsed}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="hover:border-brand-purple-600 hover:bg-brand-purple-600 border-border-soft text-text-placeholder absolute top-24 -right-3.5 z-20 hidden h-7 w-7 place-items-center rounded-full border bg-white shadow-md transition-all duration-200 ease-out hover:scale-110 hover:text-white active:scale-95 md:grid"
        >
          <RiArrowLeftSLine
            className={`h-5 w-5 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
        <NavLink to="/support" className={getNavClass('/support')} onClick={onClose}>
          <RiQuestionLine className="h-5 w-5 shrink-0" />
          {!effectiveCollapsed && <span>Help & Support</span>}
        </NavLink>
      </div>
    </aside>
  )
}
