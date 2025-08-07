'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  TrophyIcon,
  CameraIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

const posts = [
  {
    id: 1,
    user: {
      name: 'Sarah Chen',
      avatar: null,
      honorPoints: 2840,
      level: 5
    },
    content: 'Just completed my 30-day meditation streak! 🧘‍♀️ The AI coach suggestions really helped me find the perfect morning routine.',
    type: 'achievement',
    timestamp: '2 hours ago',
    attachments: [
      {
        type: 'image',
        url: '/api/placeholder/400/300',
        caption: 'My meditation space'
      }
    ],
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    honorPointsAwarded: 50,
    relatedHabit: 'Morning Meditation'
  },
  {
    id: 2,
    user: {
      name: 'Marcus Johnson',
      avatar: null,
      honorPoints: 1850,
      level: 3
    },
    content: 'Anyone else struggling with consistency in their workout routine? Looking for accountability partners! 💪',
    type: 'question',
    timestamp: '4 hours ago',
    attachments: [],
    likes: 12,
    comments: 15,
    shares: 2,
    isLiked: true,
    tags: ['fitness', 'accountability', 'workout']
  },
  {
    id: 3,
    user: {
      name: 'Elena Rodriguez',
      avatar: null,
      honorPoints: 3200,
      level: 7
    },
    content: 'Reading challenge update: finished "Atomic Habits" today! Such an inspiring book for anyone on a growth journey. Highly recommend! 📚',
    type: 'progress',
    timestamp: '6 hours ago',
    attachments: [
      {
        type: 'image',
        url: '/api/placeholder/400/300',
        caption: 'Book completion proof'
      }
    ],
    likes: 31,
    comments: 12,
    shares: 8,
    isLiked: true,
    honorPointsAwarded: 15,
    relatedHabit: 'Read for 30 minutes'
  }
]

export default function CommunityPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showCreatePost, setShowCreatePost] = useState(false)

  const filters = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'achievements', name: 'Achievements', count: 42 },
    { id: 'progress', name: 'Progress', count: 78 },
    { id: 'questions', name: 'Questions', count: 23 },
    { id: 'motivation', name: 'Motivation', count: 13 }
  ]

  const handleLike = (postId: number) => {
    // Handle like functionality
    console.log('Liked post:', postId)
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return TrophyIcon
      case 'progress': return CameraIcon
      case 'question': return ChatBubbleLeftIcon
      default: return UsersIcon
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-600 bg-yellow-100'
      case 'progress': return 'text-blue-600 bg-blue-100'
      case 'question': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600 mt-1">
                Connect, share, and get inspired by fellow achievers
              </p>
            </div>
            <button 
              onClick={() => setShowCreatePost(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Share Progress
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {filter.name}
                <span className={`ml-2 text-xs ${
                  selectedFilter === filter.id ? 'text-primary-200' : 'text-gray-400'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => {
            const PostTypeIcon = getPostTypeIcon(post.type)
            
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {post.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                        <span className="flex items-center text-xs text-gray-500">
                          <TrophyIcon className="h-3 w-3 mr-1" />
                          {post.user.honorPoints} HP
                        </span>
                        <span className="text-xs text-gray-500">Level {post.user.level}</span>
                      </div>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                    <PostTypeIcon className="h-3 w-3 mr-1" />
                    {post.type}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                  
                  {post.honorPointsAwarded && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <TrophyIcon className="h-4 w-4 mr-1" />
                      +{post.honorPointsAwarded} Honor Points
                    </div>
                  )}

                  {post.relatedHabit && (
                    <div className="mt-2 text-sm text-gray-600">
                      Related to: <span className="font-medium">{post.relatedHabit}</span>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {post.attachments.length > 0 && (
                  <div className="mb-4">
                    {post.attachments.map((attachment, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden">
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <CameraIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        {attachment.caption && (
                          <p className="text-sm text-gray-600 mt-2">{attachment.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {post.tags && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      {post.isLiked ? (
                        <HeartSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                      <ShareIcon className="h-5 w-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button className="btn-outline">
            Load More Posts
          </button>
        </motion.div>
      </div>
    </div>
  )
}
