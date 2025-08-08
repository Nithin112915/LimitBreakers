'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  PlayIcon, 
  StopIcon, 
  CalculatorIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface CronStatus {
  isRunning: boolean
  nextRuns: {
    period1End: string
    period2End: string
    dailyUpdate: string
  }
}

export default function HonorScoreAdmin() {
  const [cronStatus, setCronStatus] = useState<CronStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)

  const fetchCronStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/honor-score-cron')
      const data = await response.json()
      
      if (response.ok) {
        setCronStatus(data.status)
      } else {
        toast.error(data.error || 'Failed to fetch cron status')
      }
    } catch (error) {
      toast.error('Error fetching cron status')
      console.error('Cron status error:', error)
    } finally {
      setLoading(false)
    }
  }

  const manageCron = async (action: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/honor-score-cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(data.message)
        await fetchCronStatus() // Refresh status
      } else {
        toast.error(data.error || 'Action failed')
      }
    } catch (error) {
      toast.error('Error performing action')
      console.error('Cron action error:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMyScore = async () => {
    try {
      setCalculating(true)
      const response = await fetch('/api/admin/honor-score-cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'manual-calculate' })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Honor Score calculated: ${data.honorScore}`)
      } else {
        toast.error(data.error || 'Calculation failed')
      }
    } catch (error) {
      toast.error('Error calculating Honor Score')
      console.error('Calculation error:', error)
    } finally {
      setCalculating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <CogIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Honor Score Administration</h1>
              <p className="text-gray-600">Manage Honor Score calculations and cron jobs</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={fetchCronStatus}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'Refresh Status'}
            </button>
            <button
              onClick={calculateMyScore}
              disabled={calculating}
              className="btn btn-secondary"
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              {calculating ? 'Calculating...' : 'Calculate My Score'}
            </button>
          </div>
        </motion.div>

        {/* Status Cards */}
        {cronStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Cron Status */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cron Jobs</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cronStatus.isRunning 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {cronStatus.isRunning ? 'Running' : 'Stopped'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Period 1 End: {cronStatus.nextRuns.period1End}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Period 2 End: {cronStatus.nextRuns.period2End}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Daily Update: {cronStatus.nextRuns.dailyUpdate}
                </div>
              </div>

              <div className="flex space-x-2">
                {!cronStatus.isRunning ? (
                  <button
                    onClick={() => manageCron('initialize')}
                    disabled={loading}
                    className="flex-1 btn btn-primary btn-sm"
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => manageCron('stop')}
                    disabled={loading}
                    className="flex-1 btn btn-danger btn-sm"
                  >
                    <StopIcon className="h-4 w-4 mr-1" />
                    Stop
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={calculateMyScore}
                  disabled={calculating}
                  className="w-full btn btn-secondary btn-sm"
                >
                  <CalculatorIcon className="h-4 w-4 mr-2" />
                  {calculating ? 'Calculating...' : 'Calculate My Score'}
                </button>
                
                <button
                  onClick={() => manageCron('calculate-all')}
                  disabled={loading}
                  className="w-full btn btn-warning btn-sm"
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Calculate All Users
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
                </div>
                <div>
                  <strong>Calculation Method:</strong> Twice Monthly
                </div>
                <div>
                  <strong>Max Score:</strong> 1000 points
                </div>
                <div>
                  <strong>Period Length:</strong> 15 days
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Honor Score Formula Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Honor Score Formula</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Daily Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Complete daily task:</span>
                  <span className="font-medium text-green-600">+1 point (weighted)</span>
                </div>
                <div className="flex justify-between">
                  <span>Miss daily task:</span>
                  <span className="font-medium text-red-600">-1 point (capped)</span>
                </div>
                <div className="flex justify-between">
                  <span>Task weights:</span>
                  <span className="font-medium">1-5 (importance)</span>
                </div>
                <div className="flex justify-between">
                  <span>Penalty cap:</span>
                  <span className="font-medium">Max 3 consecutive</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Period Calculation</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Raw Score:</strong> Points Earned - Points Lost + Streak Bonuses
                </div>
                <div>
                  <strong>Honor Score:</strong> (Raw Score ÷ Max Possible) × 1000
                </div>
                <div>
                  <strong>Streak Bonuses:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• 5-day streak: +5 points</li>
                    <li>• 10-day streak: +15 points</li>
                    <li>• 15-day streak: +30 points</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Implementation Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">✅ Completed Features</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Daily habit tracking with weights (1-5)</li>
                <li>• 15-day period calculations (twice monthly)</li>
                <li>• Streak bonuses (5, 10, 15 day milestones)</li>
                <li>• Penalty caps (max 3 consecutive misses)</li>
                <li>• 1000-point scaling system</li>
                <li>• Historical tracking and trends</li>
                <li>• MongoDB storage with indexes</li>
                <li>• Real-time dashboard with visual summary</li>
                <li>• Scheduled cron jobs for automatic calculation</li>
                <li>• Manual calculation triggers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">🔄 Enhancement Opportunities</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Email notifications for period completions</li>
                <li>• Admin dashboard for system monitoring</li>
                <li>• Advanced analytics and insights</li>
                <li>• Custom achievement badges</li>
                <li>• Leaderboards and social features</li>
                <li>• Export capabilities for data analysis</li>
                <li>• Mobile app synchronization</li>
                <li>• Integration with external habit trackers</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
