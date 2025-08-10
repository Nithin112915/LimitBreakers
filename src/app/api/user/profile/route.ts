import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import connectDB from '../../../../lib/mongodb'
import { User } from '../../../../models/User'

// Force dynamic rendering

// GET - Get current user profile
export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email })
      .select('-password')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, username, bio, skills, socialLinks } = body

    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user fields
    if (name) user.name = name
    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: user._id } 
      })
      if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
      user.username = username
    }
    if (bio !== undefined) user.profile.bio = bio
    if (skills) user.profile.skills = skills
    if (socialLinks) user.profile.socialLinks = { ...user.profile.socialLinks, ...socialLinks }

    await user.save()

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password')
    
    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
