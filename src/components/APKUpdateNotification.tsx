'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ArrowDownTrayIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function APKUpdateNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [currentVersion, setCurrentVersion] = useState('1.0.0')
  const latestVersion = '2.0.0'

  useEffect(() => {
    // Check if user has seen this update notification
    const lastSeenVersion = localStorage.getItem('lastSeenVersion')
    const isNewUser = !localStorage.getItem('hasSeenApp')
    
    if (!isNewUser && lastSeenVersion !== latestVersion) {
      setShowNotification(true)
      setCurrentVersion(lastSeenVersion || '1.0.0')
    }
    
    if (isNewUser) {
      localStorage.setItem('hasSeenApp', 'true')
    }
  }, [])

  const handleDismiss = () => {
    setShowNotification(false)
    localStorage.setItem('lastSeenVersion', latestVersion)
  }

  const handleUpdate = () => {
    localStorage.setItem('lastSeenVersion', latestVersion)
    // Navigate to download page will happen via Link
  }

  if (!showNotification) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="font-bold text-lg">🎉 New APK Version Available!</h3>
                <p className="text-white/90 text-sm">
                  Limit Breakers v{latestVersion} is here with enhanced Tasks, premium UI, and mobile optimizations!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/download" onClick={handleUpdate}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-lg px-4 py-2 text-sm font-semibold flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span>Download APK</span>
                </motion.button>
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 border-t border-white/20 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Habits renamed to Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Premium mobile UI with glassmorphism</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Custom task notifications</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
