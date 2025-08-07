'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  CheckBadgeIcon,
  TrophyIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface User {
  _id: string
  name: string
  username: string
  userId: string
  avatar?: string
  verified: boolean
  honorPoints: number
  level: number
  stats: {
    followersCount: number
    followingCount: number
  }
  profile: {
    bio?: string
  }
  isFollowing: boolean
}

export default function DiscoverPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Users', icon: UsersIcon },
    { id: 'verified', label: 'Verified', icon: CheckBadgeIcon },
    { id: 'top', label: 'Top Users', icon: TrophyIcon },
    { id: 'new', label: 'New Users', icon: UserIcon }
  ]

  useEffect(() => {
    fetchUsers()
  }, [activeFilter, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        filter: activeFilter,
        search: searchTerm,
        limit: '20'
      })

      const response = await fetch(`/api/users/discover?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setSuggestedUsers(data.suggested || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update the users state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: result.isFollowing }
              : user
          )
        )

        // Update suggested users state
        setSuggestedUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: result.isFollowing }
              : user
          )
        )
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Users</h1>
          <p className="text-xl text-gray-600">Find and connect with other habit builders</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, username, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        {suggestedUsers.length > 0 && !searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggested for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedUsers.map((user) => (
                <UserCard key={user._id} user={user} onFollow={handleFollow} />
              ))}
            </div>
          </div>
        )}

        {/* Users Grid */}
        <div className="mb-8">
          {searchTerm && (
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Results {users.length > 0 && `(${users.length})`}
            </h2>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard key={user._id} user={user} onFollow={handleFollow} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'No users match the current filter'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UserCard({ user, onFollow }: { user: User; onFollow: (userId: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={60}
              height={60}
              className="rounded-full"
            />
          ) : (
            <div className="w-15 h-15 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-600" />
            </div>
          )}
          {user.verified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <CheckBadgeIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            {user.verified && <CheckBadgeIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />}
          </div>
          <p className="text-gray-600 text-sm">@{user.username}</p>
          <p className="text-gray-500 text-xs font-mono">ID: {user.userId}</p>
        </div>
      </div>

      {user.profile?.bio && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{user.profile.bio}</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>{user.stats?.followersCount || 0} followers</span>
          <span>{user.honorPoints || 0} HP</span>
          <span>Level {user.level || 1}</span>
        </div>
      </div>

      <button
        onClick={() => onFollow(user._id)}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          user.isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
      >
        {user.isFollowing ? 'Following' : 'Follow'}
      </button>
    </motion.div>
  )
}
