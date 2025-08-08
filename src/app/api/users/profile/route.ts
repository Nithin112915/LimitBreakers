import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { User } from '../../../../models/User'
import connectDB from '../../../../lib/mongodb'
import { authOptions } from '../../../../lib/auth'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findById((session.user as any).id)
      .select('-password -__v')
      .lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, location, website, interests } = body

    // Validate input
    if (name && name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }

    if (bio && bio.length > 500) {
      return NextResponse.json({ error: 'Bio must be less than 500 characters' }, { status: 400 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (bio !== undefined) updateData['profile.bio'] = bio.trim()
    if (location !== undefined) updateData['profile.location'] = location.trim()
    if (website !== undefined) updateData['profile.website'] = website.trim()
    if (interests !== undefined) updateData['profile.interests'] = interests

    const updatedUser = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -__v')

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
