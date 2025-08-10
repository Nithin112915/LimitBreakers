'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'achievement' | 'reminder' | 'level_up' | 'habit_reminder'
  title: string
  message: string
  timestamp: Date
  read: boolean
  icon?: string
}

const Header = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userHonorPoints, setUserHonorPoints] = useState(0)
  const [userLevel, setUserLevel] = useState(1)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Habits', href: '/habits', icon: CalendarIcon },
    { name: 'Honor Score', href: '/honor-score', icon: TrophyIcon },
    { name: 'Progress', href: '/analytics', icon: ChartBarIcon },
    { name: 'AI Coach', href: '/coach', icon: SparklesIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
  ]

  // Fetch user honor points and level
  useEffect(() => {
    const fetchUserStats = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/stats')
          if (response.ok) {
            const stats = await response.json()
            setUserHonorPoints(stats.honorPoints || 0)
            setUserLevel(stats.level || 1)
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
        }
      }
    }

    fetchUserStats()
  }, [session])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    if (session?.user?.email) {
      fetchNotifications()
    }
  }, [session])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return '🏆'
      case 'level_up':
        return '⬆️'
      case 'habit_reminder':
        return '⏰'
      case 'reminder':
        return '🔔'
      default:
        return '📢'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (status === 'loading') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-slate-100">Limit Breakers</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-slate-300 hover:text-slate-100 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="premium-gradient border-b border-white/10 sticky top-0 z-50 glass-morphism">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="card-3d h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold premium-text neon-glow">Limit Breakers</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="button-3d ripple-effect flex items-center space-x-1 px-3 py-2 text-sm font-medium premium-text hover:gold-accent rounded-lg transition-all duration-300"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Honor Points */}
            <div className="hidden sm:flex items-center space-x-2 glass-morphism rounded-lg px-3 py-1 border border-yellow-400/30 floating-animation">
              <TrophyIcon className="h-4 w-4 text-yellow-400 pulse-animation" />
              <span className="text-sm font-bold gold-accent">
                {userHonorPoints.toLocaleString()} HP
              </span>
              <span className="text-xs premium-text-muted">Level {userLevel}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-80 glass-morphism rounded-lg border border-white/20 z-50 card-3d"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold premium-text neon-glow">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm gold-accent hover:text-yellow-300 font-medium button-3d px-2 py-1 rounded transition-all"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center premium-text-muted">
                          <BellIcon className="h-8 w-8 mx-auto premium-text-muted mb-2 floating-animation" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer card-3d transition-all ${
                              !notification.read ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : ''
                            }`}
                            onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-lg flex-shrink-0 mt-0.5 gold-accent floating-animation">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${
                                    !notification.read ? 'premium-text neon-glow' : 'premium-text-muted'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 bg-gold-accent rounded-full pulse-animation neon-glow"></div>
                                  )}
                                </div>
                                <p className="text-sm premium-text-muted mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs premium-text-muted mt-1">
                                  {formatTimeAgo(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-white/10">
                        <Link
                          href="/notifications"
                          className="block text-center text-sm gold-accent hover:text-yellow-300 font-medium button-3d px-4 py-2 rounded transition-all neon-glow"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {session?.user?.name || 'User'}
                </span>
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-48 glass-morphism rounded-lg border border-white/20 z-50 card-3d"
                  >
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm premium-text hover:bg-white/10 transition-all button-3d ripple-effect"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 gold-accent" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm premium-text hover:bg-white/10 transition-all button-3d ripple-effect"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="h-4 w-4 gold-accent" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-white/20">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm premium-text hover:bg-red-500/20 transition-all button-3d ripple-effect"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-white/20 glass-morphism"
            >
              <div className="py-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium premium-text hover:bg-white/10 rounded-lg transition-all button-3d ripple-effect"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 gold-accent" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
