import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../../lib/mongodb'
import { User } from '../../../../models/User'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password } = await request.json()

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' },
        { status: 400 }
      )
    }

    await dbConnect()
    
    // Check if user already exists by email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: 'User already exists with this email' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { message: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      honorPoints: 100, // Starting points
      level: 1,
      stats: {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
      },
      streaks: {
        current: 0,
        longest: 0
      },
      avatar: `/api/placeholder/40/40`, // Default avatar
      joinedAt: new Date()
    })

    await newUser.save()

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          honorPoints: newUser.honorPoints,
          level: newUser.level
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
