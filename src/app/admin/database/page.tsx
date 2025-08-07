'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  CircleStackIcon,
  CheckBadgeIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'

interface User {
  id: string
  name: string
  email: string
  username: string
  userId: string
  honorPoints: number
  level: number
  verified: boolean
  joinedAt: string
}

interface DatabaseStats {
  totalUsers: number
  recentUsers: number
}

export default function DatabaseAdminPage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDatabaseInfo()
  }, [])

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/database')
      const data = await response.json()
      
      if (data.status === 'success') {
        setStats(data.stats)
        setUsers(data.recentUsers)
      } else {
        setError(data.message || 'Failed to fetch database info')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Database fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 animate-pulse">Loading database information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <CircleStackIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">Database Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchDatabaseInfo}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <CircleStackIcon className="h-10 w-10 text-indigo-600" />
            Database Admin Panel
          </h1>
          <p className="text-xl text-gray-600">MongoDB Atlas - LimitBreakers Database</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-12 w-12 text-indigo-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-12 w-12 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.recentUsers || 0}</h3>
                <p className="text-gray-600">Recent Users</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Recent Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-4">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                            {user.verified && (
                              <CheckBadgeIcon className="h-4 w-4 text-blue-500 ml-1" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-400 font-mono">ID: {user.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          {user.honorPoints} HP
                        </div>
                        <div className="text-xs text-gray-500">Level {user.level}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Database Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Database Connection Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Database:</span>
              <span className="ml-2 text-gray-600">limitbreakers</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Provider:</span>
              <span className="ml-2 text-gray-600">MongoDB Atlas</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cluster:</span>
              <span className="ml-2 text-gray-600">Cluster0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2 text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
