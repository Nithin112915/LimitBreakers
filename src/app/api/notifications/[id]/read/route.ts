import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Notification } from '@/models/Notification'
import { User } from '@/models/User'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notificationId = params.id
    
    // Find user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find and update the notification
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId,
        userId: user._id
      },
      { 
        read: true,
        readAt: new Date()
      },
      { new: true }
    )

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      notification 
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
