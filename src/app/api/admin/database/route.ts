import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import { User } from '../../../../models/User'
import { Task } from '../../../../models/Task'

export async function GET() {
  try {
    await dbConnect()
    
    // Get basic stats
    const totalUsers = await User.countDocuments()
    const totalTasks = await Task.countDocuments()
    
    const recentUsers = await User.find()
      .select('name email username userId honorPoints level verified createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const recentTasks = await Task.find()
      .select('title description category difficulty userId createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({
      status: 'success',
      stats: {
        totalUsers,
        totalTasks,
        recentUsers: recentUsers.length,
        recentTasks: recentTasks.length
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
      })),
      recentTasks: recentTasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        category: task.category,
        difficulty: task.difficulty,
        userId: task.userId,
        createdAt: task.createdAt
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
