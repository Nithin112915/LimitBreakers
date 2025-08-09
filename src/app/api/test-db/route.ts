import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'

export async function GET() {
  try {
    console.log('Testing database connection...')
    await dbConnect()
    console.log('Database connected successfully')
    
    const userCount = await User.countDocuments()
    console.log('User count:', userCount)
    
    const users = await User.find({}).limit(5).lean()
    console.log('Users found:', users.length)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      userCount,
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        honorPoints: user.honorPoints
      }))
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
