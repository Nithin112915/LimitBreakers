'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  BellIcon,
  CheckIcon,
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Notification {
  _id: string
  type: 'habit_reminder' | 'achievement' | 'social' | 'system'
  title: string
  message: string
  read: boolean
  readAt?: string
  createdAt: string
  data?: {
    habitId?: string
    postId?: string
    userId?: string
    url?: string
  }
}

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true, readAt: new Date().toISOString() }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return TrophyIcon
      case 'habit_reminder': return ClockIcon
      case 'social': return UsersIcon
      case 'system': return ExclamationTriangleIcon
      default: return BellIcon
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-600 bg-yellow-100'
      case 'habit_reminder': return 'text-blue-600 bg-blue-100'
      case 'social': return 'text-green-600 bg-green-100'
      case 'system': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BellIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sign in to view notifications
          </h2>
          <p className="text-gray-600">
            You need to be logged in to see your notifications.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button 
              onClick={fetchNotifications}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your progress and community activity
          </p>
        </motion.div>

        {/* Notifications */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              We'll notify you about important updates and achievements.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type)
              
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`card transition-all duration-200 ${
                    !notification.read 
                      ? 'border-l-4 border-l-primary-500 bg-primary-50' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-700 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
