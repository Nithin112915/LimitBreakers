import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '../../../../../lib/mongodb'
import { Habit } from '../../../../../models/Habit'
import { User } from '../../../../../models/User'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { proofUrl, proofType, notes } = await request.json()

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Find the habit
    const habit = await Habit.findById(params.id)
    
    if (!habit) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 })
    }

    if (habit.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Update habit analytics
    habit.analytics.totalCompletions += 1
    habit.analytics.currentStreak += 1
    if (habit.analytics.currentStreak > habit.analytics.longestStreak) {
      habit.analytics.longestStreak = habit.analytics.currentStreak
    }
    habit.analytics.lastUpdated = new Date()

    await habit.save()

    // Update user honor points
    user.honorPoints += habit.honorPointsReward
    await user.save()

    // Create completion record
    const completion = {
      habitId: habit._id,
      userId: user._id,
      date: new Date(),
      proofUrl,
      proofType,
      notes,
      honorPointsAwarded: habit.honorPointsReward,
      verificationStatus: 'approved' // Auto-approve for now
    }

    return NextResponse.json({ 
      message: 'Habit completed successfully',
      completion,
      honorPointsAwarded: habit.honorPointsReward,
      newStreak: habit.analytics.currentStreak
    }, { status: 201 })
  } catch (error) {
    console.error('Error completing habit:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
