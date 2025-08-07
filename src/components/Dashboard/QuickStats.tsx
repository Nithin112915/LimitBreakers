'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  FireIcon, 
  ChartBarIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline'

interface StatsData {
  currentStreak: number
  longestStreak: number
  honorPoints: number
  successRate: number
  activeHabits: number
  totalHabits: number
  completedToday: number
  level: number
}

export function QuickStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load stats</p>
      </div>
    )
  }

  const statsItems = [
    {
      name: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: stats.currentStreak > 0 ? `${stats.currentStreak} day streak!` : 'Start your streak today',
      changeType: stats.currentStreak > 0 ? 'positive' : 'neutral'
    },
    {
      name: 'Honor Points',
      value: stats.honorPoints.toLocaleString(),
      icon: TrophyIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: `Level ${stats.level}`,
      changeType: 'positive'
    },
    {
      name: 'Success Rate',
      value: `${Math.round(stats.successRate)}%`,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${stats.completedToday} completed today`,
      changeType: stats.successRate >= 80 ? 'positive' : stats.successRate >= 60 ? 'neutral' : 'negative'
    },
    {
      name: 'Active Habits',
      value: stats.activeHabits.toString(),
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `Longest: ${stats.longestStreak} days`,
      changeType: 'neutral'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${
                stat.changeType === 'positive' 
                  ? 'text-green-600' 
                  : stat.changeType === 'negative' 
                  ? 'text-red-600' 
                  : 'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
