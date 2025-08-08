import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { HonorScoreCalculator } from '../../../services/HonorScoreCalculator'
import { User } from '../../../models/User'
import connectDB from '../../../lib/mongodb'

// GET - Fetch user's honor score history
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '6')
    
    // Get current period info
    const currentPeriod = HonorScoreCalculator.getCurrentPeriod()
    
    // Calculate honor score for current period
    const currentHonorScore = await HonorScoreCalculator.calculateHonorScore(
      user._id.toString(),
      currentPeriod.startDate,
      currentPeriod.endDate,
      currentPeriod.periodNumber
    )

    // Get historical honor scores
    const historicalScores = await require('../../../models/HonorScore').HonorScore
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(months * 2) // 2 periods per month

    return NextResponse.json({
      currentPeriod: {
        ...currentPeriod,
        honorScore: currentHonorScore
      },
      history: historicalScores,
      summary: {
        totalHonorPoints: user.honorPoints,
        currentStreak: currentHonorScore.calculation.finalScore,
        bestScore: Math.max(...historicalScores.map((s: any) => s.calculation.honorScore), currentHonorScore.calculation.honorScore),
        averageScore: historicalScores.length > 0 
          ? Math.round(historicalScores.reduce((sum: number, s: any) => sum + s.calculation.honorScore, 0) / historicalScores.length)
          : currentHonorScore.calculation.honorScore
      }
    })
  } catch (error) {
    console.error('Honor score fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Log daily habit completion
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { habitId, completed, weight = 1, notes, proofUrl } = await request.json()

    if (!habitId || typeof completed !== 'boolean') {
      return NextResponse.json({ 
        error: 'habitId and completed status are required' 
      }, { status: 400 })
    }

    if (weight < 1 || weight > 5) {
      return NextResponse.json({ 
        error: 'Weight must be between 1 and 5' 
      }, { status: 400 })
    }

    // Log the habit completion
    const log = await HonorScoreCalculator.logHabitCompletion(
      user._id.toString(),
      habitId,
      completed,
      weight,
      notes,
      proofUrl
    )

    // Get updated current period score
    const currentPeriod = HonorScoreCalculator.getCurrentPeriod()
    const updatedHonorScore = await HonorScoreCalculator.calculateHonorScore(
      user._id.toString(),
      currentPeriod.startDate,
      currentPeriod.endDate,
      currentPeriod.periodNumber
    )

    return NextResponse.json({
      success: true,
      log,
      currentPeriodScore: updatedHonorScore.calculation.honorScore,
      honorPointsEarned: log.honorPoints
    })
  } catch (error) {
    console.error('Honor score logging error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
