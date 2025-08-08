import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import UserSettings from '@/models/UserSettings'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    // Get user ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Reset to default settings
    const defaultSettings = {
      userId: user._id,
      theme: 'auto',
      accentColor: 'indigo',
      notifications: {
        email: {
          habitReminders: true,
          weeklyProgress: true,
          achievementNotifications: true,
          communityUpdates: false,
          honorScoreUpdates: true
        },
        push: {
          habitReminders: true,
          achievementNotifications: true,
          honorScoreUpdates: false
        }
      },
      habits: {
        defaultDifficulty: 3,
        defaultReminder: {
          enabled: true,
          time: '09:00'
        },
        showStreakAnimations: true,
        autoArchiveCompleted: false
      },
      dashboard: {
        defaultView: 'detailed',
        showHonorScore: true,
        showQuickStats: true,
        showRecentActivity: true,
        habitOrderBy: 'priority'
      },
      privacy: {
        profileVisibility: 'public',
        showHonorScoreOnProfile: true,
        showHabitsOnProfile: true,
        allowFriendRequests: true,
        showOnlineStatus: true
      },
      honorScore: {
        showDetailedBreakdown: true,
        includeInLeaderboard: true,
        notifyOnRankChange: true
      },
      community: {
        autoFollow: false,
        showActivityFeed: true,
        contentFilters: [],
        defaultPostVisibility: 'public'
      },
      aiCoach: {
        personalityType: 'motivational',
        recommendationFrequency: 'weekly',
        includeExternalResources: true
      }
    }

    const settings = await UserSettings.findOneAndUpdate(
      { userId: user._id },
      { $set: defaultSettings },
      { new: true, upsert: true }
    )

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
}
