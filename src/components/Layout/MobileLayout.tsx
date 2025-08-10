'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  CalendarIcon, 
  TrophyIcon, 
  UserIcon, 
  ArrowDownTrayIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setInstallPrompt(null)
      }
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/habits', icon: CalendarIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Download', href: '/download', icon: ArrowDownTrayIcon },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Mobile Status Bar */}
      <div className="mobile-status-bar mobile-safe-top">
        <div className="flex items-center justify-between px-4">
          <span>Limit Breakers</span>
          <div className="flex items-center space-x-2">
            {!isOnline && (
              <span className="text-red-500 text-xs">Offline</span>
            )}
            <BellIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Install App Prompt */}
      {installPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-notification"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Install Limit Breakers</p>
              <p className="text-sm opacity-90">Add to home screen for better experience</p>
            </div>
            <button
              onClick={installApp}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="pb-20 pt-2">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav mobile-safe-bottom">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-16 left-4 right-4 bg-orange-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium z-50">
          You're offline. Some features may be limited.
        </div>
      )}
    </div>
  )
}
