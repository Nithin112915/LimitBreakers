import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'

export async function GET() {
  try {
    console.log('🔄 Testing database connection via API...')
    
    // Skip during build time
    if (process.env.NETLIFY_BUILD === 'true') {
      return NextResponse.json({
        success: true,
        message: 'Database test skipped during build',
        buildTime: true
      })
    }
    
    // Test database connection
    const connection = await dbConnect()
    if (!connection) {
      return NextResponse.json({
        success: false,
        message: 'Database connection not available'
      }, { status: 503 })
    }
    
    console.log('✅ Database connected successfully!')
    
    // Test basic query
    const userCount = await User.countDocuments()
    console.log(`📊 Current user count: ${userCount}`)
    
    // Test if we can create a simple query
    const users = await User.find().limit(3).select('name email')
    console.log('👥 Sample users:', users)
    
    return NextResponse.json({
      success: true,
      message: 'Database test completed successfully!',
      userCount,
      sampleUsers: users
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
