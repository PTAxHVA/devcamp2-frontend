import { Link, useNavigate } from 'react-router'
import {
  RiMenuLine,
  RiUser3Line,
  RiSettings3Line,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiSunLine,
} from 'react-icons/ri'
import { useMe } from '@/features/profile/hooks/use-profile'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { queryClient } from '@/lib/query-client'

interface NavbarProps {
  onMenuClick?: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const initials = me?.username?.slice(0, 2).toUpperCase() ?? '??'
  const displayName = me?.username ?? ''

  const handleLogout = () => {
    setAuth(null, null)
    // Drop the previous user's cached queries so a next login in the same tab
    // can't briefly show stale dashboard/profile data.
    queryClient.clear()
    navigate('/login')
  }

  return (
    <header className="border-border-soft bg-bg-card z-10 flex h-20 shrink-0 flex-row items-center justify-between border-b px-4 md:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-secondary md:hidden"
      >
        <RiMenuLine className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="text-text-secondary hover:bg-bg-section flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        >
          {theme === 'dark' ? (
            <RiSunLine className="h-5 w-5" />
          ) : (
            <RiMoonLine className="h-5 w-5" />
          )}
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            aria-label="Account menu"
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="bg-bg-lavender text-brand-purple-700 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
              {initials}
            </div>
            <span className="hidden text-sm font-semibold sm:inline">{displayName}</span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu border-border-soft rounded-box bg-base-100 z-20 mt-2 w-48 border p-2 shadow-lg"
          >
            <li>
              <Link to="/profile">
                <RiUser3Line className="h-4 w-4" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <RiSettings3Line className="h-4 w-4" /> Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-error">
                <RiLogoutBoxRLine className="h-4 w-4" /> Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
