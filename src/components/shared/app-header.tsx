import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useMe } from '@/features/profile/hooks/use-profile'

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: me } = useMe()

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

  const displayName = me?.username ?? user?.username ?? 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="border-border-soft flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6">
      {/* Search */}
      <div className="max-w-lg flex-1">
        <div className="border-border-input bg-bg-section text-text-muted hover:border-border-default flex cursor-text items-center gap-2 rounded-xl border px-4 py-2 text-sm transition">
          <Search className="h-4 w-4 shrink-0" />
          <span>Search topics, skills, roadmaps...</span>
          <Search className="ml-auto h-4 w-4 shrink-0 opacity-40" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Bell */}
        <button className="hover:bg-bg-section relative flex h-9 w-9 items-center justify-center rounded-full transition">
          <Bell className="text-text-secondary h-5 w-5" />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <div className="bg-brand-purple-400 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
              {initials}
            </div>
            <span className="text-text-primary hidden text-sm font-semibold sm:block">
              {displayName}
            </span>
            <ChevronDown className="text-text-muted hidden h-4 w-4 sm:block" />
          </button>

          {open && (
            <div className="border-border-soft absolute top-11 right-0 z-50 w-48 rounded-xl border bg-white py-1.5 shadow-lg">
              <button
                onClick={() => {
                  navigate('/profile')
                  setOpen(false)
                }}
                className="text-text-primary hover:bg-bg-section flex w-full items-center gap-2.5 px-4 py-2 text-sm"
              >
                <User className="text-text-muted h-4 w-4" /> Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings')
                  setOpen(false)
                }}
                className="text-text-primary hover:bg-bg-section flex w-full items-center gap-2.5 px-4 py-2 text-sm"
              >
                <Settings className="text-text-muted h-4 w-4" /> Settings
              </button>
              <div className="bg-border-soft my-1 h-px" />
              <button
                onClick={logout}
                className="text-error-text hover:bg-bg-section flex w-full items-center gap-2.5 px-4 py-2 text-sm"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
