import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const logout = () => {
    setAuth(null, null)
    navigate('/login')
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="h-16 bg-white border-b border-border-soft flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-input bg-bg-section text-sm text-text-muted hover:border-border-default transition cursor-text">
          <Search className="w-4 h-4 shrink-0" />
          <span>Search topics, skills, roadmaps...</span>
          <Search className="w-4 h-4 shrink-0 ml-auto opacity-40" />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Bell */}
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-section transition relative">
          <Bell className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-9 h-9 rounded-full bg-brand-purple-400 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <span className="text-sm font-semibold text-text-primary hidden sm:block">
              {user?.username ?? 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-48 bg-white border border-border-soft rounded-xl shadow-lg py-1.5 z-50">
              <button
                onClick={() => {
                  navigate('/profile')
                  setOpen(false)
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-text-primary hover:bg-bg-section"
              >
                <User className="w-4 h-4 text-text-muted" /> Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings')
                  setOpen(false)
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-text-primary hover:bg-bg-section"
              >
                <Settings className="w-4 h-4 text-text-muted" /> Settings
              </button>
              <div className="h-px bg-border-soft my-1" />
              <button
                onClick={logout}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-bg-section"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
