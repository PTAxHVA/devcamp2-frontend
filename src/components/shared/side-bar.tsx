import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { TbTargetArrow } from 'react-icons/tb'
import {
  RiHome6Line,
  RiMapPinLine,
  RiBookOpenLine,
  RiRobot2Line,
  RiSettings4Line,
  RiQuestionLine,
  RiArrowLeftSLine,
  RiCloseLine,
} from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

interface SidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

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
      isCollapsed ? 'justify-center' : 'gap-3 px-4'
    } py-3 rounded-xl transition-all ${
      isActive
        ? 'bg-bg-lavender text-brand-purple-700 font-semibold'
        : 'text-text-muted hover:bg-bg-section font-medium'
    }`
  }

  return (
    <aside
      className={`border-border-soft fixed inset-y-0 left-0 z-40 flex h-full w-65 shrink-0 flex-col justify-between border-r bg-white transition-transform duration-300 ease-in-out md:relative md:inset-auto md:z-auto md:translate-x-0 md:transition-all ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'md:w-22' : 'md:w-65'}`}
    >
      <div>
        {/* Header / Logo */}
        <div className={`flex h-20 items-center ${isCollapsed ? 'justify-center' : 'px-8'}`}>
          <h1 className="overflow-hidden text-2xl font-bold">
            {isCollapsed ? (
              <p className="text-brand-purple-600">V</p>
            ) : (
              <img src={Logo} alt="VORA Logo" className="h-auto w-35 object-contain" />
            )}
          </h1>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-text-muted hover:text-text-secondary ml-auto md:hidden"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1 overflow-hidden px-4 py-4" onClick={onClose}>
          <NavLink to="/dashboard" className={getNavClass('/dashboard')}>
            <RiHome6Line className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/roadmaps" className={getNavClass(['/roadmaps', '/edit-roadmap'])}>
            <RiMapPinLine className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Roadmaps</span>}
          </NavLink>

          <NavLink to="/goals" className={getNavClass('/goal')}>
            <TbTargetArrow className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Goals</span>}
          </NavLink>

          <NavLink
            to="/my-learning"
            className={getNavClass(['/my-learning', '/sections', '/topic'])}
          >
            <RiBookOpenLine className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>My Learning</span>}
          </NavLink>

          <NavLink to="/ai-assistant" className={getNavClass('/ai')}>
            <RiRobot2Line className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>AI Assistant</span>}
          </NavLink>

          <NavLink to="/settings" className={getNavClass('/setting')}>
            <RiSettings4Line className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
        </nav>
      </div>

      <div className="mb-4 flex flex-col gap-2 p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="hover:border-brand-purple-600 hover:bg-brand-purple-600 border-border-soft text-text-placeholder absolute top-17 -right-3.5 z-20 hidden h-7 w-7 place-items-center rounded-full border bg-white shadow-md transition-all duration-200 ease-out hover:scale-110 hover:text-white active:scale-95 md:grid"
        >
          <RiArrowLeftSLine
            className={`h-5 w-5 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
        <NavLink to="/support" className={getNavClass('/support')} onClick={onClose}>
          <RiQuestionLine className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Help & Support</span>}
        </NavLink>
      </div>
    </aside>
  )
}
