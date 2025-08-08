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

    // Get user settings, create default if doesn't exist
    let settings = await UserSettings.findOne({ userId: user._id })
    
    if (!settings) {
      // Create default settings
      const defaultSettings = {
        userId: user._id,
        theme: 'auto',
        accentColor: 'indigo'
      }
      
      settings = new UserSettings(defaultSettings)
      await settings.save()
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    await connectToDatabase()

    // Get user ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update settings
    const settings = await UserSettings.findOneAndUpdate(
      { userId: user._id },
      { $set: updates },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    )

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { section, data } = await request.json()
    await connectToDatabase()

    // Get user ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update specific section
    const updatePath = { [`${section}`]: data }
    const settings = await UserSettings.findOneAndUpdate(
      { userId: user._id },
      { $set: updatePath },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    )

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings section update error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings section' },
      { status: 500 }
    )
  }
}
