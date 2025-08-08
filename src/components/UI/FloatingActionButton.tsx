'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
  SparklesIcon,
  CheckCircleIcon,
  CameraIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const actions = [
    {
      label: 'Add Habit',
      icon: PlusIcon,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => router.push('/habits/create')
    },
    {
      label: 'Quick Check-in',
      icon: CheckCircleIcon,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => router.push('/habits?quick=true')
    },
    {
      label: 'Take Photo',
      icon: CameraIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => router.push('/proof/camera')
    },
    {
      label: 'AI Coach',
      icon: SparklesIcon,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => router.push('/coach')
    },
    {
      label: 'View Stats',
      icon: ChartBarIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => router.push('/analytics')
    }
  ]

  const handleActionClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.5 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleActionClick(action.action)}
                className={`flex items-center space-x-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <PlusIcon className="h-6 w-6 text-white" />
        )}
      </motion.button>

      {/* Helper Text */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 right-16 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Quick Actions
        </motion.div>
      )}
    </div>
  )
}

export default FloatingActionButton
