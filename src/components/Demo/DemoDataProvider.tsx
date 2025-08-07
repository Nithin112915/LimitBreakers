'use client'

import { createContext, useContext, ReactNode } from 'react'

// Sample demo data
const demoData = {
  user: {
    id: 'demo-user',
    name: 'John Doe',
    email: 'john.doe@example.com',
    level: 5,
    honorPoints: 2450,
    currentStreak: 12,
    totalHabits: 8,
    completedToday: 3,
    joinDate: '2024-01-15'
  },
  habits: [
    {
      id: 'habit-1',
      title: 'Morning Exercise',
      category: 'Fitness & Health',
      difficulty: 'Medium',
      frequency: 'Daily',
      streak: 12,
      completionRate: 92,
      points: 15,
      isCompleted: true,
      nextReminder: '07:00 AM'
    },
    {
      id: 'habit-2',
      title: 'Read for 30 minutes',
      category: 'Learning & Growth',
      difficulty: 'Easy',
      frequency: 'Daily',
      streak: 8,
      completionRate: 78,
      points: 10,
      isCompleted: false,
      nextReminder: '09:00 PM'
    },
    {
      id: 'habit-3',
      title: '10-minute Meditation',
      category: 'Mindfulness',
      difficulty: 'Easy',
      frequency: 'Daily',
      streak: 15,
      completionRate: 85,
      points: 12,
      isCompleted: true,
      nextReminder: '06:30 AM'
    },
    {
      id: 'habit-4',
      title: 'Journal Writing',
      category: 'Mental Health',
      difficulty: 'Medium',
      frequency: 'Daily',
      streak: 6,
      completionRate: 66,
      points: 13,
      isCompleted: false,
      nextReminder: '10:00 PM'
    }
  ],
  achievements: [
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 10-day streak',
      icon: '🔥',
      unlockedAt: '2024-12-20',
      points: 100
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete morning habits for 7 days',
      icon: '🌅',
      unlockedAt: '2024-12-15',
      points: 75
    },
    {
      id: 'consistency-champion',
      title: 'Consistency Champion',
      description: 'Achieve 90% completion rate',
      icon: '🏆',
      unlockedAt: '2024-12-25',
      points: 150
    }
  ],
  community: {
    leaderboard: [
      { rank: 1, name: 'Sarah Chen', points: 3200, level: 7 },
      { rank: 2, name: 'Mike Johnson', points: 2800, level: 6 },
      { rank: 3, name: 'John Doe', points: 2450, level: 5 },
      { rank: 4, name: 'Lisa Wang', points: 2100, level: 5 },
      { rank: 5, name: 'Alex Smith', points: 1950, level: 4 }
    ],
    challenges: [
      {
        id: 'fitness-30',
        title: '30-Day Fitness Challenge',
        description: 'Complete any fitness habit for 30 consecutive days',
        progress: 12,
        target: 30,
        reward: 500,
        participants: 1247,
        daysLeft: 18
      },
      {
        id: 'learning-sprint',
        title: 'Team Learning Sprint',
        description: 'Join a team and learn something new together',
        progress: 0,
        target: 7,
        reward: 300,
        participants: 892,
        daysLeft: 25
      }
    ]
  },
  aiInsights: [
    "Great job on your 12-day streak! Consider adding a mindfulness practice to enhance your morning routine.",
    "Your exercise consistency is impressive. Maybe try increasing the intensity slightly this week?",
    "Based on your patterns, Tuesdays seem challenging. Consider setting a motivational reminder.",
    "You're 85% of the way to Level 6! One more week of consistency will get you there.",
    "Your reading habit has room for improvement. Try scheduling it right after your successful exercise habit."
  ],
  analytics: {
    weeklyProgress: [
      { day: 'Mon', completed: 4, total: 4 },
      { day: 'Tue', completed: 3, total: 4 },
      { day: 'Wed', completed: 4, total: 4 },
      { day: 'Thu', completed: 4, total: 4 },
      { day: 'Fri', completed: 2, total: 4 },
      { day: 'Sat', completed: 3, total: 4 },
      { day: 'Sun', completed: 4, total: 4 }
    ],
    monthlyStats: {
      totalDays: 31,
      completedDays: 28,
      totalHabits: 124,
      completedHabits: 108,
      averageScore: 87
    }
  }
}

interface DemoDataContextType {
  data: typeof demoData
  updateHabitCompletion: (habitId: string, completed: boolean) => void
  addHonorPoints: (points: number) => void
}

const DemoDataContext = createContext<DemoDataContextType | null>(null)

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const updateHabitCompletion = (habitId: string, completed: boolean) => {
    // In a real app, this would update the backend
    console.log(`Habit ${habitId} completion status: ${completed}`)
  }

  const addHonorPoints = (points: number) => {
    // In a real app, this would update the user's points
    console.log(`Added ${points} honor points`)
  }

  return (
    <DemoDataContext.Provider value={{
      data: demoData,
      updateHabitCompletion,
      addHonorPoints
    }}>
      {children}
    </DemoDataContext.Provider>
  )
}

export function useDemoData() {
  const context = useContext(DemoDataContext)
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider')
  }
  return context
}
