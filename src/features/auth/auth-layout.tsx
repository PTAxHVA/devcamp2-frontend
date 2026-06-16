import Logo from '@/assets/Logo.svg'
import { Link, Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Header — logo góc trái, nhất quán mọi trang auth */}
      <header className="px-8 py-4 bg-white border-b border-gray-100">
        <Link to="/">
          <img src={Logo} alt="VORA" className="w-36 h-auto object-contain" />
        </Link>
      </header>

      {/* Page content */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </div>
    </div>
  )
}
