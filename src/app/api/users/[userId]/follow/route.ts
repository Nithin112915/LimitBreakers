import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { User } from '../../../../../models/User'
import connectDB from '../../../../../lib/mongodb'
import { authOptions } from '../../../../../lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const targetUserId = params.userId
    const currentUserId = (session.user as any).id

    if (targetUserId === currentUserId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentUser = await User.findById(currentUserId)
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 })
    }

    const isFollowing = currentUser.following?.includes(targetUserId)

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
        $inc: { 'stats.followingCount': -1 }
      })
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
        $inc: { 'stats.followersCount': -1 }
      })
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUserId },
        $inc: { 'stats.followingCount': 1 }
      })
      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: currentUserId },
        $inc: { 'stats.followersCount': 1 }
      })
    }

    return NextResponse.json({ 
      success: true,
      isFollowing: !isFollowing,
      action: isFollowing ? 'unfollowed' : 'followed'
    })
  } catch (error) {
    console.error('Follow/unfollow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
