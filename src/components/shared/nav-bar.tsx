import { RiSearchLine, RiNotification3Line, RiMenuLine } from 'react-icons/ri'
import { useMe } from '@/features/profile/hooks/use-profile'
// import Logo from '@/assets/Logo.svg'

interface NavbarProps {
  onMenuClick?: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: me } = useMe()
  const initials = me?.username?.slice(0, 2).toUpperCase() ?? '??'
  const displayName = me?.username ?? ''

  return (
    <header className="border-border-soft z-10 flex h-20 shrink-0 flex-row items-center justify-between border-b bg-white px-4 md:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-secondary mr-1 md:hidden"
      >
        <RiMenuLine className="h-6 w-6" />
      </button>
      <div className="relative max-w-2xl flex-1">
        <RiSearchLine className="text-text-placeholder absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search topics, skills, roadmaps..."
          className="border-border-soft bg-bg-section focus:border-border-purple w-full rounded-xl border py-2.5 pr-12 pl-11 text-sm transition-colors focus:bg-white focus:outline-none"
        />
        <span className="border-border-soft text-text-placeholder absolute top-1/2 right-3 -translate-y-1/2 rounded border bg-white px-2 py-0.5 text-xs font-medium">
          /
        </span>
      </div>

      <div className="ml-8 flex items-center gap-6">
        <button className="text-text-placeholder hover:text-text-secondary relative">
          <RiNotification3Line className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>
        <div className="flex cursor-pointer items-center gap-3">
          <div className="bg-bg-lavender text-brand-purple-700 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
            {initials}
          </div>
          <span className="text-sm font-semibold">{displayName}</span>
        </div>
      </div>
    </header>
  )
}
