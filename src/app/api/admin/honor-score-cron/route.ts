import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { HonorScoreCron } from '../../../../services/HonorScoreCron'
import { User } from '../../../../models/User'
import connectDB from '../../../../lib/mongodb'

// GET - Get cron job status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (you can modify this check based on your admin logic)
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For now, allow all users to check status (you can restrict to admins)
    const status = HonorScoreCron.getStatus()
    
    return NextResponse.json({
      status,
      message: 'Honor Score cron job status retrieved successfully'
    })
  } catch (error) {
    console.error('Cron status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Manual trigger or manage cron jobs
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { action, userId } = await request.json()

    switch (action) {
      case 'manual-calculate':
        // Allow users to manually calculate their own score
        const targetUserId = userId || user._id.toString()
        
        // If requesting another user's calculation, check admin permissions
        if (userId && userId !== user._id.toString()) {
          // Add admin check here if needed
          // For now, restrict to own calculations
          return NextResponse.json({ 
            error: 'Can only calculate your own Honor Score' 
          }, { status: 403 })
        }

        const result = await HonorScoreCron.manualCalculation(targetUserId)
        
        return NextResponse.json({
          success: true,
          message: 'Honor Score calculated successfully',
          honorScore: result.calculation.honorScore,
          calculation: result.calculation
        })

      case 'calculate-all':
        // Restrict to admin users only
        // Add proper admin check here
        await HonorScoreCron.manualCalculation()
        
        return NextResponse.json({
          success: true,
          message: 'Honor Score calculation triggered for all users'
        })

      case 'initialize':
        HonorScoreCron.initialize()
        
        return NextResponse.json({
          success: true,
          message: 'Honor Score cron jobs initialized'
        })

      case 'stop':
        HonorScoreCron.stop()
        
        return NextResponse.json({
          success: true,
          message: 'Honor Score cron jobs stopped'
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: manual-calculate, calculate-all, initialize, or stop' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Cron management error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
