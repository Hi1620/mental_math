'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopNavigation } from './TopNavigation'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavigation />
      {/* Main Content Area */}
      <main className="ml-24 lg:ml-64 mt-20 p-4 lg:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
