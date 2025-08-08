'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Loading from '../../components/UI/Loading'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

interface AnalyticsData {
  overview: {
    totalCompletions: number
    totalHabits: number
    averageCompletionRate: number
    longestStreak: number
    currentStreak: number
    totalHonorPoints: number
  }
  weeklyData: Array<{
    day: string
    completions: number
    date: string
  }>
  categoryBreakdown: Array<{
    category: string
    count: number
    completionRate: number
    color: string
  }>
  monthlyTrends: Array<{
    month: string
    completions: number
    habits: number
  }>
}

interface Habit {
  _id: string
  title: string
  category: string
  analytics: {
    totalCompletions: number
    currentStreak: number
    longestStreak: number
    successRate: number
  }
  honorPointsReward: number
  completions: Array<{
    date: string
  }>
}

const categoryColors: { [key: string]: string } = {
  health: '#10B981',
  fitness: '#F59E0B',
  learning: '#3B82F6',
  productivity: '#8B5CF6',
  mindfulness: '#EC4899',
  social: '#06B6D4',
  other: '#6B7280'
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      fetchAnalyticsData()
    } else {
      setLoading(false)
    }
  }, [session, status])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/habits')
      
      if (response.ok) {
        const habitsData = await response.json()
        const habitsArray = Array.isArray(habitsData) ? habitsData : []
        setHabits(habitsArray)
        
        // Generate analytics data
        const totalCompletions = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0), 0
        )
        const totalHonorPoints = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0) * h.honorPointsReward, 0
        )
        const longestStreak = Math.max(...habitsArray.map(h => h.analytics?.longestStreak || 0), 0)
        const currentStreak = Math.max(...habitsArray.map(h => h.analytics?.currentStreak || 0), 0)
        const averageCompletionRate = habitsArray.length > 0 
          ? habitsArray.reduce((sum, h) => sum + (h.analytics?.successRate || 0), 0) / habitsArray.length
          : 0

        // Generate weekly data (last 7 days)
        const weeklyData = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          
          const completions = habitsArray.reduce((sum, habit) => {
            const dayCompletions = habit.completions?.filter((c: any) => {
              const completionDate = c.date || c.createdAt
              return completionDate && completionDate.startsWith(dateStr)
            }).length || 0
            return sum + dayCompletions
          }, 0)
          
          weeklyData.push({
            day: dayName,
            completions,
            date: dateStr
          })
        }

        // Generate category breakdown
        const categoryMap = new Map()
        habitsArray.forEach(habit => {
          const category = habit.category || 'other'
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { count: 0, totalCompletions: 0, totalPossible: 0 })
          }
          const data = categoryMap.get(category)
          data.count += 1
          data.totalCompletions += habit.analytics?.totalCompletions || 0
          data.totalPossible += Math.floor((Date.now() - new Date(habit.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) + 1
        })

        const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          count: data.count,
          completionRate: data.totalPossible > 0 ? Math.round((data.totalCompletions / data.totalPossible) * 100) : 0,
          color: categoryColors[category] || categoryColors.other
        }))

        // Generate monthly trends (last 6 months) with real data
        const monthlyTrends = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
          const monthName = date.toLocaleDateString('en-US', { month: 'short' })
          
          // Calculate real completions for this month
          const monthCompletions = habitsArray.reduce((sum, habit) => {
            const monthlyCount = habit.completions?.filter((c: any) => {
              const completionDate = c.date || c.createdAt
              return completionDate && completionDate >= monthStart && completionDate <= monthEnd
            }).length || 0
            return sum + monthlyCount
          }, 0)
          
          monthlyTrends.push({
            month: monthName,
            completions: monthCompletions,
            habits: habitsArray.filter(h => {
              const created = new Date(h.createdAt || Date.now()).toISOString().split('T')[0]
              return created <= monthEnd
            }).length
          })
        }

        setAnalytics({
          overview: {
            totalCompletions,
            totalHabits: habitsArray.length,
            averageCompletionRate: Math.round(averageCompletionRate),
            longestStreak,
            currentStreak,
            totalHonorPoints
          },
          weeklyData,
          categoryBreakdown,
          monthlyTrends
        })
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading your analytics..." />
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your analytics.</p>
            <Link
              href="/auth/signin"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return <Loading message="Processing your data..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your progress and insights</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Completions</p>
                <p className="text-3xl font-bold">{analytics.overview.totalCompletions}</p>
                <p className="text-blue-200 text-sm mt-1">
                  {analytics.overview.totalHabits} active habits
                </p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-blue-100" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">{analytics.overview.averageCompletionRate}%</p>
                <p className="text-green-200 text-sm mt-1">
                  Average across all habits
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-12 w-12 text-green-100" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Longest Streak</p>
                <p className="text-3xl font-bold">{analytics.overview.longestStreak}</p>
                <p className="text-orange-200 text-sm mt-1">
                  Current: {analytics.overview.currentStreak} days
                </p>
              </div>
              <FireIcon className="h-12 w-12 text-orange-100" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
              <CalendarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            
            <div className="space-y-4">
              {analytics.weeklyData.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-12">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((day.completions / 10) * 100, 100)}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{day.completions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Category Breakdown</h2>
              <ChartPieIcon className="h-6 w-6 text-purple-600" />
            </div>
            
            <div className="space-y-4">
              {analytics.categoryBreakdown.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{category.count} habits</span>
                    <span className="text-sm font-bold text-gray-900">
                      {category.completionRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Trends</h2>
            <ChartBarIcon className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="flex items-end space-x-4 h-48">
            {analytics.monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.completions / 70) * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg w-full min-h-[20px] mb-2"
                />
                <span className="text-xs font-medium text-gray-700">{month.month}</span>
                <span className="text-xs text-gray-500">{month.completions}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Performance Table */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Habit Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Habit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Completions</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Success Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Current Streak</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Honor Points</th>
                </tr>
              </thead>
              <tbody>
                {habits.slice(0, 5).map((habit) => (
                  <tr key={habit._id} className="border-b border-gray-100 hover:bg-white/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{habit.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white capitalize"
                        style={{ backgroundColor: categoryColors[habit.category] || categoryColors.other }}
                      >
                        {habit.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-indigo-600">
                        {habit.analytics?.totalCompletions || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-green-600">
                        {Math.round(habit.analytics?.successRate || 0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <FireIcon className="h-4 w-4 text-orange-500" />
                        <span className="font-bold text-orange-600">
                          {habit.analytics?.currentStreak || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-yellow-600">
                        {(habit.analytics?.totalCompletions || 0) * habit.honorPointsReward}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {habits.length > 5 && (
            <div className="mt-4 text-center">
              <Link
                href="/habits"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all {habits.length} habits
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
