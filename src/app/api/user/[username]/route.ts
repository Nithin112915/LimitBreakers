import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { User } from '../../../../models/User'
import { Post } from '../../../../models/Post'
import connectDB from '../../../../lib/mongodb'
import { authOptions } from '../../../../lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const { username } = params

    // Find user by username
    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if current user is following this profile
    const isFollowing = session?.user?.id 
      ? user.followers.some((follower: any) => follower._id.toString() === session.user.id)
      : false

    // Get user's posts
    const posts = await Post.find({ 
      author: user._id,
      visibility: { $in: ['public', 'followers'] }
    })
    .populate('author', 'username name avatar')
    .populate('likes', 'username name avatar')
    .populate('comments.user', 'username name avatar')
    .sort({ createdAt: -1 })
    .limit(20)

    // If profile is private and user is not following, limit data
    const isOwnProfile = session?.user?.id === user._id.toString()
    const canViewPrivate = isOwnProfile || isFollowing || user.settings.privacy.profileVisibility === 'public'

    const profileData = {
      _id: user._id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      profile: user.profile,
      stats: user.stats,
      honorPoints: user.honorPoints,
      level: user.level,
      joinedAt: user.joinedAt,
      isFollowing,
      isOwnProfile,
      posts: canViewPrivate ? posts : [],
      followers: canViewPrivate ? user.followers : [],
      following: canViewPrivate ? user.following : []
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
