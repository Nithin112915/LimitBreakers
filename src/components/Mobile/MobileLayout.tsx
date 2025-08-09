'use client'

import { useIsMobileApp, useSafeArea } from '@/hooks/useMobile'
import MobileHeader from './MobileHeader'
import MobileNavigation from './MobileNavigation'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const isMobileApp = useIsMobileApp()
  const { top, bottom } = useSafeArea()

  if (!isMobileApp) {
    return <>{children}</>
  }

  return (
    <div className="mobile-app min-h-screen bg-gray-50" style={{ paddingTop: top, paddingBottom: bottom }}>
      <MobileHeader />
      
      <main className="pb-16 pt-16 min-h-screen mobile-scroll-area">
        {children}
      </main>
      
      <MobileNavigation />
    </div>
  )
}
