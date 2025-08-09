'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobileApp, useHaptics } from '@/hooks/useMobile'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const categories = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: 'bg-green-100 text-green-800' },
  { id: 'learning', name: 'Learning', icon: '📚', color: 'bg-blue-100 text-blue-800' },
  { id: 'productivity', name: 'Productivity', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', color: 'bg-purple-100 text-purple-800' },
  { id: 'creativity', name: 'Creativity', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
  { id: 'social', name: 'Social', icon: '👥', color: 'bg-indigo-100 text-indigo-800' },
]

const difficulties = [
  { id: 'easy', name: 'Easy', points: 10, color: 'bg-green-500' },
  { id: 'medium', name: 'Medium', points: 20, color: 'bg-yellow-500' },
  { id: 'hard', name: 'Hard', points: 30, color: 'bg-red-500' },
]

export default function MobileCreateHabitPage() {
  const router = useRouter()
  const isMobileApp = useIsMobileApp()
  const { mediumImpact, success } = useHaptics()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy',
    reminderTime: '09:00',
    proofRequired: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isMobileApp) {
    return null // Regular create page will be shown
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a habit title')
      return
    }

    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    setIsSubmitting(true)
    mediumImpact()

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          difficulty: formData.difficulty,
          frequency: { type: 'daily' },
          honorPointsReward: difficulties.find(d => d.id === formData.difficulty)?.points || 10,
          reminders: formData.reminderTime ? [{
            time: formData.reminderTime,
            isEnabled: true
          }] : [],
          proofRequirements: formData.proofRequired ? [{
            type: 'photo',
            description: 'Upload a photo as proof'
          }] : [],
        }),
      })

      if (response.ok) {
        success()
        toast.success('Habit created successfully!')
        router.push('/habits')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create habit')
      }
    } catch (error) {
      console.error('Error creating habit:', error)
      toast.error('Failed to create habit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="mobile-header fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="haptic-feedback p-2 -ml-2"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Create Habit</h1>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim()}
            className={`haptic-feedback p-2 -mr-2 ${
              isSubmitting || !formData.title.trim()
                ? 'opacity-50'
                : 'text-primary-600'
            }`}
          >
            <CheckIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="pt-16 pb-8">
        <div className="p-4 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Morning meditation"
              className="mobile-input"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="What does this habit involve?"
              rows={3}
              className="mobile-input resize-none"
              maxLength={500}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleInputChange('category', category.id)}
                  className={`mobile-card p-4 text-left transition-all ${
                    formData.category === category.id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {category.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => handleInputChange('difficulty', difficulty.id)}
                  className={`mobile-card p-3 text-center transition-all ${
                    formData.difficulty === difficulty.id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${difficulty.color} mx-auto mb-2`} />
                  <div className="font-medium text-gray-900 text-sm">
                    {difficulty.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{difficulty.points} points
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Reminder
            </label>
            <input
              type="time"
              value={formData.reminderTime}
              onChange={(e) => handleInputChange('reminderTime', e.target.value)}
              className="mobile-input"
            />
          </div>

          {/* Proof Required */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.proofRequired}
                onChange={(e) => handleInputChange('proofRequired', e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-gray-900">Require proof</div>
                <div className="text-sm text-gray-500">
                  Ask for photo evidence when completing
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
