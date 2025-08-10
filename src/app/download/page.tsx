'use client'

import { motion } from 'framer-motion'
import { ArrowDownTrayIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DownloadPage() {
  const features = [
    'Offline Task Management',
    'Push Notifications for Reminders',
    'Premium Mobile UI/UX',
    'Real-time Sync across devices',
    'Enhanced Performance',
    'Mobile-optimized Honor System'
  ]

  const downloadAPK = () => {
    // This will be the actual APK download link
    const apkUrl = '/downloads/limitbreakers-v2.0.0-premium.apk'
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a')
    link.href = apkUrl
    link.download = 'LimitBreakers-Premium-v2.0.0.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="premium-title text-4xl md:text-5xl mb-4">
            Download Limit Breakers
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Get the premium mobile experience with enhanced task management, notifications, and offline functionality.
          </p>
        </motion.div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mobile App */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="premium-card"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DevicePhoneMobileIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mobile App (APK)</h3>
              <p className="text-gray-600">Premium Android application with full offline support</p>
            </div>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadAPK}
                className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center"
              >
                <ArrowDownTrayIcon className="w-6 h-6 mr-2" />
                Download APK v2.0.0
              </motion.button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">File size: ~15MB | Version: 2.0.0 Premium</p>
                <p className="text-xs text-gray-400">
                  Requires Android 6.0+ | Last updated: August 10, 2025
                </p>
              </div>
            </div>
          </motion.div>

          {/* Web App */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="premium-card"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ComputerDesktopIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Web Application</h3>
              <p className="text-gray-600">Access from any browser with full synchronization</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Cross-platform compatibility</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Auto-updates</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Cloud synchronization</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Desktop notifications</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Advanced analytics</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Social features</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary w-full py-4 text-lg font-semibold"
                >
                  Open Web App
                </motion.button>
              </Link>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">No installation required</p>
                <p className="text-xs text-gray-400">
                  Works on Chrome, Firefox, Safari, Edge
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card"
        >
          <h3 className="text-xl font-bold text-white mb-4">📱 APK Installation Instructions</h3>
          <div className="space-y-3 text-white/90">
            <p><strong>Step 1:</strong> Download the APK file above</p>
            <p><strong>Step 2:</strong> Enable "Unknown Sources" in your Android settings</p>
            <p><strong>Step 3:</strong> Open the downloaded APK file and tap "Install"</p>
            <p><strong>Step 4:</strong> Launch the app and sign in with your existing account</p>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-200 text-sm">
              <strong>Note:</strong> Since this is not distributed through Google Play Store, you may see a security warning. 
              This is normal for APK installations and the app is completely safe.
            </p>
          </div>
        </motion.div>

        {/* Version History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-card mt-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">📋 What's New in v2.0.0</h3>
          <div className="space-y-2 text-white/90">
            <p>• Renamed "Habits" to "Tasks" throughout the app</p>
            <p>• Enhanced premium UI with glassmorphism effects</p>
            <p>• Improved notification system with custom timing</p>
            <p>• Better offline functionality and data sync</p>
            <p>• Enhanced honor points system</p>
            <p>• Improved performance and stability</p>
            <p>• Mobile-optimized task management interface</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
