import Logo from '@/assets/Logo.svg'
import { Link, Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      {/* Header — logo góc trái, nhất quán mọi trang auth */}
      <header className="border-border-soft border-b bg-white px-8 py-4">
        <Link to="/">
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
