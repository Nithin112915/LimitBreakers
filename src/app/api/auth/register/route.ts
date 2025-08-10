import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../../lib/mongodb'
import { User } from '../../../../models/User'

// Generate a unique user ID
function generateUserId(): string {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000)
  return `LB${randomNum.toString().slice(-6)}`
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received')
    
    const { name, username, email, password } = await request.json()
    console.log('Request data parsed:', { name, username, email, passwordLength: password?.length })

    if (!name || !username || !email || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      console.log('Password too short')
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      console.log('Invalid username format')
      return NextResponse.json(
        { message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' },
        { status: 400 }
      )
    }

    console.log('Connecting to database...')
    await dbConnect()
    console.log('Database connected successfully')
    
    // Check if user already exists by email
    console.log('Checking for existing email...')
    const existingUserByEmail = await User.findOne({ email })
    if (existingUserByEmail) {
      console.log('Email already exists')
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Check if username is taken
    console.log('Checking for existing username...')
    const existingUserByUsername = await User.findOne({ username })
    if (existingUserByUsername) {
      console.log('Username already taken')
      return NextResponse.json(
        { message: 'Username already taken' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique user ID
    console.log('Generating user ID...')
    const userId = generateUserId()
    console.log('Generated user ID:', userId)

    console.log('Creating new user...')
    const newUser = new User({
      name,
      username,
      userId,
      email,
      password: hashedPassword,
      verified: false,
      honorPoints: 50, // Starting points
      level: 1,
      stats: {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
      },
      profile: {
        bio: '',
        skills: [],
        achievements: [],
        education: [],
        experience: [],
        socialLinks: {
          linkedin: '',
          twitter: '',
          website: ''
        }
      },
      settings: {
        notifications: {
          email: true,
          push: true,
          reminders: true
        },
        privacy: {
          profileVisibility: 'public',
          shareProgress: true
        }
      },
      followers: [],
      following: [],
      streaks: {
        current: 0,
        longest: 0,
        lastUpdated: new Date()
      },
      avatar: `/api/placeholder/40/40`, // Default avatar
      joinedAt: new Date()
    })

    console.log('Saving user to database...')
    await newUser.save()
    console.log('User saved successfully:', newUser._id)

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser._id || newUser.id,
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
    
    // More specific error handling for production debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        return NextResponse.json(
          { message: 'Email or username already exists' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('validation failed')) {
        console.error('Validation error:', error.message)
        return NextResponse.json(
          { message: 'Invalid user data provided' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: isProduction ? 'Something went wrong' : errorMessage,
        ...(isProduction ? {} : { stack: error instanceof Error ? error.stack : undefined })
      },
      { status: 500 }
    )
  }
}
