'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { EnhancedDashboard } from '../../../components/Dashboard/EnhancedDashboard'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return <EnhancedDashboard />
}
