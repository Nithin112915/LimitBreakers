'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Loading from '../../../components/UI/Loading'
import {
  BookOpenIcon,
  HeartIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  UserGroupIcon,
  PlusIcon,
  ClockIcon,
  CameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const categories = [
  { id: 'health', name: 'Health & Fitness', icon: HeartIcon, color: 'bg-red-100 text-red-600' },
  { id: 'learning', name: 'Learning', icon: AcademicCapIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 'productivity', name: 'Productivity', icon: BriefcaseIcon, color: 'bg-green-100 text-green-600' },
  { id: 'mindfulness', name: 'Mindfulness', icon: SparklesIcon, color: 'bg-purple-100 text-purple-600' },
  { id: 'social', name: 'Social', icon: UserGroupIcon, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'other', name: 'Other', icon: BookOpenIcon, color: 'bg-gray-100 text-gray-600' }
]

const difficulties = [
  { id: 'easy', name: 'Easy', points: 10, description: 'Simple daily tasks' },
  { id: 'medium', name: 'Medium', points: 15, description: 'Moderate effort required' },
  { id: 'hard', name: 'Hard', points: 25, description: 'Challenging commitments' }
]

const proofTypes = [
  { id: 'photo', name: 'Photo', icon: CameraIcon, description: 'Upload a photo as proof' },
  { id: 'text', name: 'Text Note', icon: DocumentTextIcon, description: 'Write a brief description' },
  { id: 'none', name: 'Self-verification', icon: SparklesIcon, description: 'Honor system only' }
]

export default function CreateHabitPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    frequency: 'daily',
    reminderTime: '',
    proofType: 'none',
    tags: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.difficulty) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          difficulty: formData.difficulty,
          frequency: { type: formData.frequency },
          reminders: formData.reminderTime ? [{ 
            time: formData.reminderTime, 
            isEnabled: true 
          }] : [],
          proofRequirements: formData.proofType !== 'none' ? [{
            type: formData.proofType,
            description: `Submit ${formData.proofType} proof`,
            isRequired: true
          }] : [],
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      })

      if (response.ok) {
        toast.success('Habit created successfully! 🎉')
        router.push('/dashboard?tab=habits&created=true')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to create habit' }))
        toast.error(error.message || 'Failed to create habit')
      }
    } catch (error) {
      console.error('Error creating habit:', error)
      toast.error('Failed to create habit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedDifficulty = difficulties.find(d => d.id === formData.difficulty)

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <Loading message="Preparing habit creation..." />
  }

  // Redirect to sign in if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to create habits.</p>
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Habit</h1>
            <p className="text-gray-600">Build a new positive habit to enhance your daily routine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Morning meditation, Read for 30 minutes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your habit and why it's important to you..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.category === category.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <category.icon className={`h-6 w-6 mx-auto mb-2 ${
                      formData.category === category.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <div className={`text-sm font-medium ${
                      formData.category === category.id ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Difficulty Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: difficulty.id }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.difficulty === difficulty.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-semibold ${
                      formData.difficulty === difficulty.id ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {difficulty.name}
                    </div>
                    <div className={`text-sm ${
                      formData.difficulty === difficulty.id ? 'text-primary-600' : 'text-gray-600'
                    }`}>
                      +{difficulty.points} Honor Points
                    </div>
                    <div className={`text-xs mt-1 ${
                      formData.difficulty === difficulty.id ? 'text-primary-500' : 'text-gray-500'
                    }`}>
                      {difficulty.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reminder Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Reminder (Optional)
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Proof Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Proof of Completion
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proofTypes.map((proof) => (
                  <button
                    key={proof.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, proofType: proof.id }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.proofType === proof.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <proof.icon className={`h-6 w-6 mx-auto mb-2 ${
                      formData.proofType === proof.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <div className={`font-medium text-sm ${
                      formData.proofType === proof.id ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      {proof.name}
                    </div>
                    <div className={`text-xs mt-1 ${
                      formData.proofType === proof.id ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {proof.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., morning, health, productivity (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Summary */}
            {selectedDifficulty && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Habit Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Reward:</span> +{selectedDifficulty.points} Honor Points per completion</p>
                  <p><span className="font-medium">Frequency:</span> Daily</p>
                  {formData.reminderTime && (
                    <p><span className="font-medium">Reminder:</span> {formData.reminderTime}</p>
                  )}
                  {formData.proofType !== 'none' && (
                    <p><span className="font-medium">Proof:</span> {proofTypes.find(p => p.id === formData.proofType)?.name} required</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.category || !formData.difficulty}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Habit
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
