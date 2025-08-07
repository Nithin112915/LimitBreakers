'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import CreatePost from '../../components/CreatePost'
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  TrophyIcon,
  CalendarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Post {
  _id: string
  content: string
  images?: string[]
  type: string
  author: {
    _id: string
    username: string
    name: string
    avatar?: string
    honorPoints: number
    level: number
  }
  likes: any[]
  comments: any[]
  createdAt: string
}

export default function SocialFeed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (pageNum = 1) => {
    try {
      const response = await fetch(`/api/posts?page=${pageNum}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        if (pageNum === 1) {
          setPosts(data.posts)
        } else {
          setPosts(prev => [...prev, ...data.posts])
        }
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: data.liked 
                ? [...post.likes, { _id: session.user.id }]
                : post.likes.filter(like => like._id !== session.user.id)
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Social Feed</h1>
          <p className="text-purple-200">Connect with your community and share your journey</p>
        </motion.div>

        {/* Create Post */}
        {session && (
          <CreatePost onPostCreated={() => fetchPosts(1)} />
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/profile/${post.author.username}`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all cursor-pointer">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                        {post.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="flex-1">
                  <Link href={`/profile/${post.author.username}`}>
                    <div className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                      <span className="font-semibold text-white">{post.author.name}</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <TrophyIcon className="w-4 h-4" />
                        <span className="text-xs">Lv.{post.author.level}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span>@{post.author.username}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                {/* Post Type Badge */}
                {post.type !== 'text' && (
                  <div className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs font-medium">
                    {post.type.replace('_', ' ').toUpperCase()}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-white whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 mb-4 ${
                  post.images.length === 1 ? 'grid-cols-1' :
                  post.images.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {post.images.map((image, imgIndex) => (
                    <div 
                      key={imgIndex} 
                      className={`aspect-square rounded-lg overflow-hidden ${
                        post.images!.length === 1 ? 'max-w-md mx-auto' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Post image ${imgIndex + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.likes.some(like => like._id === session?.user?.id)
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-purple-300 hover:text-red-400'
                    }`}
                  >
                    {post.likes.some(like => like._id === session?.user?.id) ? (
                      <HeartSolidIcon className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{post.likes.length}</span>
                  </button>

                  <button className="flex items-center gap-2 text-purple-300 hover:text-blue-400 transition-colors">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments.length}</span>
                  </button>

                  <button className="flex items-center gap-2 text-purple-300 hover:text-green-400 transition-colors">
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs text-purple-400">
                  {post.author.honorPoints.toLocaleString()} Honor Points
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Posts'}
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-purple-300 mb-4">
              <UsersIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p>Be the first to share your journey!</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
