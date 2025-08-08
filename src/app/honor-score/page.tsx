'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import HonorScoreDashboard from '../../components/HonorScore/HonorScoreDashboard'
import { TrophyIcon } from '@heroicons/react/24/outline'

export default function HonorScorePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading honor score...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sign in to view your Honor Score
          </h2>
          <p className="text-gray-600">
            Track your progress and see how you're performing with our comprehensive scoring system.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Honor Score System</h1>
                <p className="text-gray-600">
                  Comprehensive tracking of your habit consistency and achievements
                </p>
              </div>
            </div>
            
            {/* Admin Panel Link */}
            <div className="flex items-center space-x-4">
              <a
                href="/admin/honor-score"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <TrophyIcon className="h-4 w-4 mr-2" />
                Admin Panel
              </a>
            </div>
          </div>
        </motion.div>

        {/* Honor Score Dashboard */}
        <HonorScoreDashboard />

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mx-6 mb-8"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Honor Score Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Daily Scoring</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete daily task: +1 point (weighted by importance)</li>
                  <li>• Miss daily task: -1 point (capped at 3 consecutive misses)</li>
                  <li>• Task weight ranges from 1-5 based on importance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Period Calculation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Calculated twice monthly (1st-15th, 16th-end)</li>
                  <li>• Raw Score = Points Earned - Points Lost</li>
                  <li>• Honor Score = (Raw Score / 15) × 1000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Streak Bonuses</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 5-day streak: +5 bonus points</li>
                  <li>• 10-day streak: +15 bonus points</li>
                  <li>• 15-day streak: +30 bonus points</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Score Ranges</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 800-1000: <span className="text-green-600 font-medium">Excellent</span></li>
                  <li>• 600-799: <span className="text-blue-600 font-medium">Good</span></li>
                  <li>• 400-599: <span className="text-yellow-600 font-medium">Fair</span></li>
                  <li>• 0-399: <span className="text-red-600 font-medium">Needs Improvement</span></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
