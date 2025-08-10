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
import Header from '@/components/Navigation/Header'

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
      <div className="min-h-screen premium-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="premium-text text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen premium-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Failed to load dashboard'}</p>
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
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="slide-in-animation">
          <div className="mb-8">
            <h1 className="text-4xl font-bold premium-text-primary neon-glow mb-2">
              Welcome back, Champion! 🎯
            </h1>
            <p className="text-xl premium-text-muted">
              Ready to break through your limits today?
            </p>
          </div>

          {/* Quick Stats with 3D Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm premium-text-muted">Total Habits</p>
                  <p className="text-3xl font-bold gold-accent pulse-animation">{overview.totalHabits}</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>

            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm premium-text-muted">Completed Today</p>
                  <p className="text-3xl font-bold text-green-400 pulse-animation">{today.completed}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

                        <div className="card-3d glass-morphism rounded-xl p-6 floating-animation" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm premium-text-muted">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-400 pulse-animation">{user.streak}</p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </div>

            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm premium-text-muted">Honor Points</p>
                  <p className="text-3xl font-bold text-purple-400 pulse-animation">{user.honorPoints || 0}</p>
                </div>
                <div className="text-4xl">👑</div>
              </div>
            </div>
          </div>

          {/* Enhanced Sections with 3D Effects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Today's Goals */}
            <div className="card-3d glass-morphism rounded-xl p-6 glow-effect">
              <h2 className="text-2xl font-bold premium-text-primary mb-4 neon-glow">
                🎯 Today's Progress
              </h2>
              <div className="space-y-4">
                <div className="button-3d p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold premium-text-primary">Total Today</p>
                      <p className="text-sm premium-text-muted">{today.total} habits planned</p>
                    </div>
                    <div className="text-3xl gold-accent">{today.total}</div>
                  </div>
                </div>
                
                <div className="button-3d p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold premium-text-primary">Completed</p>
                      <p className="text-sm premium-text-muted">Great progress!</p>
                    </div>
                    <div className="text-3xl text-green-400 pulse-animation">{today.completed}</div>
                  </div>
                </div>
                
                <div className="button-3d p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold premium-text-primary">Pending</p>
                      <p className="text-sm premium-text-muted">Let's finish strong!</p>
                    </div>
                    <div className="text-3xl text-orange-400">{today.pending}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-3d glass-morphism rounded-xl p-6">
              <h2 className="text-2xl font-bold premium-text-primary mb-4 neon-glow">
                🚀 Recent Wins
              </h2>
              {recentCompletions.length > 0 ? (
                <div className="space-y-3">
                  {recentCompletions.slice(0, 5).map((completion, index) => (
                    <div 
                      key={completion.taskId} 
                      className="button-3d p-4 rounded-lg slide-in-animation"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-green-400 text-xl pulse-animation">✅</div>
                        <div>
                          <p className="font-semibold premium-text-primary">{completion.taskTitle}</p>
                          <p className="text-sm premium-text-muted">
                            {completion.taskCategory} • {new Date(completion.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs gold-accent">+{completion.honorPointsAwarded} points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          </div>

          {/* Quick Access Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card-3d glass-morphism rounded-xl p-6 glow-effect">
              <h2 className="text-2xl font-bold premium-text-primary mb-4 neon-glow">
                🚀 Quick Actions
              </h2>
              <div className="space-y-4">
                <Link href="/habits" className="block">
                  <div className="button-3d ripple-effect p-4 rounded-lg hover:scale-105 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">🎯</div>
                      <div>
                        <h3 className="font-semibold premium-text-primary">View All Habits</h3>
                        <p className="text-sm premium-text-muted">Track and manage your habits</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/habits/create" className="block">
                  <div className="button-3d ripple-effect p-4 rounded-lg hover:scale-105 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">➕</div>
                      <div>
                        <h3 className="font-semibold premium-text-primary">Create New Habit</h3>
                        <p className="text-sm premium-text-muted">Add a new habit to track</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-3d glass-morphism rounded-xl p-6">
              <h2 className="text-2xl font-bold premium-text-primary mb-4 neon-glow">
                � Recent Wins
              </h2>
              {recentCompletions.length > 0 ? (
                <div className="space-y-3">
                  {recentCompletions.slice(0, 5).map((completion, index) => (
                    <div 
                      key={completion.taskId} 
                      className="button-3d p-4 rounded-lg slide-in-animation"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-green-400 text-xl pulse-animation">✅</div>
                        <div>
                          <p className="font-semibold premium-text-primary">{completion.taskTitle}</p>
                          <p className="text-sm premium-text-muted">
                            {completion.taskCategory} • {new Date(completion.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs gold-accent">+{completion.honorPointsAwarded} points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 floating-animation">🎯</div>
                  <p className="premium-text-muted">Start completing habits to see your wins here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="card-3d glass-morphism rounded-xl p-8 text-center glow-effect">
            <div className="text-4xl mb-4 floating-animation">💫</div>
            <blockquote className="text-xl font-medium premium-text-primary neon-glow italic mb-4">
              "{motivationalQuote}"
            </blockquote>
            <p className="premium-text-muted">Keep pushing your limits!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
