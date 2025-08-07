'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Habit {
  _id: string
  title: string
  category: string
  analytics: {
    currentStreak: number
    totalCompletions: number
  }
  honorPointsReward: number
  difficulty: string
  reminders?: Array<{
    time: string
    message: string
    enabled: boolean
  }>
}

export function HabitOverview() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      if (response.ok) {
        const data = await response.json()
        setHabits(data.slice(0, 4)) // Show only first 4 habits
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const completedCount = 0 // We'll implement today's completion tracking later
  const totalCount = habits.length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Habits</h2>
        <div className="flex items-center space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Active Habits</span>
          <span>{totalCount} habits</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: totalCount > 0 ? '100%' : '0%' }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit, index) => (
          <motion.div
            key={habit._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-primary-200 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{habit.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="capitalize">{habit.category}</span>
                  <span>•</span>
                  <span>{habit.reminders?.[0]?.time || 'No time set'}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    🔥 {habit.analytics.currentStreak} days
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  +{habit.honorPointsReward} HP
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {habit.difficulty}
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {habits.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No habits yet</p>
          <button className="btn-primary">Create Your First Habit</button>
        </div>
      )}
    </div>
  )
}
