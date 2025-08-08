'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  UserIcon,
  CogIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  BellIcon,
  ShieldCheckIcon,
  CalendarIcon,
  StarIcon,
  PencilIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Loading from '../../components/UI/Loading'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

interface UserStats {
  totalHonorPoints: number
  totalHabits: number
  activeStreaks: number
  longestStreak: number
  totalCompletions: number
  joinDate: string
  achievements: Array<{
    id: string
    name: string
    description: string
    unlockedAt: string
    icon: string
  }>
}

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
    achievements: boolean
  }
  privacy: {
    profileVisible: boolean
    statsVisible: boolean
    habitsVisible: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    timezone: string
    language: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      fetchProfileData()
      setEditForm({
        name: session.user?.name || '',
        email: session.user?.email || '',
        bio: '' // We'll add bio to user model later
      })
    } else {
      setLoading(false)
    }
  }, [session, status])

  const fetchProfileData = async () => {
    try {
      // Fetch user stats and settings
      const [habitsResponse] = await Promise.all([
        fetch('/api/habits')
      ])

      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json()
        const habitsArray = Array.isArray(habitsData) ? habitsData : []
        
        // Calculate user stats
        const totalCompletions = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0), 0
        )
        const totalHonorPoints = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0) * h.honorPointsReward, 0
        )
        const longestStreak = Math.max(...habitsArray.map(h => h.analytics?.longestStreak || 0), 0)
        const activeStreaks = habitsArray.filter(h => 
          h.analytics?.currentStreak && h.analytics.currentStreak > 0
        ).length

        setStats({
          totalHonorPoints,
          totalHabits: habitsArray.length,
          activeStreaks,
          longestStreak,
          totalCompletions,
          joinDate: new Date().toISOString(), // In real app, this would come from user model
          achievements: [
            {
              id: '1',
              name: 'First Step',
              description: 'Created your first habit',
              unlockedAt: new Date().toISOString(),
              icon: '🎯'
            },
            {
              id: '2',
              name: 'Consistent',
              description: 'Maintained a 7-day streak',
              unlockedAt: new Date().toISOString(),
              icon: '🔥'
            }
          ] // Mock achievements
        })

        // Mock settings - in real app, these would come from user preferences
        setSettings({
          notifications: {
            email: true,
            push: true,
            reminders: true,
            achievements: true
          },
          privacy: {
            profileVisible: true,
            statsVisible: true,
            habitsVisible: false
          },
          preferences: {
            theme: 'light',
            timezone: 'UTC',
            language: 'en'
          }
        })
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      // In a real app, this would update the user profile
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
      toast.success('Settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  if (loading) {
    return <Loading message="Loading your profile..." />
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-white" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors">
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {session.user?.name || 'Champion'}
                  </h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{session.user?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {stats ? formatDate(stats.joinDate) : 'Recently'}
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats?.totalHonorPoints || 0}</div>
                <div className="text-sm text-gray-600">Honor Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats?.totalHabits || 0}</div>
                <div className="text-sm text-gray-600">Total Habits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats?.longestStreak || 0}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-6 bg-gray-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 mb-8">
          <nav className="flex space-x-1 p-2">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'achievements', name: 'Achievements', icon: TrophyIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon },
              { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Stats Cards */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Completions</p>
                    <p className="text-3xl font-bold">{stats?.totalCompletions || 0}</p>
                  </div>
                  <CheckCircleIcon className="h-12 w-12 text-blue-100" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Streaks</p>
                    <p className="text-3xl font-bold">{stats?.activeStreaks || 0}</p>
                  </div>
                  <FireIcon className="h-12 w-12 text-green-100" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Achievements</p>
                    <p className="text-3xl font-bold">{stats?.achievements.length || 0}</p>
                  </div>
                  <StarIcon className="h-12 w-12 text-purple-100" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-white/70 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Unlocked {formatDate(achievement.unlockedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
              <div className="space-y-4">
                {settings && Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{key} Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive {key} notifications for habit updates
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateSettings({
                        notifications: { ...settings.notifications, [key]: !value }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              <div className="space-y-4">
                {settings && Object.entries(settings.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Make your {key.replace('Visible', '').toLowerCase()} visible to others
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateSettings({
                        privacy: { ...settings.privacy, [key]: !value }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
