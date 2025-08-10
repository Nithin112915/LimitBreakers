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
  overview: {
    totalHabits: number
    completedToday: number
    currentStreak: number
    totalPoints: number
  }
  weeklyActivity: Array<{
    date: string
    count: number
  }>
  categoryStats: Array<{
    category: string
    completed: number
    total: number
  }>
  recentCompletions: Array<{
    habitName: string
    completedAt: string
    points: number
  }>
  motivationalQuote?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Dashboard useEffect - status:', status, 'session:', session?.user?.email)
    
    if (status === 'loading') {
      console.log('Authentication loading...')
      return
    }
    
    if (status === 'unauthenticated') {
      console.log('User not authenticated')
      setLoading(false)
      setError('Please sign in to view your dashboard')
      return
    }
    
    if (status === 'authenticated' && session?.user) {
      console.log('User authenticated, fetching dashboard data')
      fetchDashboardData()
    }
  }, [status, session])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching dashboard data for session:', session?.user?.email)
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log('Dashboard API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Dashboard API error:', errorText)
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Dashboard data received:', data)
      setDashboardData(data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Dashboard loading timed out. Please try again.')
      } else {
        setError('Unable to load dashboard data')
      }
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="text-center slide-in-animation">
          <div className="floating-animation">
            <div className="pulse-animation rounded-full h-16 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="premium-text text-xl neon-glow">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="text-center slide-in-animation">
          <div className="glass-morphism rounded-2xl p-8 max-w-md">
            <p className="text-red-400 text-lg mb-6">{error || 'Failed to load dashboard'}</p>
            <button
              onClick={fetchDashboardData}
              className="button-3d ripple-effect px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { user, overview, weeklyActivity, categoryStats, recentCompletions, motivationalQuote } = dashboardData

  return (
    <div className="min-h-screen premium-gradient">
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="slide-in-animation">
          <div className="mb-8">
            <h1 className="text-4xl font-bold premium-text mb-2 neon-glow">
              Welcome back, {user?.name || 'Champion'}! 🎯
            </h1>
            <p className="premium-text-muted text-lg">
              Ready to break your limits today?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation neon-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="premium-text-muted text-sm mb-1">Honor Points</p>
                  <p className="text-3xl font-bold gold-accent neon-glow pulse-animation">{user?.honorPoints || 0}</p>
                  <div className="text-xs premium-text-muted mt-1">Level {user?.level || 1}</div>
                </div>
                <TrophyIcon className="h-10 w-10 gold-accent floating-animation" />
              </div>
            </div>

            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation ripple-effect" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="premium-text-muted text-sm mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-400 neon-glow">{user?.streak || 0} days</p>
                  <div className="text-xs premium-text-muted mt-1">Longest: {user?.longestStreak || 0}</div>
                </div>
                <FireIcon className="h-10 w-10 text-orange-400 pulse-animation" />
              </div>
            </div>

            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation button-3d" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="premium-text-muted text-sm mb-1">Completed Today</p>
                  <p className="text-3xl font-bold text-green-400 neon-glow">{overview?.completedToday || 0}</p>
                  <div className="text-xs premium-text-muted mt-1">Great progress!</div>
                </div>
                <CheckCircleIcon className="h-10 w-10 text-green-400 floating-animation" />
              </div>
            </div>

            <div className="card-3d glass-morphism rounded-xl p-6 floating-animation progress-bar-3d" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="premium-text-muted text-sm mb-1">Total Habits</p>
                  <p className="text-3xl font-bold text-blue-400 neon-glow">{overview?.totalHabits || 0}</p>
                  <div className="text-xs premium-text-muted mt-1">Keep building!</div>
                </div>
                <ChartBarIcon className="h-10 w-10 text-blue-400 pulse-animation" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card-3d glass-morphism rounded-xl p-6 glow-effect">
              <h2 className="text-xl font-semibold premium-text mb-4 flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/habits/create" 
                  className="button-3d ripple-effect flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <PlusIcon className="h-5 w-5 mr-3 text-green-400" />
                  <span className="premium-text">Create New Habit</span>
                </Link>
                <Link 
                  href="/habits" 
                  className="button-3d ripple-effect flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-blue-400" />
                  <span className="premium-text">Complete Habits</span>
                </Link>
                <Link 
                  href="/community" 
                  className="button-3d ripple-effect flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <UserIcon className="h-5 w-5 mr-3 text-purple-400" />
                  <span className="premium-text">Join Community</span>
                </Link>
              </div>
            </div>

            <div className="card-3d glass-morphism rounded-xl p-6">
              <h2 className="text-xl font-semibold premium-text mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Daily Motivation
              </h2>
              <div className="text-center py-8">
                <p className="text-lg premium-text-muted italic">
                  "{motivationalQuote || 'Every small step forward is progress. Keep pushing your limits!'}"
                </p>
              </div>
            </div>
          </div>

          {recentCompletions && recentCompletions.length > 0 && (
            <div className="card-3d glass-morphism rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold premium-text mb-6 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Recent Completions
              </h2>
              <div className="space-y-3">
                {recentCompletions.slice(0, 5).map((completion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      <span className="premium-text">{completion.habitName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-400 font-semibold">+{completion.points} pts</span>
                      <p className="text-xs premium-text-muted">
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/habits" className="group">
              <div className="card-3d glass-morphism rounded-xl p-6 group-hover:scale-105 transition-all duration-300">
                <CheckCircleIcon className="h-8 w-8 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold premium-text mb-2">My Habits</h3>
                <p className="premium-text-muted text-sm">Track and complete your daily habits</p>
              </div>
            </Link>

            <Link href="/leaderboard" className="group">
              <div className="card-3d glass-morphism rounded-xl p-6 group-hover:scale-105 transition-all duration-300">
                <TrophyIcon className="h-8 w-8 text-yellow-400 mb-4" />
                <h3 className="text-lg font-semibold premium-text mb-2">Leaderboard</h3>
                <p className="premium-text-muted text-sm">See how you rank among peers</p>
              </div>
            </Link>

            <Link href="/achievements" className="group">
              <div className="card-3d glass-morphism rounded-xl p-6 group-hover:scale-105 transition-all duration-300">
                <SparklesIcon className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold premium-text mb-2">Achievements</h3>
                <p className="premium-text-muted text-sm">Unlock badges and rewards</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
