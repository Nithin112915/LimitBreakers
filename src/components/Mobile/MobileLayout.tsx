'use client'

import { useEffect, useState } from 'react'
import { useIsMobileApp, useSafeArea } from '@/hooks/useMobile'
import MobileHeader from './MobileHeader'
import MobileNavigation from './MobileNavigation'

// Capacitor imports with error handling
let StatusBar: any, SplashScreen: any, App: any, Keyboard: any
if (typeof window !== 'undefined') {
  try {
    StatusBar = require('@capacitor/status-bar').StatusBar
    SplashScreen = require('@capacitor/splash-screen').SplashScreen
    App = require('@capacitor/app').App
    Keyboard = require('@capacitor/keyboard').Keyboard
  } catch (e) {
    console.log('Capacitor plugins not available in web environment')
  }
}

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const isMobileApp = useIsMobileApp()
  const { top, bottom } = useSafeArea()
  const [isReady, setIsReady] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      if (!isMobileApp || typeof window === 'undefined') {
        setIsReady(true)
        return
      }

      try {
        // Configure status bar for premium look
        if (StatusBar) {
          await StatusBar.setStyle({ style: 'DARK' })
          await StatusBar.setBackgroundColor({ color: '#4F46E5' })
          await StatusBar.setOverlaysWebView({ overlay: false })
        }

        // Handle keyboard events
        if (Keyboard) {
          Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardVisible(true)
          })

          Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false)
          })
        }

        // Handle app state changes
        if (App) {
          App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
            console.log('App state changed. Is active?', isActive)
          })
        }

        // Hide splash screen after initialization
        setTimeout(async () => {
          if (SplashScreen) {
            await SplashScreen.hide()
          }
          setIsReady(true)
        }, 2000)

      } catch (error) {
        console.error('Error initializing mobile app:', error)
        setIsReady(true) // Still show the app even if mobile features fail
      }
    }

    initializeApp()

    return () => {
      // Clean up listeners
      if (typeof window !== 'undefined') {
        try {
          if (Keyboard) Keyboard.removeAllListeners()
          if (App) App.removeAllListeners()
        } catch (e) {
          console.log('Error cleaning up listeners:', e)
        }
      }
    }
  }, [isMobileApp])

  if (!isMobileApp) {
    return <>{children}</>
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">LimitBreakers</h2>
          <p className="text-white/80 text-sm mt-2">Loading your premium experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`mobile-app min-h-screen mobile-scroll ${keyboardVisible ? 'keyboard-visible' : ''}`}
      style={{ 
        paddingTop: top, 
        paddingBottom: bottom,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Premium status bar overlay */}
      <div className="mobile-status-bar" />
      
      <MobileHeader />
      
      <main className="pb-16 pt-16 min-h-screen mobile-scroll-area mobile-fade-in">
        <div className="premium-mobile-container">
          {children}
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  )
}
