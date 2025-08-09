import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import OpenAI from 'openai'
import dbConnect from '../../../../lib/mongodb'
import { User } from '../../../../models/User'
import { Task } from '../../../../models/Task'
import type { ITask } from '../../../../models/Task'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!openai) {
      return NextResponse.json({ 
        message: 'AI recommendations are not available. Please configure OpenAI API key.' 
      }, { status: 503 })
    }

    const { type, context } = await request.json()

    await dbConnect()

    // Find the user by email to get the ID
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get user's habits for context
    const tasks: ITask[] = await Task.find({ userId: user._id, isActive: true })

    let prompt = ''
    let systemMessage = 'You are an AI personal growth coach. Provide helpful, encouraging, and actionable advice.'

    switch (type) {
      case 'daily_motivation':
        prompt = `Based on the user's current habits and progress, provide a short motivational message for today. 
        User details: Honor Points: ${user.honorPoints}, Level: ${user.level}
        Active Tasks: ${tasks.map((h: ITask) => `${h.title} (${h.category}, ${h.difficulty})`).join(', ')}
        Keep it under 100 words and personalized.`
        break

      case 'habit_suggestions':
        prompt = `Suggest 3 new habits for a user based on their current habits and goals.
        Current tasks: ${tasks.map((h: ITask) => `${h.title} (${h.category})`).join(', ')}
        User level: ${user.level}
        Provide specific, actionable habit suggestions with difficulty levels (easy, medium, hard).`
        break

      case 'progress_analysis':
        const taskStats = tasks.map((h: ITask) => ({
          title: h.title,
          streak: h.analytics.currentStreak,
          completions: h.analytics.totalCompletions,
          successRate: h.analytics.successRate
        }))
        prompt = `Analyze the user's habit progress and provide insights:
        ${JSON.stringify(taskStats, null, 2)}
        Identify patterns, strengths, areas for improvement, and specific recommendations.`
        break

      case 'custom':
        prompt = context || 'Provide general personal growth advice.'
        break

      default:
        return NextResponse.json({ message: 'Invalid request type' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return a mock response if OpenAI is not configured
      return NextResponse.json({
        recommendation: `This is a sample AI recommendation for ${type}. Configure OpenAI API key for real AI insights.`,
        type
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const recommendation = completion.choices[0]?.message?.content || 'Unable to generate recommendation at this time.'

    return NextResponse.json({
      recommendation,
      type,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating AI recommendation:', error)
    return NextResponse.json(
      { message: 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}
