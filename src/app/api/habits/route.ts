import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from 'src/lib/mongodb'
import { User } from 'src/models/User'
import { Task } from 'src/models/Task'
import type { ITask } from 'src/models/Task'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const tasks: ITask[] = await Task.find({ userId: user._id })
    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

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

    // Find the task
    const task: ITask | null = await Task.findById(params.id)
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }
    if (task.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Check if already completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const alreadyCompleted = task.completions?.some((completion: any) => {
      const completionDate = new Date(completion.date)
      return completionDate >= today && completionDate < tomorrow
    })
    if (alreadyCompleted) {
      return NextResponse.json({ 
        message: 'Task already completed today',
        alreadyCompleted: true 
      }, { status: 400 })
    }

    // Create completion record
    const completion = {
      date: new Date(),
      proofSubmitted: proofUrl ? {
        type: (['photo', 'text', 'document', 'video'].includes(proofType) ? proofType : 'photo') as 'photo' | 'text' | 'document' | 'video',
        url: proofUrl,
        content: notes,
        verificationStatus: 'approved' as 'approved'
      } : undefined,
      honorPointsAwarded: task.honorPointsReward,
      notes: notes || ''
    }

    // Calculate new streak
    const sortedCompletions = [...(task.completions || []), completion]
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
    const daysSinceCreation = Math.floor((Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
    const successRate = Math.round((sortedCompletions.length / daysSinceCreation) * 100)

    // Update task analytics
    task.analytics.totalCompletions = sortedCompletions.length
    task.analytics.currentStreak = newStreak
    task.analytics.longestStreak = Math.max(task.analytics.longestStreak || 0, newStreak)
    task.analytics.successRate = successRate
    task.analytics.lastUpdated = new Date()

    // Add completion to task
    task.completions = task.completions || []
    task.completions.push(completion)
    await task.save()

    // Update user honor points and streaks
    const previousHonorPoints = user.honorPoints
    const newHonorPoints = previousHonorPoints + task.honorPointsReward
    const previousLevel = Math.floor(previousHonorPoints / 1000) + 1
    const newLevel = Math.floor(newHonorPoints / 1000) + 1
    const leveledUp = newLevel > previousLevel

    user.honorPoints = newHonorPoints
    user.level = newLevel
    user.streaks = user.streaks || { current: 0, longest: 0, lastUpdated: new Date() }
    user.streaks.current = Math.max(user.streaks.current, newStreak)
    user.streaks.longest = Math.max(user.streaks.longest, newStreak)
    await user.save()

    // Check for achievements
    const achievements = []
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
    if (leveledUp) {
      achievements.push({
        id: `level-${newLevel}`,
        title: `Level ${newLevel} Achieved!`,
        description: `Reached level ${newLevel}`,
        honorPoints: newLevel * 25
      })
    }
    const totalCompletions = task.analytics.totalCompletions
    if (totalCompletions === 1) {
      achievements.push({
        id: 'first-step',
        title: 'First Step',
        description: 'Completed your first task',
        honorPoints: 20
      })
    } else if (totalCompletions === 50) {
      achievements.push({
        id: 'halfway-hero',
        title: 'Halfway Hero',
        description: 'Completed 50 task instances',
        honorPoints: 50
      })
    }

    return NextResponse.json({ 
      message: 'Task completed successfully!',
      completion,
      honorPointsEarned: task.honorPointsReward,
      newStreak,
      totalHonorPoints: newHonorPoints,
      currentLevel: newLevel,
      leveledUp,
      achievements,
      successRate,
      task: {
        ...task.toObject(),
        analytics: task.analytics
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error completing task:', error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    try {
      const body = await request.json();
      console.error('Request body:', body);
    } catch {}
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}