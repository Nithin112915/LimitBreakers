'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  UserPlusIcon,
  UserMinusIcon,
  CogIcon,
  UsersIcon,
  PhotoIcon,
  TrophyIcon,
  CalendarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface UserProfile {
  _id: string
  username: string
  name: string
  avatar?: string
  profile: {
    bio?: string
    skills: string[]
    achievements: string[]
  }
  stats: {
    postsCount: number
    followersCount: number
    followingCount: number
  }
  honorPoints: number
  level: number
  joinedAt: string
  isFollowing: boolean
  isOwnProfile: boolean
  posts: any[]
  followers: any[]
  following: any[]
}

interface Post {
  _id: string
  content: string
  images?: string[]
  type: string
  author: {
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

export default function ProfilePage() {
  const { data: session } = useSession()
  const params = useParams()
  const username = params.username as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user/${username}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/user/${username}/follow`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setFollowing(data.action === 'followed')
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followersCount: data.followersCount
            }
          })
        }
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Update the post in the UI
        fetchProfile()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Lv.{profile.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <p className="text-purple-200">@{profile.username}</p>
                </div>
                
                {profile.isOwnProfile ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                    <CogIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                      following
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {following ? (
                      <>
                        <UserMinusIcon className="w-4 h-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{profile.stats.postsCount}</div>
                  <div className="text-purple-200 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{profile.stats.followersCount}</div>
                  <div className="text-purple-200 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{profile.stats.followingCount}</div>
                  <div className="text-purple-200 text-sm">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{profile.honorPoints.toLocaleString()}</div>
                  <div className="text-purple-200 text-sm">Honor Points</div>
                </div>
              </div>

              {/* Bio */}
              {profile.profile.bio && (
                <p className="text-white/80 mb-4">{profile.profile.bio}</p>
              )}

              {/* Skills */}
              {profile.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl mb-6">
          <div className="flex">
            {['posts', 'followers', 'following'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-blue-400'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'posts' && (
            <div className="grid gap-4">
              {profile.posts.map((post: Post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{post.author.name}</div>
                      <div className="text-sm text-purple-200">@{post.author.username}</div>
                    </div>
                    <div className="ml-auto text-sm text-purple-300">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-white mb-4">{post.content}</p>

                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {post.images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Post image ${index + 1}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-purple-200">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="flex items-center gap-2 hover:text-red-400 transition-colors"
                    >
                      <HeartIcon className="w-5 h-5" />
                      <span>{post.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="grid gap-4">
              {profile.followers.map((follower: any) => (
                <motion.div
                  key={follower._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {follower.avatar ? (
                      <Image
                        src={follower.avatar}
                        alt={follower.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                        {follower.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{follower.name}</div>
                    <div className="text-sm text-purple-200">@{follower.username}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="grid gap-4">
              {profile.following.map((followingUser: any) => (
                <motion.div
                  key={followingUser._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {followingUser.avatar ? (
                      <Image
                        src={followingUser.avatar}
                        alt={followingUser.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                        {followingUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{followingUser.name}</div>
                    <div className="text-sm text-purple-200">@{followingUser.username}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
