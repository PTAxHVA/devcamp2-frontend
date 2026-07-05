import Logo from '@/assets/Logo.svg'
import { Link, Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <div className="bg-bg-soft flex min-h-screen flex-col">
      {/* Header — logo góc trái, nhất quán mọi trang auth */}
      <header className="border-border-soft bg-bg-card border-b px-8 py-4">
        {/* The brand asset is a dark-on-white raster, so on dark surfaces it sits on a
            small white chip to stay legible instead of vanishing / showing a bare box. */}
        <Link to="/" className="inline-flex dark:rounded-lg dark:bg-white dark:p-1.5">
          <img src={Logo} alt="VORA" className="h-auto w-36 object-contain" />
        </Link>
      </header>

      {/* Page content */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </div>
    </div>
  )
}
