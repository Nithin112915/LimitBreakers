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
  SparklesIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalHonorPoints: number
  totalHabits: number
  activeHabits: number
  completedToday: number
  currentStreak: number
  longestStreak: number
}

interface Habit {
  _id: string
  title: string
  description: string
  category: string
  difficulty: string
  honorPointsReward: number
  isActive: boolean
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalHonorPoints: 0,
    totalHabits: 0,
    activeHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0
  })
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [session, status])

  const fetchDashboardData = async () => {
    try {
      const habitsResponse = await fetch('/api/habits')
      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json()
        const habitsArray = Array.isArray(habitsData) ? habitsData : []
        setHabits(habitsArray)
        
        // Calculate stats from habits data
        const today = new Date().toISOString().split('T')[0]
        const completedToday = habitsArray.filter(h => 
          h.completions?.some((c: any) => c.date.startsWith(today))
        ).length
        
        const activeHabits = habitsArray.filter(h => h.isActive).length
        const totalHonorPoints = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0) * h.honorPointsReward, 0
        )

        setStats({
          totalHonorPoints,
          totalHabits: habitsArray.length,
          activeHabits,
          completedToday,
          currentStreak: Math.max(...habitsArray.map(h => h.analytics?.currentStreak || 0), 0),
          longestStreak: Math.max(...habitsArray.map(h => h.analytics?.longestStreak || 0), 0)
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to LimitBreakers</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your dashboard</p>
          <Link
            href="/auth/signin"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            Here is your simple dashboard - the old version is back!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <TrophyIcon className="h-10 w-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Honor Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHonorPoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <FireIcon className="h-10 w-10 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <ChartBarIcon className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Habits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeHabits}</p>
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-gray-600">Add a new habit to track</p>
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

        {habits.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Habits</h2>
            <div className="space-y-3">
              {habits.slice(0, 5).map((habit) => (
                <div key={habit._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{habit.title}</h3>
                    <p className="text-sm text-gray-600">{habit.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-indigo-600">
                      +{habit.honorPointsReward} HP
                    </span>
                  </div>
                </div>
              ))}
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
