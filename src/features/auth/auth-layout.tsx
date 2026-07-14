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

      {/* Page content */}
      <div ref={contentRef} className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </div>
    </div>
  )
}
