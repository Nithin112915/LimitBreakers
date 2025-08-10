import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { habitId, habitTitle, reminderTime } = await req.json()

    // For testing, we'll just return a success message
    // In a real implementation, this might trigger an immediate reminder or schedule one
    
    return NextResponse.json({ 
      success: true,
      message: `Test reminder scheduled for habit: ${habitTitle} at ${reminderTime}`,
      data: {
        habitId,
        habitTitle,
        reminderTime,
        scheduledAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Test reminder error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Return test notification data
    return NextResponse.json({
      success: true,
      message: 'Reminder system test endpoint',
      notificationSupport: typeof window !== 'undefined' ? 'Notification' in window : false,
      serviceWorkerSupport: typeof navigator !== 'undefined' ? 'serviceWorker' in navigator : false,
      testReminder: {
        title: 'Test Habit Reminder 🎯',
        body: 'This is a test reminder to verify your notification system is working!',
        scheduledTime: new Date(Date.now() + 10000).toISOString() // 10 seconds from now
      }
    })

  } catch (error) {
    console.error('Test reminder error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
