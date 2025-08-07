import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import { User } from '../../../../models/User'

export async function GET() {
  try {
    await connectDB()
    
    // Get basic stats
    const totalUsers = await User.countDocuments()
    const recentUsers = await User.find()
      .select('name email username userId honorPoints level verified createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({
      status: 'success',
      stats: {
        totalUsers,
        recentUsers: recentUsers.length
      },
      recentUsers: recentUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        userId: user.userId,
        honorPoints: user.honorPoints,
        level: user.level,
        verified: user.verified,
        joinedAt: user.createdAt
      }))
    })
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch database info',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
