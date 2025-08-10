'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { reminderManager } from '@/lib/reminderManager'
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
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const categories = [
  { id: 'health', name: 'Health & Fitness', icon: HeartIcon, color: 'bg-red-100 text-red-600' },
  { id: 'learning', name: 'Learning', icon: AcademicCapIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 'productivity', name: 'Productivity', icon: BriefcaseIcon, color: 'bg-green-100 text-green-600' },
  { id: 'mindfulness', name: 'Mindfulness', icon: SparklesIcon, color: 'bg-purple-100 text-purple-600' },
  { id: 'social', name: 'Social', icon: UserGroupIcon, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'other', name: 'Other', icon: BookOpenIcon, color: 'bg-gray-100 text-gray-600' }
]

const proofTypes = [
  { id: 'photo', name: 'Photo', icon: CameraIcon, description: 'Upload a photo as proof' },
  { id: 'text', name: 'Text Note', icon: DocumentTextIcon, description: 'Write a brief description' },
  { id: 'none', name: 'Self-verification', icon: SparklesIcon, description: 'Honor system only' }
]

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onHabitCreated: () => void
}

export default function CreateHabitModal({ isOpen, onClose, onHabitCreated }: CreateHabitModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy',
    frequency: 'daily',
    reminderTime: '',
    proofType: 'none',
    tags: ''
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'easy',
      frequency: 'daily',
      reminderTime: '',
      proofType: 'none',
      tags: ''
    })
    setStep(1)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const habitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        frequency: {
          type: formData.frequency,
          daysOfWeek: [], // Default to empty, can be expanded later
          customSchedule: []
        },
        reminderTime: formData.reminderTime,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        requiresProof: formData.proofType !== 'none',
        proofType: formData.proofType !== 'none' ? formData.proofType : undefined
      }

      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Habit created successfully! 🎉')
        
        // Schedule reminder if reminder time is set
        if (formData.reminderTime && result.habit && reminderManager) {
          try {
            await reminderManager.scheduleHabitReminders([result.habit])
            toast.success('Reminder scheduled! 🔔')
          } catch (error) {
            console.error('Error scheduling reminder:', error)
            toast.error('Habit created but reminder scheduling failed')
          }
        }
        
        handleClose()
        onHabitCreated()
      } else {
        toast.error(result.message || 'Failed to create habit')
      }
    } catch (error) {
      console.error('Error creating habit:', error)
      toast.error('Failed to create habit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.description.trim()
      case 2:
        return formData.category
      case 3:
        return formData.difficulty && formData.frequency
      default:
        return false
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      Create New Habit
                    </Dialog.Title>
                    <p className="text-gray-600 mt-1">Build a new positive habit to enhance your daily routine</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          step >= num
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {num}
                      </div>
                      {num < 3 && (
                        <div
                          className={`w-16 h-1 mx-2 ${
                            step > num ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Habit Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="e.g., Drink 8 glasses of water"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          placeholder="Describe your habit and why it's important to you..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="e.g., health, morning, wellness (comma-separated)"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Category */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Choose a Category *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {categories.map((category) => {
                            const IconComponent = category.icon
                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => setFormData({...formData, category: category.id})}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                  formData.category === category.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className={`inline-flex p-2 rounded-lg ${category.color} mb-2`}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <h3 className="font-medium text-gray-900">{category.name}</h3>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Settings */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency
                        </label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level *
                        </label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          <option value="easy">🟢 Easy (10 points)</option>
                          <option value="medium">🟡 Medium (20 points)</option>
                          <option value="hard">🔴 Hard (30 points)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">Higher difficulty = more honor points!</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Reminder (optional)
                        </label>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="time"
                            value={formData.reminderTime}
                            onChange={(e) => setFormData({...formData, reminderTime: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Proof of Completion
                        </label>
                        <div className="space-y-3">
                          {proofTypes.map((type) => {
                            const IconComponent = type.icon
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData({...formData, proofType: type.id})}
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center space-x-3 ${
                                  formData.proofType === type.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  <IconComponent className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">{type.name}</h3>
                                  <p className="text-sm text-gray-500">{type.description}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-indigo-800">
                          <SparklesIcon className="h-5 w-5" />
                          <span className="font-medium">Reward: +15 Honor Points per completion</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        step === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex space-x-3">
                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid()}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isStepValid()
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            loading
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <PlusIcon className="h-4 w-4" />
                              <span>Create Habit</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
