'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Loading from '../../components/UI/Loading'
import HabitCard from '../../components/Habits/HabitCard'
import CreateHabitModal from '../../components/Habits/CreateHabitModal'
import { notificationManager } from '../../lib/notifications'
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BellIcon
} from '@heroicons/react/24/outline'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

interface Habit {
  _id: string
  title: string
  description: string
  category: string
  difficulty?: string
  honorPointsReward: number
  frequency: { type: string }
  reminders: Array<{ time: string; isEnabled: boolean }>
  proofRequirements: Array<{ type: string; description: string }>
  tags: string[]
  isActive: boolean
  createdAt: string
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

export default function HabitsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [completingHabit, setCompletingHabit] = useState<string | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (session) {
      fetchHabits()
      initializeNotifications()
    } else {
      setLoading(false) // No session, stop loading
    }
  }, [session, status])

  // Check for create modal parameter
  useEffect(() => {
    const createParam = searchParams.get('create')
    if (createParam === 'true') {
      setShowCreateModal(true)
      // Clean up URL without the parameter
      router.replace('/habits', { scroll: false })
    }
  }, [searchParams, router])

  const initializeNotifications = async () => {
    const granted = await notificationManager.requestPermission()
    setNotificationsEnabled(granted)
    
    if (granted) {
      // Schedule notifications for all habits once granted
      const response = await fetch('/api/habits')
      if (response.ok) {
        const habitsData = await response.json()
        const habitsArray = Array.isArray(habitsData) ? habitsData : []
        notificationManager.scheduleAllHabitReminders(habitsArray)
      }
    }
  }

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      if (response.ok) {
        const data = await response.json()
        setHabits(data)
      } else {
        const errorData = await response.json()
        toast.error('Failed to load habits')
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  const completeHabit = async (habitId: string, proofUrl?: string, proofType?: string, notes?: string) => {
    setCompletingHabit(habitId)
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofUrl, proofType, notes })
      })

      if (response.ok) {
        const result = await response.json()
        // Update the habit in the local state
        setHabits(prev => prev.map(habit => 
          habit._id === habitId 
            ? { 
                ...habit, 
                completions: [...(habit.completions || []), {
                  date: new Date().toISOString(),
                  proofUrl,
                  proofType,
                  notes
                }],
                analytics: {
                  ...habit.analytics,
                  totalCompletions: (habit.analytics?.totalCompletions || 0) + 1,
                  currentStreak: result.newStreak || (habit.analytics?.currentStreak || 0) + 1
                }
              }
            : habit
        ))
        
        toast.success(`Habit completed! +${result.honorPointsEarned || 0} Honor Points 🎉`)
        
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

        // Show streak notification for milestones
        if (result.newStreak > 1 && result.newStreak % 7 === 0) {
          const habitTitle = habits.find(h => h._id === habitId)?.title || 'Habit'
          notificationManager.showStreakNotification(result.newStreak, habitTitle)
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to complete habit')
      }
    } catch (error) {
      console.error('Error completing habit:', error)
      toast.error('Failed to complete habit')
    } finally {
      setCompletingHabit(null)
    }
  }

  const toggleHabitStatus = async (habitId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        setHabits(prev => prev.map(habit => 
          habit._id === habitId ? { ...habit, isActive } : habit
        ))
        toast.success(`Habit ${isActive ? 'resumed' : 'paused'} successfully`)
      } else {
        toast.error('Failed to update habit status')
      }
    } catch (error) {
      console.error('Error toggling habit status:', error)
      toast.error('Failed to update habit status')
    }
  }

  const editHabit = (habitId: string) => {
    router.push(`/habits/${habitId}/edit`)
  }

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setHabits(prev => prev.filter(habit => habit._id !== habitId))
        toast.success('Habit deleted successfully')
      } else {
        toast.error('Failed to delete habit')
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast.error('Failed to delete habit')
    }
  }

  const viewHabitDetails = (habitId: string) => {
    router.push(`/habits/${habitId}`)
  }

  const hasCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0]
    return habit.completions?.some(completion => 
      completion.date.startsWith(today)
    )
  }

  const filteredHabits = habits.filter(habit => {
    // Filter by search term
    const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by status
    const matchesFilter = (() => {
      switch (filter) {
        case 'active': return habit.isActive
        case 'paused': return !habit.isActive
        case 'completed': return hasCompletedToday(habit)
        case 'pending': return habit.isActive && !hasCompletedToday(habit)
        default: return true
      }
    })()

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <Loading message="Loading your habits..." />
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your habits.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Habits</h1>
            <p className="text-gray-600">Track and manage your daily habits</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 w-fit"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Habit</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search habits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', name: 'All', count: habits.length },
                { id: 'pending', name: 'Pending', count: habits.filter(h => h.isActive && !hasCompletedToday(h)).length },
                { id: 'completed', name: 'Completed Today', count: habits.filter(h => hasCompletedToday(h)).length },
                { id: 'active', name: 'Active', count: habits.filter(h => h.isActive).length },
                { id: 'paused', name: 'Paused', count: habits.filter(h => !h.isActive).length }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === filterOption.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                  }`}
                >
                  <span>{filterOption.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    filter === filterOption.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filterOption.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        {filteredHabits.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onComplete={completeHabit}
                  onToggleStatus={toggleHabitStatus}
                  onEdit={editHabit}
                  onDelete={deleteHabit}
                  onViewDetails={viewHabitDetails}
                  isCompleting={completingHabit === habit._id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {searchTerm || filter !== 'all' ? 'No habits found' : 'No habits yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filters.'
                    : 'Start building better habits today!'
                  }
                </p>
                {(!searchTerm && filter === 'all') && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Create Your First Habit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Habit Modal */}
      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onHabitCreated={() => {
          setShowCreateModal(false)
          fetchHabits() // Refresh the habits list
        }}
      />
    </div>
  )
}
