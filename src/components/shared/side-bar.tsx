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
  RiMenuLine,
  RiCloseLine,
} from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
        ? 'bg-brand-purple-50 text-brand-purple-700 font-semibold'
        : 'text-slate-500 hover:bg-slate-50 font-medium'
    }`
  }

  const navLinks = (
    <>
      <NavLink
        to="/dashboard"
        className={getNavClass('/dashboard')}
        onClick={() => setMobileOpen(false)}
      >
        <RiHome6Line className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>Dashboard</span>}
      </NavLink>
      <NavLink
        to="/roadmaps"
        className={getNavClass(['/roadmaps', '/edit-roadmap'])}
        onClick={() => setMobileOpen(false)}
      >
        <RiMapPinLine className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>Roadmaps</span>}
      </NavLink>
      <NavLink to="/goals" className={getNavClass('/goal')} onClick={() => setMobileOpen(false)}>
        <TbTargetArrow className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>Goals</span>}
      </NavLink>
      <NavLink
        to="/my-learning"
        className={getNavClass(['/my-learning', '/sections', '/topic'])}
        onClick={() => setMobileOpen(false)}
      >
        <RiBookOpenLine className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>My Learning</span>}
      </NavLink>
      <NavLink
        to="/ai-assistant"
        className={getNavClass('/ai')}
        onClick={() => setMobileOpen(false)}
      >
        <RiRobot2Line className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>AI Assistant</span>}
      </NavLink>
      <NavLink
        to="/settings"
        className={getNavClass('/setting')}
        onClick={() => setMobileOpen(false)}
      >
        <RiSettings4Line className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>Settings</span>}
      </NavLink>
    </>
  )

  return (
    <>
      {/* ── Mobile hamburger button (chỉ hiện dưới md) ── */}
      <button
        className="fixed top-5 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <RiMenuLine className="h-5 w-5" />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-200 bg-white transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex h-20 items-center justify-between px-6">
            <img src={Logo} alt="VORA Logo" className="h-auto w-28 object-contain" />
            <button
              onClick={() => setMobileOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 px-4 py-4">{navLinks}</nav>
        </div>
        <div className="mb-4 p-4">
          <NavLink
            to="/support"
            className={getNavClass('/support')}
            onClick={() => setMobileOpen(false)}
          >
            <RiQuestionLine className="h-5 w-5 shrink-0" />
            <span>Help & Support</span>
          </NavLink>
        </div>
      </aside>

      {/* ── Desktop sidebar (ẩn dưới md) ── */}
      <aside
        className={`relative hidden h-full shrink-0 flex-col justify-between border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:flex ${
          isCollapsed ? 'w-22' : 'w-65'
        }`}
      >
        <div>
          <div className={`flex h-20 items-center ${isCollapsed ? 'justify-center' : 'px-8'}`}>
            <h1 className="overflow-hidden text-2xl font-bold">
              {isCollapsed ? (
                <p className="text-purple-600">V</p>
              ) : (
                <img src={Logo} alt="VORA Logo" className="h-auto w-35 object-contain" />
              )}
            </h1>
          </div>
          <nav className="space-y-1 overflow-hidden px-4 py-4">{navLinks}</nav>
        </div>

        <div className="mb-4 flex flex-col gap-2 p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:border-brand-purple-600 hover:bg-brand-purple-600 absolute top-17 -right-3.5 z-20 grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md transition-all duration-200 ease-out hover:scale-110 hover:text-white active:scale-95"
          >
            <RiArrowLeftSLine
              className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
          <NavLink to="/support" className={getNavClass('/support')}>
            <RiQuestionLine className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Help & Support</span>}
          </NavLink>
        </div>
      </aside>
    </>
  )
}
