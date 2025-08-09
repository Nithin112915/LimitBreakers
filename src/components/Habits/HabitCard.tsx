'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  CameraIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

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

interface HabitCardProps {
  habit: Habit
  onComplete: (habitId: string, proofUrl?: string, proofType?: string, notes?: string) => void
  onToggleStatus: (habitId: string, isActive: boolean) => void
  onEdit: (habitId: string) => void
  onDelete: (habitId: string) => void
  onViewDetails: (habitId: string) => void
  isCompleting?: boolean
}

const categoryColors: { [key: string]: string } = {
  health: 'bg-red-100 text-red-800 border-red-200',
  learning: 'bg-blue-100 text-blue-800 border-blue-200',
  productivity: 'bg-green-100 text-green-800 border-green-200',
  mindfulness: 'bg-purple-100 text-purple-800 border-purple-200',
  social: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200'
}

const difficultyColors: { [key: string]: string } = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600'
}

const HabitCard = ({ 
  task, 
  onComplete, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  onViewDetails,
  isCompleting = false 
}: {
  task: any;
  onComplete: (id: string, proofUrl?: string, proofType?: string, notes?: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  isCompleting?: boolean;
}) => {
  const [showProofModal, setShowProofModal] = useState(false)
  const [proofData, setProofData] = useState({ notes: '', file: null as File | null })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return task.completions?.some((completion: any) => 
      completion.date.startsWith(today)
    )
  }

  const requiresProof = task.proofRequirements && task.proofRequirements.length > 0

  const handleCompleteClick = () => {
    if (requiresProof) {
      setShowProofModal(true)
    } else {
      onComplete(task._id)
    }
  }

  const handleProofSubmit = async () => {
    setIsSubmitting(true)
    try {
      let proofUrl = ''
      
      if (proofData.file) {
        // In a real app, you'd upload the file and get a URL
        // For now, we'll simulate this
        proofUrl = 'uploaded-file-url'
      }

      await onComplete(
        task._id, 
        proofUrl, 
        task.proofRequirements[0]?.type, 
        proofData.notes
      )
      
      setShowProofModal(false)
      setProofData({ notes: '', file: null })
      toast.success('Habit completed successfully! 🎉')
    } catch (error) {
      toast.error('Failed to complete habit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCompletedToday = hasCompletedToday()

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 ${
          !task.isActive ? 'opacity-60' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                categoryColors[task.category] || categoryColors.other
              }`}>
                {task.category}
              </span>
              <span className={`text-sm font-bold ${difficultyColors[task.difficulty || 'easy']}`}> 
                +{task.honorPointsReward} HP
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
            )}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {isCompletedToday && (
              <CheckCircleIconSolid className="h-6 w-6 text-green-500" />
            )}
            {!task.isActive && (
              <PauseIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <FireIcon className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold text-gray-900">
                {task.analytics?.currentStreak || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <span className="text-lg font-bold text-gray-900">
                {task.analytics?.totalCompletions || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ChartBarIcon className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-bold text-gray-900">
                {Math.round(task.analytics?.successRate || 0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Success</p>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
              >
                <TagIcon className="h-3 w-3" />
                <span>{tag}</span>
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                +{task.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Main Action Button */}
        <div className="mb-4">
          {task.isActive ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteClick}
              disabled={isCompletedToday || isCompleting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isCompletedToday
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
              }`}
            >
              {isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Completing...</span>
                </>
              ) : isCompletedToday ? (
                <>
                  <CheckCircleIconSolid className="h-5 w-5" />
                  <span>Completed Today</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Mark Complete</span>
                </>
              )}
            </motion.button>
          ) : (
            <button
            onClick={() => onToggleStatus(task._id, true)}
              className="w-full py-3 px-4 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Resume Habit</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onViewDetails(task._id)}
            className="flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(task._id)}
            className="flex items-center justify-center p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Habit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleStatus(task._id, !task.isActive)}
            className="flex items-center justify-center p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title={task.isActive ? 'Pause Task' : 'Resume Task'}
          >
            {task.isActive ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="flex items-center justify-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Habit"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Reminder */}
        {task.reminders && task.reminders.length > 0 && task.reminders[0].isEnabled && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
            <ClockIcon className="h-4 w-4" />
            <span>Reminder at {task.reminders[0].time}</span>
          </div>
        )}
      </motion.div>

      {/* Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Submit Proof</h3>
            <div className="space-y-4">
              {task.proofRequirements[0]?.type === 'photo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photo or File
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    capture="environment"
                    onChange={(e) => setProofData(prev => ({ 
                      ...prev, 
                      file: e.target.files?.[0] || null 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={proofData.notes}
                  onChange={(e) => setProofData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about your completion..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProofModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProofSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default HabitCard
