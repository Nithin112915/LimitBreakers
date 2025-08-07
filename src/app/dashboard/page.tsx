'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  FireIcon,
  UserGroupIcon,
  BellIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { QuickStats } from '../../components/Dashboard/QuickStats'
import { HabitOverview } from '../../components/Dashboard/HabitOverview'
import { StreakCalendar } from '../../components/Dashboard/StreakCalendar'
import { AIRecommendations } from '../../components/Dashboard/AIRecommendations'
import { RecentActivity } from '../../components/Dashboard/RecentActivity'
import { UpcomingHabits } from '../../components/Dashboard/UpcomingHabits'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  // Redirect to signin if not authenticated (after loading is complete)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show loading while redirecting
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 animate-pulse">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  // Use session data for authenticated users
  const currentUser = session?.user || {
    name: 'Demo User',
    email: 'demo@example.com',
    honorPoints: 2450,
    level: 5,
    avatar: '/api/placeholder/40/40'
  }

  const quickActions = [
    { name: 'Add Habit', icon: PlusIcon, color: 'bg-indigo-500 hover:bg-indigo-600' },
    { name: 'View Analytics', icon: ChartBarIcon, color: 'bg-emerald-500 hover:bg-emerald-600' },
    { name: 'Set Reminder', icon: BellIcon, color: 'bg-orange-500 hover:bg-orange-600' },
    { name: 'Join Challenge', icon: UserGroupIcon, color: 'bg-purple-500 hover:bg-purple-600' }
  ]

  const levelProgress = (currentUser.honorPoints % 1000) / 1000 * 100

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-6">
              <QuickStats />
              <HabitOverview />
              <StreakCalendar />
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <AIRecommendations />
              <UpcomingHabits />
              <RecentActivity />
            </div>
          </div>
        )
      
      case 'habits':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Habits</h2>
              <HabitOverview />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Habit Calendar</h2>
              <StreakCalendar />
            </div>
          </div>
        )
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Analytics</h2>
              <QuickStats />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Streak Analysis</h3>
                <StreakCalendar />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Progress</h3>
                <RecentActivity />
              </div>
            </div>
          </div>
        )
      
      case 'social':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Feed</h2>
              <RecentActivity />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard</h2>
              <div className="text-center py-8 text-gray-500">
                <UserGroupIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Community features coming soon!</p>
              </div>
            </div>
          </div>
        )
      
      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-purple-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                AI Recommendations
              </h2>
              <AIRecommendations />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Goals</h2>
              <UpcomingHabits />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome back, {currentUser.name}! 👋
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  Level {Math.floor(currentUser.honorPoints / 1000) + 1} • Continue your streak
                </p>
                <div className="mt-2 w-48 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl px-4 py-2 border border-yellow-200">
                <TrophyIcon className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-yellow-700">
                  {currentUser.honorPoints?.toLocaleString() || 0} HP
                </span>
              </div>
              
              <div className="flex space-x-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className={`${action.color} text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 tooltip`}
                    title={action.name}
                  >
                    <action.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-2 mb-8"
        >
          <nav className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'habits', name: 'My Habits', icon: CalendarIcon },
              { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
              { id: 'social', name: 'Community', icon: UserGroupIcon },
              { id: 'ai', name: 'AI Coach', icon: SparklesIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}
