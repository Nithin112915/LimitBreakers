import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import dbConnect from '../../../../lib/mongodb'
import { User } from '../../../../models/User'
import { Habit } from '../../../../models/Habit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get user's habits
    const habits = await Habit.find({ userId: user._id })

    // Calculate stats
    const totalHabits = habits.length
    const activeHabits = habits.filter(habit => habit.isActive !== false).length
    
    // Calculate completed today
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    let completedToday = 0
    habits.forEach(habit => {
      const todayLog = habit.logs?.find(log => 
        log.date >= startOfDay && log.date < endOfDay && log.completed
      )
      if (todayLog) completedToday++
    })

    // Calculate success rate
    let totalLogs = 0
    let completedLogs = 0
    habits.forEach(habit => {
      if (habit.logs) {
        totalLogs += habit.logs.length
        completedLogs += habit.logs.filter(log => log.completed).length
      }
    })
    const successRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0

    // Get weekly progress
    const weeklyProgress: Array<{ day: string; completed: number; total: number }> = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      let completed = 0
      habits.forEach(habit => {
        const dayLog = habit.logs?.find(log => 
          log.date >= dayStart && log.date < dayEnd && log.completed
        )
        if (dayLog) completed++
      })
      
      weeklyProgress.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed,
        total: activeHabits
      })
    }

    // Category breakdown
    const categoryBreakdown: { [key: string]: { count: number; completed: number } } = {}
    habits.forEach(habit => {
      if (!categoryBreakdown[habit.category]) {
        categoryBreakdown[habit.category] = { count: 0, completed: 0 }
      }
      categoryBreakdown[habit.category].count++
      if (habit.logs) {
        categoryBreakdown[habit.category].completed += habit.logs.filter(log => log.completed).length
      }
    })

    const categoryArray = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      count: data.count,
      completed: data.completed
    }))

    const stats = {
      totalHabits,
      activeHabits,
      completedToday,
      honorPoints: user.honorPoints || 0,
      level: user.level || 1,
      currentStreak: user.streaks?.current || 0,
      longestStreak: user.streaks?.longest || 0,
      successRate,
      weeklyProgress,
      categoryBreakdown: categoryArray,
      recentAchievements: user.achievements || [],
      pointsHistory: [] // You can implement this based on your needs
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
