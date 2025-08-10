import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'
import { Task } from '../../../models/Task'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find the user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get user's tasks
    const tasks = await Task.find({ userId: user._id, isActive: true })

    // Calculate today's completions
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    let completedToday = 0
    let pendingToday = 0
    let totalStreaks = 0
    const recentActivity = []

    for (const task of tasks) {
      // Check if completed today
      const completedTodayForTask = task.completions?.some((completion: any) => {
        const completionDate = new Date(completion.date)
        return completionDate >= today && completionDate < tomorrow
      })

      if (completedTodayForTask) {
        completedToday++
        // Add to recent activity
        const todayCompletion = task.completions?.find((completion: any) => {
          const completionDate = new Date(completion.date)
          return completionDate >= today && completionDate < tomorrow
        })
        recentActivity.push({
          type: 'completion',
          task: {
            id: task._id,
            title: task.title,
            category: task.category,
            honorPointsAwarded: todayCompletion?.honorPointsAwarded || 0
          },
          date: todayCompletion?.date || new Date()
        })
      } else {
        pendingToday++
      }

      totalStreaks += task.analytics?.currentStreak || 0
    }

    // Get recent completions (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const recentCompletions = []
    for (const task of tasks) {
      const recentTaskCompletions = task.completions?.filter((completion: any) => 
        new Date(completion.date) >= weekAgo
      ) || []
      
      for (const completion of recentTaskCompletions) {
        recentCompletions.push({
          taskId: task._id,
          taskTitle: task.title,
          taskCategory: task.category,
          date: completion.date,
          honorPointsAwarded: completion.honorPointsAwarded
        })
      }
    }

    // Sort recent completions by date
    recentCompletions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate weekly activity data
    const weeklyActivity = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      day.setHours(0, 0, 0, 0)
      const nextDay = new Date(day)
      nextDay.setDate(day.getDate() + 1)

      let dayCompletions = 0
      for (const task of tasks) {
        const dayTaskCompletions = task.completions?.filter((completion: any) => {
          const completionDate = new Date(completion.date)
          return completionDate >= day && completionDate < nextDay
        }) || []
        dayCompletions += dayTaskCompletions.length
      }

      weeklyActivity.push({
        date: day.toISOString().split('T')[0],
        completions: dayCompletions
      })
    }

    // Get category breakdown
    const categoryStats: Record<string, { total: number; completed: number; successRate: number }> = {}
    for (const task of tasks) {
      const category = task.category
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          completed: 0,
          successRate: 0
        }
      }
      categoryStats[category].total++
      
      const taskCompletions = task.completions?.length || 0
      const daysSinceCreation = Math.floor((Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
      if (taskCompletions > 0) {
        categoryStats[category].completed++
      }
      categoryStats[category].successRate = Math.round((taskCompletions / daysSinceCreation) * 100)
    }

    const dashboardStats = {
      user: {
        name: user.name,
        honorPoints: user.honorPoints,
        level: user.level,
        streak: user.streaks?.current || 0,
        longestStreak: user.streaks?.longest || 0
      },
      today: {
        completed: completedToday,
        pending: pendingToday,
        total: tasks.length
      },
      overview: {
        totalHabits: tasks.length,
        activeHabits: tasks.filter(t => t.isActive).length,
        totalCompletions: tasks.reduce((sum, task) => sum + (task.analytics?.totalCompletions || 0), 0),
        averageStreak: totalStreaks / Math.max(tasks.length, 1)
      },
      weeklyActivity,
      categoryStats,
      recentCompletions: recentCompletions.slice(0, 10), // Last 10 completions
      motivationalQuote: getMotivationalQuote()
    }

    return NextResponse.json({
      success: true,
      data: dashboardStats
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Helper function for motivational quotes
function getMotivationalQuote() {
  const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
    "Motivation is what gets you started. Habit is what keeps you going. - Jim Ryun",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
    "The groundwork for all happiness is good health. - Leigh Hunt",
    "Take care of your body. It's the only place you have to live. - Jim Rohn",
    "A goal without a plan is just a wish. - Antoine de Saint-Exupéry",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
  ]
  
  return quotes[Math.floor(Math.random() * quotes.length)]
}
