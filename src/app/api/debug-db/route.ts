import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'

export async function GET() {
  try {
    console.log('Debug: Environment variables check')
    console.log('NETLIFY_BUILD:', process.env.NETLIFY_BUILD)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('NEXT_PHASE:', process.env.NEXT_PHASE)
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    
    const connection = await dbConnect()
    console.log('Debug: Connection result:', !!connection)
    
    if (!connection) {
      return NextResponse.json({
        success: false,
        message: 'Database connection not available',
        env: {
          NETLIFY_BUILD: process.env.NETLIFY_BUILD,
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PHASE: process.env.NEXT_PHASE,
          MONGODB_URI: !!process.env.MONGODB_URI
        }
      }, { status: 503 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      env: {
        NETLIFY_BUILD: process.env.NETLIFY_BUILD,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PHASE: process.env.NEXT_PHASE,
        MONGODB_URI: !!process.env.MONGODB_URI
      }
    })
    
  } catch (error) {
    console.error('Debug: Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      env: {
        NETLIFY_BUILD: process.env.NETLIFY_BUILD,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PHASE: process.env.NEXT_PHASE,
        MONGODB_URI: !!process.env.MONGODB_URI
      }
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
