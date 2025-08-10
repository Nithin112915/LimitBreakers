'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PlusIcon,
  SparklesIcon,
  BellIcon,
  ArrowUpIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { reminderManager } from '@/lib/reminderManager'

interface DashboardData {
  user: {
    name: string
    honorPoints: number
    level: number
    streak: number
    longestStreak: number
  }
  today: {
    completed: number
    pending: number
    total: number
  }
  overview: {
    totalHabits: number
    activeHabits: number
    totalCompletions: number
    averageStreak: number
  }
  weeklyActivity: Array<{
    date: string
    completions: number
  }>
  categoryStats: Record<string, {
    total: number
    completed: number
    successRate: number
  }>
  recentCompletions: Array<{
    taskId: string
    taskTitle: string
    taskCategory: string
    date: string
    honorPointsAwarded: number
  }>
  motivationalQuote: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin'
      return
    }
    if (status === 'authenticated') {
      fetchDashboardData()
      checkNotificationPermission()
      loadUpcomingReminders()
    }
  }, [status])

  const checkNotificationPermission = async () => {
    if (!reminderManager) return
    const permission = await reminderManager.requestPermission()
    setNotificationsEnabled(permission)
  }

  const loadUpcomingReminders = async () => {
    try {
      const response = await fetch('/api/habits?upcoming=true')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Filter habits with scheduled times for today/tomorrow
          const now = new Date()
          const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          
          const reminders = data.habits
            .filter((habit: any) => habit.schedule?.time)
            .map((habit: any) => {
              const [hours, minutes] = habit.schedule.time.split(':').map(Number)
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
              const tomorrowSchedule = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), hours, minutes)
              
              if (today > now) {
                return { ...habit, nextReminder: today, isToday: true }
              } else {
                return { ...habit, nextReminder: tomorrowSchedule, isToday: false }
              }
            })
            .sort((a: any, b: any) => a.nextReminder.getTime() - b.nextReminder.getTime())
            .slice(0, 5) // Show next 5 reminders
          
          setUpcomingReminders(reminders)
        }
      }
    } catch (error) {
      console.error('Error loading upcoming reminders:', error)
    }
  }

  const toggleNotifications = async () => {
    if (!reminderManager) {
      toast.error('Notification system not available')
      return
    }

    if (!notificationsEnabled) {
      const permission = await reminderManager.requestPermission()
      if (permission) {
        setNotificationsEnabled(true)
        toast.success('Notifications enabled! 🔔')
        // Schedule reminders for all habits
        await scheduleAllHabitReminders()
      } else {
        toast.error('Please enable notifications in your browser settings')
      }
    } else {
      setNotificationsEnabled(false)
      toast.success('Notifications disabled')
    }
  }

  const scheduleAllHabitReminders = async () => {
    if (!reminderManager) return

    try {
      const response = await fetch('/api/habits')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          await reminderManager.scheduleHabitReminders(data.habits)
          toast.success('Habit reminders scheduled! ⏰')
        }
      }
    } catch (error) {
      console.error('Error scheduling reminders:', error)
      toast.error('Failed to schedule reminders')
    }
  }

  const testReminder = async () => {
    if (!reminderManager) {
      toast.error('Notification system not available')
      return
    }

    try {
      await reminderManager.sendTestNotification()
      toast.success('Test notification sent!')
    } catch (error) {
      console.error('Error sending test reminder:', error)
      toast.error('Failed to send test notification')
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      if (data.success) {
        setDashboardData(data.data)
      } else {
        throw new Error(data.message || 'Failed to load dashboard')
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-300 text-lg mb-4">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { user, today, overview, weeklyActivity, categoryStats, recentCompletions, motivationalQuote } = dashboardData

  return (
    <div className="min-h-screen gradient-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.name}! 🎯
          </h1>
          <p className="text-xl text-white/80">
            {motivationalQuote}
          </p>
        </motion.div>

        {/* Notification Controls & Upcoming Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Notification Controls */}
          <div className="premium-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BellIcon className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Habit Reminders
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get notified when it's time to complete your habits
                  </p>
                </div>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationsEnabled 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {notificationsEnabled ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Notifications enabled
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Click to enable habit reminders
                  </span>
                )}
              </div>
              <button
                onClick={testReminder}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Test Notification
              </button>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="premium-card">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Reminders
              </h3>
            </div>
            {upcomingReminders.length > 0 ? (
              <div className="space-y-2">
                {upcomingReminders.map((reminder, index) => (
                  <div key={reminder._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${reminder.isToday ? 'bg-green-500' : 'bg-blue-500'}`} />
                      <span className="text-sm font-medium text-gray-900">
                        {reminder.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {reminder.isToday ? 'Today' : 'Tomorrow'} {reminder.schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No upcoming reminders. Create habits with scheduled times to see them here.
              </p>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Honor Points */}
          <div className="premium-card text-center">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{user.honorPoints.toLocaleString()}</h3>
            <p className="text-gray-600">Honor Points</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Level {user.level}
              </span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="premium-card text-center">
            <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{user.streak}</h3>
            <p className="text-gray-600">Current Streak</p>
            <div className="mt-2 text-sm text-gray-500">
              Best: {user.longestStreak} days
            </div>
          </div>

          {/* Today's Progress */}
          <div className="premium-card text-center">
            <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{today.completed}/{today.total}</h3>
            <p className="text-gray-600">Completed Today</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${today.total > 0 ? (today.completed / today.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Active Habits */}
          <div className="premium-card text-center">
            <SparklesIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{overview.activeHabits}</h3>
            <p className="text-gray-600">Active Habits</p>
            <div className="mt-2 text-sm text-gray-500">
              {overview.totalCompletions} total completions
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="premium-card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/habits/create" className="btn-primary text-center">
                <PlusIcon className="w-5 h-5 mx-auto mb-2" />
                Create New Habit
              </Link>
              <Link href="/habits" className="btn-secondary text-center">
                <CheckCircleIcon className="w-5 h-5 mx-auto mb-2" />
                View All Habits
              </Link>
              <Link href="/analytics" className="btn-accent text-center">
                <ChartBarIcon className="w-5 h-5 mx-auto mb-2" />
                View Analytics
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Activity</h3>
            <div className="space-y-3">
              {weeklyActivity.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                      <div 
                        className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((day.completions / Math.max(...weeklyActivity.map(d => d.completions), 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{day.completions}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Completions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Completions</h3>
            <div className="space-y-3">
              {recentCompletions.length > 0 ? (
                recentCompletions.slice(0, 5).map((completion, index) => (
                  <div key={`${completion.taskId}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{completion.taskTitle}</p>
                      <p className="text-sm text-gray-600 capitalize">{completion.taskCategory}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{completion.honorPointsAwarded}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(completion.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent completions</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 premium-card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 capitalize mb-2">{category}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total Habits:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate:</span>
                    <span className="font-medium">{stats.successRate}%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
