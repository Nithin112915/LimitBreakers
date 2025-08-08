'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Header from '../Navigation/Header'
import FloatingActionButton from '../UI/FloatingActionButton'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Don't show header and FAB on auth pages
  const isAuthPage = pathname?.startsWith('/auth/')
  const shouldShowNavigation = session && !isAuthPage

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {shouldShowNavigation && <Header />}
      <main className={shouldShowNavigation ? 'pt-0' : ''}>
        {children}
      </main>
      {shouldShowNavigation && <FloatingActionButton />}
    </div>
  )
}

export default Layout
