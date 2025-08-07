import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }

    // Test database connection
    let dbStatus = 'disconnected'
    let dbError = null
    
    try {
      await dbConnect()
      dbStatus = 'connected'
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Unknown database error'
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError
      },
      version: '1.0.0'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
