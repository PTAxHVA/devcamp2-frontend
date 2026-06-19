import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Map,
  Target,
  BookOpen,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react'
import Logo from '@/assets/Logo.svg'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/roadmaps', icon: Map, label: 'Roadmaps' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/learning', icon: BookOpen, label: 'My Learning' },
  { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 h-screen bg-white border-r border-border-soft flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border-soft">
        <img src={Logo} alt="VORA" className="w-24 h-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-bg-lavender text-brand-purple-600 font-semibold'
                  : 'text-text-secondary hover:bg-bg-section hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-brand-purple-500' : 'text-text-muted'}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Help & Support */}
      <div className="px-3 pb-5">
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-bg-lavender text-brand-purple-600 font-semibold'
                : 'text-text-secondary hover:bg-bg-section hover:text-text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isActive ? 'border-brand-purple-500' : 'border-text-muted'
                }`}
              >
                <HelpCircle
                  className={`w-3 h-3 ${isActive ? 'text-brand-purple-500' : 'text-text-muted'}`}
                />
              </div>
              Help & Support
            </>
          )}
        </NavLink>
      </div>
    </aside>
  )
}
