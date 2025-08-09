import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'
import { Task } from '../../../models/Task'
import type { ITask } from '../../../models/Task'

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, category, difficulty, frequency, reminderTime, isPublic } = await request.json()

    // Validate required fields
    if (!title || !description || !category || !difficulty || !frequency) {
      return NextResponse.json({ 
        message: 'Missing required fields: title, description, category, difficulty, frequency' 
      }, { status: 400 })
    }

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Calculate honor points based on difficulty
    const difficultyMultiplier = {
      'easy': 10,
      'medium': 20,
      'hard': 30
    }
    const honorPointsReward = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 10
    const honorPointsPenalty = Math.floor(honorPointsReward * 0.5) // Penalty is 50% of reward

    // Create new habit/task
    const newTask = new Task({
      userId: user._id,
      title,
      description,
      category,
      difficulty,
      honorPointsReward,
      honorPointsPenalty,
      frequency: {
        type: frequency,
        daysOfWeek: frequency === 'daily' ? [0,1,2,3,4,5,6] : []
      },
      reminders: reminderTime ? [{
        time: reminderTime,
        isEnabled: true,
        snoozeEnabled: true
      }] : [],
      proofRequirements: [],
      tags: [],
      isActive: true,
      analytics: {
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        successRate: 0,
        lastUpdated: new Date()
      },
      completions: []
    })

    await newTask.save()

    return NextResponse.json({ 
      message: 'Habit created successfully!',
      task: newTask
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating habit:', error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}