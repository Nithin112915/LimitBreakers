'use client'

import { motion } from 'framer-motion'
import { 
  ClockIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const upcomingHabits = [
  {
    id: 1,
    title: 'Exercise for 45 minutes',
    time: '6:00 PM',
    timeUntil: '2 hours',
    category: 'Fitness',
    difficulty: 'Hard',
    honorPoints: 25,
    reminderSet: true
  },
  {
    id: 2,
    title: 'Write in journal',
    time: '10:00 PM',
    timeUntil: '6 hours',
    category: 'Productivity', 
    difficulty: 'Easy',
    honorPoints: 10,
    reminderSet: true
  },
  {
    id: 3,
    title: 'Plan tomorrow',
    time: '10:30 PM',
    timeUntil: '6.5 hours',
    category: 'Productivity',
    difficulty: 'Easy', 
    honorPoints: 5,
    reminderSet: false
  }
]

export function UpcomingHabits() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Habits</h2>
        <button className="btn-primary flex items-center text-sm">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {upcomingHabits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {habit.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>{habit.time}</span>
                  <span>•</span>
                  <span>in {habit.timeUntil}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">{habit.category}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(habit.difficulty)}`}>
                    {habit.difficulty}
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    +{habit.honorPoints} HP
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button
                  className={`p-1 rounded ${
                    habit.reminderSet 
                      ? 'text-primary-600 bg-primary-100' 
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  <BellIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Ready to build a new habit?
          </p>
          <button className="btn-outline text-sm w-full">
            Browse Habit Templates
          </button>
        </div>
      </div>
    </div>
  )
}
