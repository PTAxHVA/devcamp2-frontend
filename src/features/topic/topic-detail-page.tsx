import React from 'react'
import { Navbar, Sidebar } from '../../components/shared'
import TopicDetailComponent from './topic-detail-component'

interface TopicDetailPageProps {
  children?: React.ReactNode
}

export default function TopicDetailPage({ children }: TopicDetailPageProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 font-sans text-slate-900">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children || (
            <div className="p-6 lg:p-8">
              <TopicDetailComponent />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
