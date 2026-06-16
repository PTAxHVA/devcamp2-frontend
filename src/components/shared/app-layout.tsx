import { Outlet } from 'react-router'
import { Sidebar } from './sidebar'
import { AppHeader } from './app-header'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-soft">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
