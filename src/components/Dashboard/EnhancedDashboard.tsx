'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  TrophyIcon,
  ChartBarIcon,
  FireIcon,
  BellIcon,
  StarIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'

interface UserStats {
  totalHabits: number
  activeHabits: number
  honorPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  averageSuccessRate: number
  achievements: Array<{ name: string; description: string }>
  nextLevelProgress: {
    current: number
    required: number
    percentage: number
  }
}

interface AIRecommendation {
  recommendation: string
  type: string
  timestamp: string
}

export function EnhancedDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserStats()
      fetchDailyRecommendation()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchDailyRecommendation = async () => {
    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'daily_motivation' })
      })
      if (response.ok) {
        const data = await response.json()
        setRecommendation(data)
      }
    } catch (error) {
      console.error('Error fetching AI recommendation:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your personal growth overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<TrophyIcon className="h-8 w-8 text-yellow-500" />}
            title="Honor Points"
            value={stats.honorPoints.toLocaleString()}
            subtitle={`Level ${stats.level}`}
            color="yellow"
          />
          <StatsCard
            icon={<FireIcon className="h-8 w-8 text-red-500" />}
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            subtitle={`Best: ${stats.longestStreak} days`}
            color="red"
          />
          <StatsCard
            icon={<ChartBarIcon className="h-8 w-8 text-blue-500" />}
            title="Active Habits"
            value={stats.activeHabits.toString()}
            subtitle={`${stats.totalCompletions} total completions`}
            color="blue"
          />
          <StatsCard
            icon={<StarIcon className="h-8 w-8 text-purple-500" />}
            title="Success Rate"
            value={`${Math.round(stats.averageSuccessRate)}%`}
            subtitle="Average across all habits"
            color="purple"
          />
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
            <span className="text-sm text-gray-500">
              Level {stats.level} → {stats.level + 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.nextLevelProgress.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{stats.nextLevelProgress.current.toLocaleString()} points</span>
            <span>{stats.nextLevelProgress.required.toLocaleString()} points needed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Recommendation */}
          {recommendation && (
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <div className="flex items-center mb-4">
                <div className="bg-primary-500 rounded-full p-2 mr-3">
                  <StarIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900">AI Coach Insight</h3>
              </div>
              <p className="text-primary-800 leading-relaxed">
                {recommendation.recommendation}
              </p>
              <p className="text-xs text-primary-600 mt-3">
                Generated {new Date(recommendation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {stats.achievements.slice(0, 4).map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <TrophyIcon className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">{achievement.name}</p>
                    <p className="text-sm text-yellow-700">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
              {stats.achievements.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Complete habits to unlock achievements!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              title="Create New Habit"
              description="Start building a new habit today"
              icon={<ArrowUpIcon className="h-5 w-5" />}
              href="/habits/new"
              color="primary"
            />
            <ActionButton
              title="View Leaderboard"
              description="See how you rank against others"
              icon={<TrophyIcon className="h-5 w-5" />}
              href="/community/leaderboard"
              color="yellow"
            />
            <ActionButton
              title="Get AI Advice"
              description="Ask your AI coach for guidance"
              icon={<StarIcon className="h-5 w-5" />}
              href="/coach"
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  color: string
}) {
  const colorClasses = {
    yellow: 'border-yellow-200 bg-yellow-50',
    red: 'border-red-200 bg-red-50',
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 p-6 ${colorClasses[color as keyof typeof colorClasses]} bg-white shadow-sm`}
    >
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="ml-2 text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </motion.div>
  )
}

function ActionButton({ title, description, icon, href, color }: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}) {
  const colorClasses = {
    primary: 'border-primary-200 hover:bg-primary-50 text-primary-700',
    yellow: 'border-yellow-200 hover:bg-yellow-50 text-yellow-700',
    purple: 'border-purple-200 hover:bg-purple-50 text-purple-700'
  }

  return (
    <a
      href={href}
      className={`block p-4 border-2 rounded-lg transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="ml-2 font-medium">{title}</h4>
      </div>
      <p className="text-sm opacity-75">{description}</p>
    </a>
  )
}
