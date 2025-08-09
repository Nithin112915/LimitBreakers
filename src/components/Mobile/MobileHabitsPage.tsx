'use client'

import { useState, useEffect } from 'react'
import { useIsMobileApp } from '@/hooks/useMobile'
import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

interface Habit {
  _id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  streak: number
  honorPoints: number
  completedToday: boolean
  createdAt: string
}

export default function MobileHabitsPage() {
  const isMobileApp = useIsMobileApp()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      if (response.ok) {
        const data = await response.json()
        setHabits(data.habits || [])
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        setHabits(habits.map(habit => 
          habit._id === habitId 
            ? { ...habit, completedToday: !habit.completedToday }
            : habit
        ))
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
    }
  }

  const filteredHabits = habits.filter(habit => {
    if (filter === 'completed') return habit.completedToday
    if (filter === 'pending') return !habit.completedToday
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isMobileApp) {
    return null // Regular habits page will be shown
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading habits...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Filter Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'completed', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habits List */}
      <div className="p-4 space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              {filter === 'all' ? 'No habits yet' : `No ${filter} habits`}
            </div>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium">
              Create Your First Habit
            </button>
          </div>
        ) : (
          filteredHabits.map((habit) => (
            <div
              key={habit._id}
              className="mobile-card p-4 bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {habit.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                      {habit.difficulty}
                    </span>
                  </div>
                  
                  {habit.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {habit.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="font-medium text-orange-600">
                          🔥 {habit.streak}
                        </span>
                        <span className="text-gray-500 ml-1">streak</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-primary-600">
                          +{habit.honorPoints}
                        </span>
                        <span className="text-gray-500 ml-1">points</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleHabitCompletion(habit._id)}
                      className="haptic-feedback p-2"
                    >
                      {habit.completedToday ? (
                        <CheckCircleIconSolid className="w-8 h-8 text-green-500" />
                      ) : (
                        <CheckCircleIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-primary-600 rounded-full shadow-lg flex items-center justify-center haptic-feedback">
        <PlusIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}
