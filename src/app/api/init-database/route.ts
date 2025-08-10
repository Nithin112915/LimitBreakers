import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting database initialization...')
    
    // Connect to database
    await dbConnect()
    console.log('✅ Connected to MongoDB Atlas')
    
    // Check if we already have users
    const existingUsers = await User.countDocuments()
    console.log(`📊 Current users in database: ${existingUsers}`)
    
    if (existingUsers > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        userCount: existingUsers
      })
    }
    
    // Create a test user to verify everything works
    const testUser = new User({
      name: 'Database Test User',
      username: 'dbtest_user',
      userId: 'LB000001',
      email: 'dbtest@limitbreakers.com',
      password: '$2a$12$dummy.hash.for.testing.purposes.only',
      verified: true,
      honorPoints: 100,
      level: 1,
      stats: {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
      },
      profile: {
        bio: 'Test user for database verification',
        skills: ['Testing', 'MongoDB'],
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
      avatar: '/api/placeholder/40/40',
      joinedAt: new Date()
    })
    
    await testUser.save()
    console.log('✅ Test user created successfully')
    
    // Get database stats
    const finalUserCount = await User.countDocuments()
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      userCount: finalUserCount,
      testUser: {
        id: testUser._id,
        name: testUser.name,
        username: testUser.username,
        email: testUser.email
      }
    })
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
