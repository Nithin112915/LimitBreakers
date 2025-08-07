import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { User } from '../../../../models/User'
import connectDB from '../../../../lib/mongodb'
import { authOptions } from '../../../../lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = params
    const currentUserId = session.user.id

    // Find the user to follow/unfollow
    const targetUser = await User.findOne({ username })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Can't follow yourself
    if (targetUser._id.toString() === currentUserId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const currentUser = await User.findById(currentUserId)
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isFollowing = currentUser.following.includes(targetUser._id)

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUser._id },
        $inc: { 'stats.followingCount': -1 }
      })
      await User.findByIdAndUpdate(targetUser._id, {
        $pull: { followers: currentUserId },
        $inc: { 'stats.followersCount': -1 }
      })
      
      return NextResponse.json({ 
        success: true, 
        action: 'unfollowed',
        followersCount: targetUser.stats.followersCount - 1
      })
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUser._id },
        $inc: { 'stats.followingCount': 1 }
      })
      await User.findByIdAndUpdate(targetUser._id, {
        $addToSet: { followers: currentUserId },
        $inc: { 'stats.followersCount': 1 }
      })
      
      return NextResponse.json({ 
        success: true, 
        action: 'followed',
        followersCount: targetUser.stats.followersCount + 1
      })
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
