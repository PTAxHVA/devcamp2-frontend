import { Navbar, Sidebar } from '../../components/shared'
import RoadmapViewComponent from './roadmap-view-component'

export default function RoadmapViewPage() {
  return (
    <div className="flex h-screen w-full bg-slate-50/50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-hidden">
          <RoadmapViewComponent />
        </main>
      </div>
    </div>
  )
}
