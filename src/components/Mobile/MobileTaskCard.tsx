'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckIcon, 
  ClockIcon, 
  FireIcon, 
  SparklesIcon,
  BellIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import { taskNotificationManager } from '../../lib/taskNotifications'

interface MobileTaskCardProps {
  task: {
    _id: string
    title: string
    description?: string
    difficulty: 'easy' | 'medium' | 'hard'
    honorPointsReward: number
    reminderTime?: string
    isCompleted?: boolean
    currentStreak?: number
    completionRate?: number
  }
  onComplete: (taskId: string) => void
  onEdit?: (taskId: string) => void
}

export default function MobileTaskCard({ task, onComplete, onEdit }: MobileTaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-600'
      case 'medium': return 'from-yellow-500 to-orange-600'
      case 'hard': return 'from-red-500 to-pink-600'
      default: return 'from-blue-500 to-indigo-600'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢'
      case 'medium': return '🟡'
      case 'hard': return '🔴'
      default: return '🔵'
    }
  }

  const handleComplete = async () => {
    if (isCompleting || task.isCompleted) return
    
    setIsCompleting(true)
    
    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(200)
    }
    
    try {
      await onComplete(task._id)
      
      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (error) {
      console.error('Error completing task:', error)
      // Error haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([300, 100, 300])
      }
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className={`mobile-task-card relative ${task.isCompleted ? 'mobile-task-complete' : ''}`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="text-lg mr-2">{getDifficultyIcon(task.difficulty)}</span>
            <h3 className={`font-bold text-lg ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Task Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Honor Points */}
          <div className="flex items-center">
            <SparklesIcon className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-semibold text-yellow-600">
              +{task.honorPointsReward} pts
            </span>
          </div>

          {/* Streak */}
          {task.currentStreak && task.currentStreak > 0 && (
            <div className="flex items-center">
              <FireIcon className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm font-semibold text-orange-600">
                {task.currentStreak} day{task.currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Reminder Time */}
        {task.reminderTime && (
          <div className="flex items-center">
            <BellIcon className="w-4 h-4 text-indigo-500 mr-1" />
            <span className="text-sm text-indigo-600 font-medium">
              {task.reminderTime}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {task.completionRate !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Completion Rate</span>
            <span className="text-xs font-semibold text-gray-700">{task.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${task.completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(task.difficulty)}`}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleComplete}
        disabled={isCompleting || task.isCompleted}
        className={`mobile-btn-primary ${
          task.isCompleted 
            ? 'opacity-50 cursor-not-allowed bg-gray-400' 
            : isCompleting 
            ? 'opacity-70 cursor-wait' 
            : ''
        }`}
      >
        <div className="flex items-center justify-center">
          {isCompleting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Completing...
            </>
          ) : task.isCompleted ? (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Completed Today! 🎉
            </>
          ) : (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Mark Complete
            </>
          )}
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute right-4 top-16 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 min-w-[120px]"
        >
          <button
            onClick={() => {
              onEdit?.(task._id)
              setShowMenu(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit Task
          </button>
          <button
            onClick={() => {
              // Schedule notification
              taskNotificationManager.scheduleTaskReminder(task)
              setShowMenu(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Set Reminder
          </button>
          <button
            onClick={() => {
              // Share task
              if (navigator.share) {
                navigator.share({
                  title: task.title,
                  text: `Check out my task: ${task.title}`,
                  url: window.location.href
                })
              }
              setShowMenu(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Share
          </button>
        </motion.div>
      )}

      {/* Tap outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  )
}
