'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  TrophyIcon,
  CameraIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const activities = [
  {
    id: 1,
    type: 'habit_completion',
    user: 'You',
    action: 'completed',
    target: 'Morning Meditation',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    points: 10,
    proof: 'photo'
  },
  {
    id: 2,
    type: 'achievement',
    user: 'You',
    action: 'earned',
    target: '7-Day Streak Badge',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    points: 50
  },
  {
    id: 3,
    type: 'social',
    user: 'Sarah Chen',
    action: 'liked your',
    target: 'exercise completion',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: 4,
    type: 'habit_completion',
    user: 'Marcus Johnson',
    action: 'completed',
    target: 'Read for 30 minutes',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    points: 15,
    proof: 'photo'
  },
  {
    id: 5,
    type: 'social',
    user: 'Elena Rodriguez',
    action: 'commented on your',
    target: 'meditation streak',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  }
]

export function RecentActivity() {
  const getActivityIcon = (type: string, proof?: string) => {
    switch (type) {
      case 'habit_completion':
        return proof === 'photo' ? CameraIcon : TrophyIcon
      case 'achievement':
        return TrophyIcon
      case 'social':
        return HeartIcon
      default:
        return UserIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'habit_completion':
        return 'text-green-600 bg-green-100'
      case 'achievement':
        return 'text-yellow-600 bg-yellow-100'
      case 'social':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View All
        </button>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type, activity.proof)
            const isLast = index === activities.length - 1
            
            return (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative pb-8">
                  {!isLast && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {activity.user}
                          </span>{' '}
                          <span className="text-gray-500">
                            {activity.action}
                          </span>{' '}
                          <span className="font-medium text-gray-900">
                            {activity.target}
                          </span>
                          {activity.points && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              +{activity.points} HP
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full btn-outline text-center">
          Load More Activity
        </button>
      </div>
    </div>
  )
}
