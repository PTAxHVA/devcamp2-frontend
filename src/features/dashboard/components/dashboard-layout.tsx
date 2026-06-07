import React, { useState } from 'react'
import {
  RiDashboardLine,
  RiMapPinLine,
  RiSettings4Line,
  RiQuestionLine,
  RiUser3Line,
} from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setShowHeader(false)
    } else if (currentScrollY < lastScrollY) {
      setShowHeader(true)
    }

    setLastScrollY(currentScrollY)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      <header
        className={`h-16 w-full flex bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm transition-all duration-300 ${
          showHeader ? 'mt-0' : '-mt-16'
        }`}
      >
        <div className="w-64 h-full flex items-center pl-8 pr-4 border-r border-slate-200 shrink-0 hidden md:flex">
          <a
            href="/dashboard"
            className="transition-all duration-300 hover:scale-105 active:scale-95 flex items-center mr-auto"
          >
            <img src={Logo} alt="VORA Logo" className="w-32 max-h-10 object-contain" />
          </a>
        </div>

        <div className="md:hidden h-full px-6 flex items-center">
          <a
            href="/dashboard"
            className="transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
          >
            <img src={Logo} alt="VORA Logo" className="w-28 max-h-10 object-contain" />
          </a>
        </div>

        <div className="flex-1 h-full flex items-center justify-end px-6 lg:px-12 gap-4 text-slate-500">
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 hover:bg-slate-100 hover:text-slate-700 hover:scale-105 active:scale-95 cursor-pointer">
            <RiQuestionLine className="w-5 h-5" />
          </button>

          <button className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center transition-all duration-300 hover:bg-purple-200 hover:ring-2 hover:ring-purple-300 hover:ring-offset-2 hover:scale-105 active:scale-95 cursor-pointer">
            <RiUser3Line className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 z-10">
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-brand-purple-50 text-brand-purple-700 rounded-xl font-bold transition-colors"
            >
              <RiDashboardLine className="w-5 h-5" />
              Dashboard
            </a>

            <a
              href="/dashboard/roadmaps"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors"
            >
              <RiMapPinLine className="w-5 h-5" />
              My Roadmaps
            </a>

            <a
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors"
            >
              <RiSettings4Line className="w-5 h-5" />
              Settings
            </a>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative" onScroll={handleScroll}>
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
