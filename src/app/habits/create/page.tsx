'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobileApp } from '../../../hooks/useMobile'
import MobileCreateHabitPage from '../../../components/Mobile/MobileCreateHabitPage'

export default function CreateHabitRedirect() {
  const router = useRouter()
  const isMobileApp = useIsMobileApp()

  // Show mobile create page for APK users
  if (isMobileApp) {
    return <MobileCreateHabitPage />
  }

  useEffect(() => {
    // Redirect to habits page with modal trigger for web users
    router.replace('/habits?create=true')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
}
