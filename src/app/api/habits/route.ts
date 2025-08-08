import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import dbConnect from '../../../lib/mongodb'
import { Habit } from '../../../models/Habit'
import { User } from '../../../models/User'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const habits = await Habit.find({ 
      userId: user._id, 
      isActive: { $ne: false }
    }).sort({ createdAt: -1 })

    return NextResponse.json(habits)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { 
      title, 
      description, 
      category, 
      honorPointsReward,
      frequency,
      reminders,
      proofRequirements,
      tags 
    } = await request.json()

    if (!title || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Use provided honor points or default to 15
    const finalHonorPoints = honorPointsReward || 15
    const honorPointsPenalty = Math.floor(finalHonorPoints * 0.5)

    const habit = await Habit.create({
      userId: user._id,
      title,
      description,
      category,
      honorPointsReward: finalHonorPoints,
      honorPointsPenalty,
      frequency: frequency || { type: 'daily' },
      reminders: reminders || [],
      proofRequirements: proofRequirements || [],
      tags: tags || [],
      analytics: {
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        successRate: 0,
        lastUpdated: new Date()
      }
    })

    return NextResponse.json({ habit }, { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
