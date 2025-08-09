'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PlusIcon,
  SparklesIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { notificationManager, getUpcomingHabits, isHabitCompletedToday } from '../../lib/notifications'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalHonorPoints: number
  totalHabits: number
  activeHabits: number
  completedToday: number
  currentStreak: number
  longestStreak: number
  level: number
  completionRate: number
}

interface Habit {
  _id: string
  title: string
  description: string
  category: string
  difficulty?: string
  honorPointsReward: number
  isActive: boolean
  reminders: Array<{
    time: string
    isEnabled: boolean
  }>
  analytics: {
    totalCompletions: number
    currentStreak: number
    longestStreak: number
    successRate: number
  }
  completions: Array<{
    date: string
    proofUrl?: string
    proofType?: string
    notes?: string
  }>
}

export default function OptimizedDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalHonorPoints: 0,
    totalHabits: 0,
    activeHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    completionRate: 0
  })
  const [habits, setHabits] = useState<Habit[]>([])
  const [upcomingHabits, setUpcomingHabits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    console.log('Dashboard useEffect - Status:', status, 'Session:', !!session)
    
    if (status === 'loading') return
    
    if (session) {
      console.log('Session found, fetching dashboard data...')
      fetchDashboardData()
      initializeNotifications()
    } else {
      console.log('No session found, stopping loading...')
      setLoading(false)
    }
  }, [session, status])

  const initializeNotifications = async () => {
    const granted = await notificationManager.requestPermission()
    setNotificationsEnabled(granted)
    
    if (granted) {
      toast.success('Notifications enabled! You\'ll receive habit reminders.')
    }
  }

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching habits data...')
      // Fetch habits data
      const habitsResponse = await fetch('/api/habits')
      console.log('Habits response status:', habitsResponse.status)
      
      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json()
        console.log('Habits data received:', habitsData)
        const habitsArray = Array.isArray(habitsData) ? habitsData : []
        setHabits(habitsArray)
        
        // Calculate comprehensive stats
        const today = new Date().toISOString().split('T')[0]
        const completedToday = habitsArray.filter(h => 
          isHabitCompletedToday(h)
        ).length
        
        const activeHabits = habitsArray.filter(h => h.isActive).length
        const totalCompletions = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0), 0
        )
        const totalHonorPoints = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0) * h.honorPointsReward, 0
        )
        
        // Calculate overall completion rate
        const totalDaysActive = habitsArray.reduce((sum, h) => {
          const daysSinceCreation = Math.floor(
            (Date.now() - new Date(h.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
          ) + 1
          return sum + daysSinceCreation
        }, 0)
        
        const completionRate = totalDaysActive > 0 ? 
          Math.round((totalCompletions / totalDaysActive) * 100) : 0

        const currentStreak = Math.max(...habitsArray.map(h => h.analytics?.currentStreak || 0), 0)
        const longestStreak = Math.max(...habitsArray.map(h => h.analytics?.longestStreak || 0), 0)
        const level = Math.floor(totalHonorPoints / 1000) + 1

        setStats({
          totalHonorPoints,
          totalHabits: habitsArray.length,
          activeHabits,
          completedToday,
          currentStreak,
          longestStreak,
          level,
          completionRate
        })

        // Calculate upcoming habits
        const upcoming = getUpcomingHabits(habitsArray)
        setUpcomingHabits(upcoming.slice(0, 5))

        // Schedule notifications for all habits
        if (notificationsEnabled) {
          notificationManager.scheduleAllHabitReminders(habitsArray)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickComplete = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`+${result.honorPointsEarned} Honor Points! 🎉`)
        
        // Show achievement notifications
        if (result.achievements?.length > 0) {
          result.achievements.forEach((achievement: any) => {
            notificationManager.showAchievementNotification(
              achievement.title,
              achievement.description,
              achievement.honorPoints
            )
          })
        }

        // Show streak notification
        if (result.newStreak > 1 && result.newStreak % 7 === 0) {
          notificationManager.showStreakNotification(result.newStreak, habits.find(h => h._id === habitId)?.title || 'Habit')
        }

        // Refresh dashboard data
        fetchDashboardData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to complete habit')
      }
    } catch (error) {
      console.error('Error completing habit:', error)
      toast.error('Failed to complete habit')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to LimitBreakers</h1>
            <p className="text-gray-600 mb-8">Please sign in to access your dashboard.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || 'Champion'}! 👋
          </h1>
          <p className="text-gray-600">
            Level {stats.level} • {stats.completionRate}% success rate this period
          </p>
          
          {!notificationsEnabled && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800">
                    Enable notifications to receive habit reminders
                  </p>
                </div>
                <button
                  onClick={initializeNotifications}
                  className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Enable
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <TrophyIcon className="h-10 w-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Honor Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHonorPoints.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">Level {stats.level}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <FireIcon className="h-10 w-10 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
                <p className="text-xs text-red-600">Best: {stats.longestStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                <p className="text-xs text-green-600">of {stats.activeHabits} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <ChartBarIcon className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="text-xs text-blue-600">{stats.totalHabits} total habits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/habits/create"
              className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <PlusIcon className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="font-medium text-gray-900">Create Habit</h3>
                <p className="text-sm text-gray-600">Start a new habit journey</p>
              </div>
            </Link>

            <Link
              href="/habits"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">My Habits</h3>
                <p className="text-sm text-gray-600">View and manage habits</p>
              </div>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed progress</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Upcoming Habits */}
        {upcomingHabits.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Habits</h2>
            <div className="space-y-3">
              {upcomingHabits.map((habit) => (
                <div key={habit._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{habit.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Next: {habit.reminders?.[0]?.time || 'No time set'}</span>
                      <span>•</span>
                      <span>in {habit.timeUntil}</span>
                      <span>•</span>
                      <span className="text-indigo-600">+{habit.honorPointsReward} HP</span>
                    </div>
                  </div>
                  
                  {!isHabitCompletedToday(habit) && (
                    <button
                      onClick={() => handleQuickComplete(habit._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Complete Now
                    </button>
                  )}
                  
                  {isHabitCompletedToday(habit) && (
                    <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Habits */}
        {habits.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Habits</h2>
            <div className="space-y-3">
              {habits.slice(0, 5).map((habit) => {
                const completedToday = isHabitCompletedToday(habit)
                return (
                  <div key={habit._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{habit.title}</h3>
                        {completedToday && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="capitalize">{habit.category}</span>
                        <span>🔥 {habit.analytics?.currentStreak || 0} days</span>
                        <span>{habit.analytics?.successRate || 0}% success</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-indigo-600">
                        +{habit.honorPointsReward} HP
                      </span>
                      <div className="text-xs text-gray-500 capitalize">
                        {habit.difficulty || 'Standard'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <Link
                href="/habits"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all habits →
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to start building habits?
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first habit and begin your journey to a better you!
            </p>
            <Link
              href="/habits/create"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Your First Habit</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
