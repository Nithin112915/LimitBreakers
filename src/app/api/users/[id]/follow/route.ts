import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import connectDB from '../../../../../lib/mongodb'
import { User } from '../../../../../models/User'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find current user by email
    const currentUser = await User.findOne({ email: session.user.email })
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const currentUserId = currentUser._id

    const targetUserId = params.id

    if (targetUserId === currentUserId.toString()) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isFollowing = currentUser?.following?.includes(targetUserId)

    if (isFollowing) {
      // Unfollow
      await Promise.all([
        User.findByIdAndUpdate(currentUserId, {
          $pull: { following: targetUserId },
          $inc: { 'stats.followingCount': -1 }
        }),
        User.findByIdAndUpdate(targetUserId, {
          $pull: { followers: currentUserId },
          $inc: { 'stats.followersCount': -1 }
        })
      ])
    } else {
      // Follow
      await Promise.all([
        User.findByIdAndUpdate(currentUserId, {
          $addToSet: { following: targetUserId },
          $inc: { 'stats.followingCount': 1 }
        }),
        User.findByIdAndUpdate(targetUserId, {
          $addToSet: { followers: currentUserId },
          $inc: { 'stats.followersCount': 1 }
        })
      ])
    }

    return NextResponse.json({ 
      success: true, 
      following: !isFollowing 
    })
  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
