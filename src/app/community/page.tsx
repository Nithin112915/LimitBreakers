'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  PlusIcon,
  TrophyIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import CreatePostModal from '../../components/Community/CreatePostModal'

interface Post {
  _id: string
  author: {
    _id: string
    name: string
    username?: string
    avatar?: string
    honorPoints: number
    level: number
  }
  content: string
  type: string
  tags: string[]
  likes: string[]
  comments: Array<{
    user: {
      _id: string
      name: string
      username?: string
      avatar?: string
    }
    content: string
    createdAt: string
  }>
  images?: string[]
  metadata?: {
    habitId?: string
    achievementType?: string
  }
  visibility: string
  createdAt: string
  updatedAt: string
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filters = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'achievement', name: 'Achievements', count: posts.filter(p => p.type === 'achievement').length },
    { id: 'habit_progress', name: 'Progress', count: posts.filter(p => p.type === 'habit_progress').length },
    { id: 'text', name: 'General', count: posts.filter(p => p.type === 'text').length }
  ]

  // Fetch current user data
  useEffect(() => {
    if (session?.user?.email) {
      fetchCurrentUser()
    }
  }, [session])

  // Fetch posts
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData.user)
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (postData: {
    content: string
    type: string
    tags: string[]
    visibility: string
  }) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const data = await response.json()
      if (data.success) {
        // Add the new post to the beginning of the posts array
        setPosts(prev => [data.post, ...prev])
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post')
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to like post')
      }

      const data = await response.json()
      if (data.success) {
        // Update the post in the state
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: data.liked 
                  ? [...post.likes, currentUser?._id].filter(Boolean)
                  : post.likes.filter(id => id !== currentUser?._id)
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return TrophyIcon
      case 'habit_progress': return CameraIcon
      case 'text': return ChatBubbleLeftIcon
      default: return UsersIcon
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-600 bg-yellow-100'
      case 'habit_progress': return 'text-blue-600 bg-blue-100'
      case 'text': return 'text-purple-600 bg-purple-100'
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

  const filteredPosts = selectedFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === selectedFilter)

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen premium-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-morphism p-8 rounded-xl card-3d">
            <div className="h-8 bg-white/20 rounded w-1/4 mb-4 pulse-animation"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mb-8 pulse-animation"></div>
            
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-morphism rounded-lg p-6 card-3d">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2 pulse-animation"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2 mb-4 pulse-animation"></div>
                  <div className="h-20 bg-white/20 rounded pulse-animation"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen premium-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center glass-morphism p-8 rounded-xl card-3d">
            <h1 className="text-2xl font-bold premium-text mb-4 neon-glow">Community</h1>
            <div className="glass-morphism border-l-4 border-red-400 p-4 rounded mb-4">
              <p className="premium-text">{error}</p>
            </div>
            <button 
              onClick={fetchPosts}
              className="button-3d px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all ripple-effect neon-glow"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen premium-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 glass-morphism p-6 rounded-xl card-3d"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold premium-text neon-glow">Community</h1>
              <p className="premium-text-muted mt-1">
                Connect, share, and get inspired by fellow achievers
              </p>
            </div>
            {session && (
              <button 
                onClick={() => setShowCreatePost(true)}
                className="button-3d px-4 py-2 rounded-lg flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all ripple-effect neon-glow"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Share Progress
              </button>
            )}
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
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">
              {session 
                ? "Be the first to share your progress with the community!"
                : "Sign in to see posts from the community!"
              }
            </p>
            {session && (
              <button 
                onClick={() => setShowCreatePost(true)}
                className="btn-primary"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => {
              const PostTypeIcon = getPostTypeIcon(post.type)
              const isLiked = currentUser && post.likes.includes(currentUser._id)
              
              return (
                <motion.div
                  key={post._id}
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
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                          <span className="flex items-center text-xs text-gray-500">
                            <TrophyIcon className="h-3 w-3 mr-1" />
                            {post.author.honorPoints} HP
                          </span>
                          <span className="text-xs text-gray-500">Level {post.author.level}</span>
                        </div>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                      <PostTypeIcon className="h-3 w-3 mr-1" />
                      {post.type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4">
                      {post.images.map((image, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt="Post attachment" 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
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
                        onClick={() => handleLike(post._id)}
                        disabled={!session}
                        className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLiked ? (
                          <HeartSolid className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                        <span className="text-sm">{post.likes.length}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm">{post.comments.length}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <ShareIcon className="h-5 w-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
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
        )}
      </div>

      {/* Create Post Modal */}
      {session && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  )
}
