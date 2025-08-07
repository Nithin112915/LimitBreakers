import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      honorPoints: number
      level: number
      avatar?: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    honorPoints: number
    level: number
    avatar?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    honorPoints: number
    level: number
    avatar?: string
  }
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string
  proofUrl?: string
  proofType?: 'photo' | 'document' | 'video' | 'text'
  honorPointsAwarded: number
  verificationStatus: 'pending' | 'approved' | 'rejected'
}

export interface HabitAnalytics {
  totalCompletions: number
  currentStreak: number
  longestStreak: number
  successRate: number
  weeklyProgress: number[]
  monthlyProgress: number[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  honorPoints: number
  level: number
  joinedAt: string
  skills: string[]
  achievements: string[]
  followers: number
  following: number
  streaks: {
    current: number
    longest: number
  }
}

export interface AIRecommendation {
  id: string
  type: 'habit' | 'schedule' | 'motivation'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
  estimatedImpact: number
}
