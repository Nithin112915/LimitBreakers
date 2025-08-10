import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { User } from '../../../../models/User'
import connectDB from '../../../../lib/mongodb'
import { authOptions } from '../../../../lib/auth'


export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    let query: any = {}
    let sort: any = { joinedAt: -1 } // Default: newest users

    // Build search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ]
    }

    // Apply filters
    switch (filter) {
      case 'verified':
        query.verified = true
        break
      case 'top':
        sort = { honorPoints: -1 } // Sort by honor points
        break
      case 'new':
        sort = { joinedAt: -1 } // Newest first
        break
      default:
        // 'all' - no additional filters
        break
    }

    // Exclude current user if logged in
    if (session?.user && (session.user as any).id) {
      query._id = { $ne: (session.user as any).id }
    }

    const users = await User.find(query)
      .select('name username userId avatar verified honorPoints level stats profile joinedAt followers')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    // Check if current user is following each user
    const currentUserId = session?.user ? (session.user as any).id : null
    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: currentUserId ? user.followers?.includes(currentUserId) : false,
      followers: undefined // Remove followers array from response for privacy
    }))

    // Get suggested users if no search term
    let suggestedUsers: any[] = []
    if (!search && filter === 'all') {
      // Get users with most followers or highest honor points
      suggestedUsers = await User.find({
        _id: { $ne: session?.user ? (session.user as any).id : null },
        $or: [
          { 'stats.followersCount': { $gte: 5 } },
          { honorPoints: { $gte: 500 } },
          { verified: true }
        ]
      })
      .select('name username userId avatar verified honorPoints level stats profile')
      .sort({ 'stats.followersCount': -1, honorPoints: -1 })
      .limit(5)
      .lean()

      suggestedUsers = suggestedUsers.map(user => ({
        ...user,
        isFollowing: currentUserId ? user.followers?.includes(currentUserId) : false,
        followers: undefined
      }))
    }

    return NextResponse.json({ 
      users: usersWithFollowStatus,
      suggested: suggestedUsers,
      hasMore: users.length === limit 
    })
  } catch (error) {
    console.error('User discovery error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
