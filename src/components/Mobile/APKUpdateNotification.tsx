'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudArrowDownIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface APKUpdateNotificationProps {
  currentVersion: string
  latestVersion: string
  onUpdate: () => void
  onDismiss: () => void
}

export default function APKUpdateNotification({ 
  currentVersion, 
  latestVersion, 
  onUpdate, 
  onDismiss 
}: APKUpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show notification if there's a version mismatch
    if (currentVersion !== latestVersion) {
      setIsVisible(true)
    }
  }, [currentVersion, latestVersion])

  const handleUpdate = () => {
    setIsVisible(false)
    onUpdate()
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 safe-area-top"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">New Premium Update Available!</h4>
                  <p className="text-xs text-white/80">
                    Version {latestVersion} with enhanced features
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdate}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                >
                  <CloudArrowDownIcon className="w-4 h-4" />
                  <span>Update</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing APK updates
export function useAPKUpdates() {
  const [currentVersion, setCurrentVersion] = useState('1.0.0')
  const [latestVersion, setLatestVersion] = useState('1.0.0')
  const [isChecking, setIsChecking] = useState(false)

  const checkForUpdates = async () => {
    setIsChecking(true)
    try {
      // In a real app, this would check your update server
      const response = await fetch('/api/app-version')
      const data = await response.json()
      
      setLatestVersion(data.latestVersion)
      
      // Get current version from package.json or app metadata
      const currentVer = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
      setCurrentVersion(currentVer)
    } catch (error) {
      console.error('Error checking for updates:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const downloadUpdate = () => {
    // In a real app, this would trigger the download process
    const downloadUrl = 'https://limitbreakers.netlify.app/download/latest-apk'
    window.open(downloadUrl, '_blank')
  }

  useEffect(() => {
    // Check for updates when component mounts
    checkForUpdates()
    
    // Set up periodic checking (every 24 hours)
    const interval = setInterval(checkForUpdates, 24 * 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    currentVersion,
    latestVersion,
    isChecking,
    hasUpdate: currentVersion !== latestVersion,
    checkForUpdates,
    downloadUpdate
  }
}
