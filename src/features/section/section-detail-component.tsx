import React from 'react'
import { Navbar, Sidebar } from '../../components/shared'

interface SectionDetailPageProps {
  children: React.ReactNode
}

export const SectionDetailComponent = ({ children }: SectionDetailPageProps) => {
  return (
    <div className="flex h-screen w-full bg-slate-50/50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
