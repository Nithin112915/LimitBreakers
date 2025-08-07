import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface Notification {
  id: string
  type: 'habit_reminder' | 'achievement' | 'friend_activity' | 'level_up' | 'streak_milestone'
  title: string
  message: string
  read: boolean
  createdAt: Date
  metadata?: any
}

export async function GET(request: NextRequest) {
  try {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Streak Master Unlocked!',
        message: 'Congratulations! You\'ve maintained a 10-day streak.',
        read: false,
        createdAt: new Date('2024-12-21T08:00:00'),
        metadata: { achievement: 'streak-master', points: 100 }
      },
      {
        id: '2',
        type: 'habit_reminder',
        title: 'Time for Morning Run',
        message: 'Don\'t forget your morning run today!',
        read: false,
        createdAt: new Date('2024-12-21T06:00:00'),
        metadata: { habitId: '1' }
      },
      {
        id: '3',
        type: 'level_up',
        title: 'Level Up!',
        message: 'You\'ve reached Level 5! Keep up the great work.',
        read: true,
        createdAt: new Date('2024-12-20T14:30:00'),
        metadata: { newLevel: 5, previousLevel: 4 }
      }
    ]

    const sortedNotifications = notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const unreadCount = notifications.filter(n => !n.read).length

    return NextResponse.json({
      notifications: sortedNotifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { notificationId, markAsRead } = await request.json()

    if (!notificationId) {
      return NextResponse.json(
        { message: 'Notification ID is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: `Notification ${markAsRead ? 'marked as read' : 'marked as unread'}`,
      notificationId,
      read: markAsRead
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
