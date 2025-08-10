import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'
import { Task } from '../../../models/Task'
import type { ITask } from '../../../models/Task'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      category, 
      difficulty, 
      frequency,
      reminderTime,
      tags,
      requiresProof,
      proofType
    } = body

    // Validate required fields
    if (!title || !category || !frequency) {
      return NextResponse.json({ 
        message: 'Missing required fields: title, category, frequency' 
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
    const honorPointsPenalty = Math.floor(honorPointsReward * 0.5) // 50% of reward as penalty

    // Set up reminders
    const reminders = reminderTime ? [{
      time: reminderTime,
      isEnabled: true,
      snoozeEnabled: true
    }] : []

    // Set up proof requirements
    const proofRequirements = requiresProof ? [{
      type: proofType || 'text',
      description: `Proof of completion for ${title}`,
      isRequired: true
    }] : []

    // Create new habit/task
    const newTask = new Task({
      userId: user._id,
      title,
      description: description || '',
      category: category.toLowerCase(),
      difficulty: difficulty?.toLowerCase() || 'medium',
      honorPointsReward,
      honorPointsPenalty,
      frequency: {
        type: frequency.type || 'daily',
        daysOfWeek: frequency.daysOfWeek || [],
        customSchedule: frequency.customSchedule || []
      },
      reminders,
      schedule: reminderTime ? { time: reminderTime } : undefined, // Add schedule for reminder manager
      proofRequirements,
      tags: tags || [],
      isActive: true,
      completions: [],
      analytics: {
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        successRate: 0,
        lastUpdated: new Date()
      }
    })

    await newTask.save()

    return NextResponse.json({ 
      success: true,
      message: 'Habit created successfully!',
      habit: newTask
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}