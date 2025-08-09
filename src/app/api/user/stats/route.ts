import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import dbConnect from '../../../../lib/mongodb'
import { User } from '../../../../models/User'
import { Task } from '../../../../models/Task'
import type { ITask } from '../../../../models/Task'

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

    // Get user's tasks
    const tasks: ITask[] = await Task.find({ userId: user._id })

    // Calculate stats
    const totalTasks = tasks.length
    const activeTasks = tasks.filter((task: ITask) => task.isActive !== false).length
    
    // Calculate completed today
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    let completedToday = 0
    let totalCompletions = 0
    
    tasks.forEach((task: ITask) => {
      // Check if completed today using completions array
      const todayCompletion = task.completions?.find((completion: any) => {
        const completionDate = new Date(completion.date)
        return completionDate >= startOfDay && completionDate < endOfDay
      })
      if (todayCompletion) completedToday++
      // Sum up total completions
      totalCompletions += task.analytics?.totalCompletions || 0
    })

    // Calculate success rate based on days since creation
    const totalPossibleCompletions = tasks.reduce((sum: number, task: ITask) => {
      const daysSinceCreation = Math.floor((Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
      return sum + daysSinceCreation
    }, 0)
    
    const averageSuccessRate = totalPossibleCompletions > 0 
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100) 
      : 0

    // Get weekly progress
    const weeklyProgress: Array<{ day: string; completed: number; total: number }> = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      let completed = 0
      tasks.forEach((task: ITask) => {
        const dayCompletion = task.completions?.find((completion: any) => {
          const completionDate = new Date(completion.date)
          return completionDate >= dayStart && completionDate < dayEnd
        })
        if (dayCompletion) completed++
      })
      
      weeklyProgress.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed,
        total: activeTasks
      })
    }

    // Category breakdown
    const categoryBreakdown: { [key: string]: { count: number; completed: number } } = {}
    tasks.forEach((task: ITask) => {
      if (!categoryBreakdown[task.category]) {
        categoryBreakdown[task.category] = { count: 0, completed: 0 }
      }
      categoryBreakdown[task.category].count++
      categoryBreakdown[task.category].completed += task.analytics?.totalCompletions || 0
    })

    const categoryArray = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      count: data.count,
      completed: data.completed
    }))

    const stats = {
      totalTasks,
      activeTasks,
      completedToday,
      honorPoints: user.honorPoints || 0,
      level: user.level || 1,
      currentStreak: Math.max(...tasks.map((h: ITask) => h.analytics?.currentStreak || 0), 0),
      longestStreak: Math.max(...tasks.map((h: ITask) => h.analytics?.longestStreak || 0), 0),
      totalCompletions,
      averageSuccessRate,
      weeklyProgress,
      categoryBreakdown: categoryArray,
      recentAchievements: user.achievements?.slice(-5) || [], // Last 5 achievements
      allAchievements: user.achievements || [],
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
