import { useState } from 'react'
import { TbTargetArrow } from 'react-icons/tb'
import {
  RiHome6Line,
  RiMapPinLine,
  RiBookOpenLine,
  RiRobot2Line,
  RiSettings4Line,
  RiQuestionLine,
} from 'react-icons/ri'
import { RiArrowLeftSLine } from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`relative shrink-0 border-r border-slate-200 flex flex-col justify-between bg-white md:flex h-full transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-22' : 'w-65'
      }`}
    >
      <div>
        {/* Header / Logo */}
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-8'}`}>
          <h1 className="text-2xl font-bold overflow-hidden">
            {isCollapsed ? (
              <p className="text-brand-purple-600"> V</p>
            ) : (
              <img src={Logo} alt="VORA Logo" className="w-35 h-auto object-contain" />
            )}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-1 overflow-hidden">
          <a
            href="#"
            title="Dashboard"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-all`}
          >
            <RiHome6Line className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </a>

          <a
            href="#"
            title="Roadmaps"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-all`}
          >
            <RiMapPinLine className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Roadmaps</span>}
          </a>

          <a
            href="#"
            title="Goals"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-all`}
          >
            <TbTargetArrow className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Goals</span>}
          </a>

          <a
            href="#"
            title="My Learning"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold transition-all`}
          >
            <RiBookOpenLine className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>My Learning</span>}
          </a>

          <a
            href="#"
            title="AI Assistant"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-all`}
          >
            <RiRobot2Line className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>AI Assistant</span>}
          </a>

          <a
            href="#"
            title="Settings"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-all`}
          >
            <RiSettings4Line className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </a>
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 mb-4 flex flex-col gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="absolute top-17 -right-3.5 z-20 grid place-items-center w-7 h-7 rounded-full
                    bg-white border border-slate-200 text-slate-400 shadow-md
                    hover:bg-brand-purple-600 hover:text-white hover:border-brand-purple-600
                    hover:scale-110 active:scale-95
                    transition-all duration-200 ease-out"
        >
          <RiArrowLeftSLine
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
        <a
          href="#"
          title="Help & Support"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-all`}
        >
          <RiQuestionLine className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Help & Support</span>}
        </a>
      </div>
    </aside>
  )
}
