import { Link } from 'react-router'
import { VoraWordmark } from '@/components/ui/vora-logo'

export const Navbar = () => {
  return (
    <header className="border-base-200 bg-base-100 sticky top-0 z-50 border-b">
      <div className="navbar mx-auto h-20 max-w-450 px-4">
        <div className="flex-1">
          <VoraWordmark />
        </div>
        <div className="flex-none gap-2 sm:gap-4">
          <Link to="/login" className="btn btn-ghost font-semibold">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary font-semibold">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
