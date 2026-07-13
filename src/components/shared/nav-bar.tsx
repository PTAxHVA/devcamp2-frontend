import { Link, useLocation, useNavigate } from 'react-router'
import {
  RiMenuLine,
  RiUser3Line,
  RiSettings3Line,
  RiLogoutBoxRLine,
  RiQuestionLine,
  RiArrowDownSLine,
} from 'react-icons/ri'
import { useMe } from '@/features/profile/hooks/use-profile'
import { useAuthStore } from '@/stores/auth-store'
import { queryClient } from '@/lib/query-client'
import { getPageMeta } from './page-meta'
import { UserAvatar } from './user-avatar'

interface NavbarProps {
  onMenuClick?: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)
  const displayName = me?.username ?? ''
  // Contextual title so the top bar reflects the current page (not dead space).
  const { title, Icon } = getPageMeta(pathname)

  // daisyUI dropdowns are focus-driven: after clicking a menu link, focus stays
  // inside the menu, so it would remain open on the destination page.
  const closeDropdown = () => {
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  const handleLogout = () => {
    closeDropdown()
    setAuth(null, null)
    // Drop the previous user's cached queries so a next login in the same tab
    // can't briefly show stale dashboard/profile data.
    queryClient.clear()
    navigate('/login')
  }

  return (
    <header className="border-border-soft bg-bg-card z-10 flex h-20 shrink-0 items-center justify-between gap-3 border-b px-4 md:px-8">
      {/* Left — hamburger (mobile) + page context: route title + greeting. */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="text-text-secondary hover:text-brand-purple-600 focus-visible:ring-brand-purple-300 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none md:hidden"
        >
          <RiMenuLine className="h-6 w-6" />
        </button>

        {title ? (
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <span className="bg-bg-lavender text-brand-purple-500 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex">
                <Icon className="h-[22px] w-[22px]" />
              </span>
            )}
            <div className="min-w-0">
              <p className="text-text-primary truncate text-[17px] font-extrabold tracking-tight">
                {title}
              </p>
              {displayName && (
                <p className="text-text-muted hidden truncate text-xs font-medium md:block">
                  Welcome back, {displayName}
                </p>
              )}
            </div>
          </div>
        ) : (
          displayName && (
            <p className="text-text-secondary min-w-0 truncate text-sm font-medium">
              Welcome back, <span className="text-text-primary font-semibold">{displayName}</span>
            </p>
          )
        )}
      </div>

      {/* Right — help shortcut + account chip. */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link
          to="/support"
          aria-label="Help & Support"
          className="text-text-muted hover:bg-bg-lavender hover:text-brand-purple-600 focus-visible:ring-brand-purple-300 flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          <RiQuestionLine className="h-[21px] w-[21px]" />
        </Link>

        <span className="bg-border-soft hidden h-6 w-px sm:block" aria-hidden="true" />

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            aria-label="Account menu"
            className="hover:bg-bg-section focus-visible:ring-brand-purple-300 flex cursor-pointer items-center gap-2.5 rounded-xl py-1 pr-2 pl-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="from-brand-purple-400 to-brand-purple-700 flex shrink-0 rounded-full bg-gradient-to-br p-0.5">
              <UserAvatar src={me?.avatarUrl} name={displayName} className="h-9 w-9 bg-white" />
            </span>
            <span className="text-text-primary hidden max-w-[10rem] truncate text-sm font-semibold sm:block">
              {displayName}
            </span>
            <RiArrowDownSLine className="text-text-placeholder hidden h-4 w-4 sm:block" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu border-border-soft rounded-box bg-base-100 z-20 mt-2 w-48 border p-2 shadow-lg"
          >
            <li>
              <Link to="/profile" onClick={closeDropdown}>
                <RiUser3Line className="h-4 w-4" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={closeDropdown}>
                <RiSettings3Line className="h-4 w-4" /> Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-error transition-colors duration-200">
                <RiLogoutBoxRLine className="h-4 w-4" /> Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
