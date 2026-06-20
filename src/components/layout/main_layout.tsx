import { Outlet } from 'react-router'
import { Sidebar, Navbar } from '@/components/shared/'

export const MainLayout = () => {
  return (
    <div className="bg-bg-section/50 text-text-primary flex h-screen w-full overflow-hidden font-sans">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
