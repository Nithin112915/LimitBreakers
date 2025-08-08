import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import UserSettings from '@/models/UserSettings'
import { User } from '@/models/User'

export async function GET(request: NextRequest) {
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

    // Get user settings
    const settings = await UserSettings.findOne({ userId: user._id })
    
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    // Create export data with metadata
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user: {
        email: session.user.email,
        name: session.user.name
      },
      settings: {
        theme: settings.theme,
        accentColor: settings.accentColor,
        notifications: settings.notifications,
        habits: settings.habits,
        dashboard: settings.dashboard,
        privacy: settings.privacy,
        honorScore: settings.honorScore,
        community: settings.community,
        aiCoach: settings.aiCoach
      }
    }

    // Set headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Content-Disposition', `attachment; filename="limitbreakers-settings-${new Date().toISOString().split('T')[0]}.json"`)

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Settings export error:', error)
    return NextResponse.json(
      { error: 'Failed to export settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const importData = await request.json()
    await connectToDatabase()

    // Get user ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Validate import data structure
    if (!importData.settings || !importData.version) {
      return NextResponse.json({ error: 'Invalid import file format' }, { status: 400 })
    }

    // Extract settings from import data
    const { settings: importedSettings } = importData

    // Update user settings with imported data
    const settings = await UserSettings.findOneAndUpdate(
      { userId: user._id },
      { 
        $set: {
          userId: user._id,
          ...importedSettings,
          updatedAt: new Date()
        }
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Settings imported successfully',
      settings
    })
  } catch (error) {
    console.error('Settings import error:', error)
    return NextResponse.json(
      { error: 'Failed to import settings' },
      { status: 500 }
    )
  }
}
