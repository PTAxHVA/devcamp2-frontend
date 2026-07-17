import { Link, Outlet } from 'react-router'
import { VoraWordmark } from '@/components/ui/vora-logo'
import { useRouteFade } from '@/hooks/use-route-fade'

export default function AuthLayout() {
  const contentRef = useRouteFade<HTMLDivElement>()

  return (
    <div className="bg-bg-soft flex min-h-screen flex-col">
      {/* Header — logo góc trái, nhất quán mọi trang auth */}
      <header className="border-border-soft bg-bg-card border-b px-8 py-4">
        <Link to="/" aria-label="VORA home">
          <VoraWordmark />
        </Link>
      </header>

      {/* Page content — overflow-x-hidden because the login/signup glow effects use a
          negative inset (see roadmap-login/-signup panels) that extends past this
          wrapper's edges on narrow viewports. */}
      <div
        ref={contentRef}
        className="flex flex-1 items-center justify-center overflow-x-hidden px-4 py-10"
      >
        <Outlet />
      </div>
    </div>
  )
}
