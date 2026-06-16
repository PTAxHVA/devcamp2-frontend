import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
