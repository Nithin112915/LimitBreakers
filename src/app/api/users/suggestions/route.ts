import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import connectDB from '../../../../lib/mongodb'
import { User } from '../../../../models/User'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
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
    const following = currentUser?.following || []

    // Find users not being followed (excluding current user)
    const suggestions = await User.find({
      _id: { 
        $nin: [...following, currentUserId] 
      }
    })
    .select('name username avatar verified honorPoints level stats profile')
    .sort({ 'stats.followersCount': -1, honorPoints: -1 }) // Sort by popularity
    .limit(10)

    return NextResponse.json({ users: suggestions })
  } catch (error) {
    console.error('Error fetching user suggestions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
