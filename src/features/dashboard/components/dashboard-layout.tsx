import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="bg-bg-section flex h-full w-full flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto p-6 md:p-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
