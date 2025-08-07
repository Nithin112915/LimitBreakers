import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '../../../../lib/mongodb'
import { Habit } from '../../../../models/Habit'
import { User } from '../../../../models/User'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const habit = await Habit.findById(params.id)
    
    if (!habit) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 })
    }

    if (habit.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ habit })
  } catch (error) {
    console.error('Error fetching habit:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const {
      title,
      description,
      category,
      difficulty,
      frequency,
      reminders,
      proofRequirements,
      tags,
      isActive
    } = await request.json()

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const habit = await Habit.findById(params.id)
    
    if (!habit) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 })
    }

    if (habit.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Update habit
    const updatedHabit = await Habit.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        category,
        difficulty,
        frequency,
        reminders,
        proofRequirements,
        tags,
        isActive,
        updatedAt: new Date()
      },
      { new: true }
    )

    return NextResponse.json({ habit: updatedHabit })
  } catch (error) {
    console.error('Error updating habit:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const habit = await Habit.findById(params.id)
    
    if (!habit) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 })
    }

    if (habit.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    await Habit.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Habit deleted successfully' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
