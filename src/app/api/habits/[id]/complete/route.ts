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

    // Check if already completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const alreadyCompleted = habit.completions?.some((completion: any) => {
      const completionDate = new Date(completion.date)
      return completionDate >= today && completionDate < tomorrow
    })

    if (alreadyCompleted) {
      return NextResponse.json({ 
        message: 'Habit already completed today',
        alreadyCompleted: true 
      }, { status: 400 })
    }

    // Create completion record
    const completion = {
      date: new Date(),
      proofSubmitted: proofUrl ? {
        type: proofType || 'photo',
        url: proofUrl,
        content: notes,
        verificationStatus: 'approved'
      } : undefined,
      honorPointsAwarded: habit.honorPointsReward,
      notes: notes || ''
    }

    // Calculate new streak
    const sortedCompletions = [...(habit.completions || []), completion]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let newStreak = 1
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    for (let i = 1; i < sortedCompletions.length; i++) {
      const prevDate = new Date(sortedCompletions[i].date)
      prevDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(todayDate)
      expectedDate.setDate(todayDate.getDate() - i)
      
      if (prevDate.getTime() === expectedDate.getTime()) {
        newStreak++
      } else {
        break
      }
    }

    // Calculate success rate
    const daysSinceCreation = Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
    const successRate = Math.round((sortedCompletions.length / daysSinceCreation) * 100)

    // Update habit analytics
    habit.analytics.totalCompletions = sortedCompletions.length
    habit.analytics.currentStreak = newStreak
    habit.analytics.longestStreak = Math.max(habit.analytics.longestStreak || 0, newStreak)
    habit.analytics.successRate = successRate
    habit.analytics.lastUpdated = new Date()
    
    // Add completion to habit
    habit.completions = habit.completions || []
    habit.completions.push(completion)

    await habit.save()

    // Update user honor points and streaks
    const previousHonorPoints = user.honorPoints
    const newHonorPoints = previousHonorPoints + habit.honorPointsReward
    const previousLevel = Math.floor(previousHonorPoints / 1000) + 1
    const newLevel = Math.floor(newHonorPoints / 1000) + 1
    const leveledUp = newLevel > previousLevel

    user.honorPoints = newHonorPoints
    user.level = newLevel
    user.streaks = user.streaks || { current: 0, longest: 0, lastUpdated: new Date() }
    user.streaks.current = Math.max(user.streaks.current, newStreak)
    user.streaks.longest = Math.max(user.streaks.longest, newStreak)
    user.streaks.lastUpdated = new Date()

    await user.save()

    // Check for achievements
    const achievements = []
    
    // Streak achievements
    if (newStreak === 7) {
      achievements.push({
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Completed a 7-day streak',
        honorPoints: 50
      })
    } else if (newStreak === 30) {
      achievements.push({
        id: 'month-master',
        title: 'Month Master', 
        description: 'Completed a 30-day streak',
        honorPoints: 200
      })
    }

    // Level up achievement
    if (leveledUp) {
      achievements.push({
        id: `level-${newLevel}`,
        title: `Level ${newLevel} Achieved!`,
        description: `Reached level ${newLevel}`,
        honorPoints: newLevel * 25
      })
    }

    // Total completions achievements
    const totalCompletions = habit.analytics.totalCompletions
    if (totalCompletions === 1) {
      achievements.push({
        id: 'first-step',
        title: 'First Step',
        description: 'Completed your first habit',
        honorPoints: 20
      })
    } else if (totalCompletions === 50) {
      achievements.push({
        id: 'halfway-hero',
        title: 'Halfway Hero',
        description: 'Completed 50 habit instances',
        honorPoints: 50
      })
    }

    return NextResponse.json({ 
      message: 'Habit completed successfully!',
      completion,
      honorPointsEarned: habit.honorPointsReward,
      newStreak,
      totalHonorPoints: newHonorPoints,
      currentLevel: newLevel,
      leveledUp,
      achievements,
      successRate,
      habit: {
        ...habit.toObject(),
        analytics: habit.analytics
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error completing habit:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
