import { HonorScore } from '../models/HonorScore'
import { DailyHabitLog } from '../models/DailyHabitLog'
import { User } from '../models/User'
import connectDB from '../lib/mongodb'

interface StreakBonus {
  days: number
  bonus: number
}

export class HonorScoreCalculator {
  private static readonly STREAK_BONUSES: StreakBonus[] = [
    { days: 5, bonus: 5 },
    { days: 10, bonus: 15 },
    { days: 15, bonus: 30 }
  ]

  private static readonly MAX_PENALTY_CAP = 3 // Max consecutive penalty days
  private static readonly PERIOD_DAYS = 15
  private static readonly MAX_HONOR_SCORE = 1000
  
  // Enhanced scoring weights for different task priorities
  private static readonly TASK_WEIGHTS = {
    LOW: 1,      // Basic tasks
    MEDIUM: 2,   // Important tasks  
    HIGH: 3,     // Critical tasks
    URGENT: 4,   // High-priority tasks
    VITAL: 5     // Life-changing tasks
  }

  /**
   * Calculate Honor Score for a specific user and period
   */
  static async calculateHonorScore(
    userId: string, 
    startDate: Date, 
    endDate: Date,
    periodNumber: 1 | 2
  ): Promise<any> {
    await connectDB()

    const logs = await DailyHabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 })

    // Group logs by date to calculate daily performance
    const dailyPerformance = this.groupLogsByDate(logs, startDate, endDate)
    
    // Calculate raw scores
    const calculation = this.calculateRawScores(dailyPerformance)
    
    // Add streak bonuses
    calculation.streakBonuses = this.calculateStreakBonuses(dailyPerformance)
    calculation.finalScore = calculation.rawScore + calculation.streakBonuses
    
    // Scale to 1000 point system
    calculation.honorScore = Math.min(
      Math.max(0, Math.round((calculation.finalScore / calculation.maxPossiblePoints) * this.MAX_HONOR_SCORE)),
      this.MAX_HONOR_SCORE
    )

    // Get previous period for trends
    const previousPeriod = await this.getPreviousPeriod(userId, startDate, periodNumber)
    const trends = this.calculateTrends(calculation.honorScore, previousPeriod, dailyPerformance)

    // Create or update honor score record
    const honorScore = await HonorScore.findOneAndUpdate(
      {
        userId,
        'period.startDate': startDate,
        'period.endDate': endDate,
        'period.periodNumber': periodNumber
      },
      {
        userId,
        period: {
          startDate,
          endDate,
          periodNumber,
          month: startDate.getMonth() + 1,
          year: startDate.getFullYear()
        },
        dailyLogs: this.formatDailyLogs(dailyPerformance),
        calculation,
        trends
      },
      { upsert: true, new: true }
    )

    // Update user's total honor points
    await User.findByIdAndUpdate(userId, {
      $inc: { honorPoints: calculation.honorScore - (previousPeriod?.calculation.honorScore || 0) }
    })

    return honorScore
  }

  /**
   * Group habit logs by date and calculate daily performance
   */
  private static groupLogsByDate(logs: any[], startDate: Date, endDate: Date): Map<string, any> {
    const dailyPerformance = new Map()
    
    // Initialize all days in the period
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0]
      dailyPerformance.set(dateKey, {
        date: new Date(d),
        completed: false,
        weight: 1,
        habitCount: 0,
        completedHabits: 0,
        streakDay: 0,
        bonusPoints: 0
      })
    }

    // Process actual logs
    logs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0]
      const dayData = dailyPerformance.get(dateKey) || {
        date: log.date,
        completed: false,
        weight: 1,
        habitCount: 0,
        completedHabits: 0,
        streakDay: 0,
        bonusPoints: 0
      }

      dayData.habitCount++
      if (log.completed) {
        dayData.completedHabits++
        dayData.weight = Math.max(dayData.weight, log.weight)
      }

      // Consider day completed if at least 70% of habits are done
      dayData.completed = dayData.completedHabits / dayData.habitCount >= 0.7

      dailyPerformance.set(dateKey, dayData)
    })

    // Calculate streak information
    this.calculateStreakDays(dailyPerformance)

    return dailyPerformance
  }

  /**
   * Calculate raw scores based on daily performance
   * Following the +1/-1 approach with weighted tasks
   */
  private static calculateRawScores(dailyPerformance: Map<string, any>): any {
    let pointsEarned = 0
    let pointsLost = 0
    let consecutiveMisses = 0
    let totalDaysCompleted = 0
    let totalDaysMissed = 0

    dailyPerformance.forEach((dayData) => {
      if (dayData.completed) {
        // Complete daily task → +1 point (weighted by task importance)
        pointsEarned += dayData.weight
        totalDaysCompleted++
        consecutiveMisses = 0
      } else {
        // Miss daily task → -1 point (with penalty cap)
        if (consecutiveMisses < this.MAX_PENALTY_CAP) {
          pointsLost += dayData.weight
          consecutiveMisses++
        }
        totalDaysMissed++
      }
    })

    const rawScore = pointsEarned - pointsLost
    
    // Calculate max possible points (all days completed with average weight)
    const averageWeight = pointsEarned > 0 ? pointsEarned / Math.max(totalDaysCompleted, 1) : 1
    const maxPossiblePoints = this.PERIOD_DAYS * averageWeight

    return {
      pointsEarned,
      pointsLost,
      rawScore,
      maxPossiblePoints,
      totalDaysCompleted,
      totalDaysMissed,
      averageWeight: Math.round(averageWeight * 100) / 100,
      streakBonuses: 0,
      finalScore: 0,
      honorScore: 0
    }
  }

  /**
   * Calculate streak bonuses
   */
  private static calculateStreakBonuses(dailyPerformance: Map<string, any>): number {
    let totalBonus = 0
    let currentStreak = 0
    let appliedBonuses = new Set()

    dailyPerformance.forEach((dayData) => {
      if (dayData.completed) {
        currentStreak++
        
        // Check for streak bonuses
        for (const bonus of this.STREAK_BONUSES) {
          if (currentStreak >= bonus.days && !appliedBonuses.has(`${bonus.days}-${Math.floor(currentStreak / bonus.days)}`)) {
            totalBonus += bonus.bonus
            appliedBonuses.add(`${bonus.days}-${Math.floor(currentStreak / bonus.days)}`)
            dayData.bonusPoints += bonus.bonus
          }
        }
      } else {
        currentStreak = 0
      }
      
      dayData.streakDay = currentStreak
    })

    return totalBonus
  }

  /**
   * Calculate streak days for each day in the period
   */
  private static calculateStreakDays(dailyPerformance: Map<string, any>): void {
    const sortedDays = Array.from(dailyPerformance.entries()).sort((a, b) => 
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    )

    let currentStreak = 0
    sortedDays.forEach(([_, dayData]) => {
      if (dayData.completed) {
        currentStreak++
      } else {
        currentStreak = 0
      }
      dayData.streakDay = currentStreak
    })
  }

  /**
   * Get previous period for trend calculation
   */
  private static async getPreviousPeriod(userId: string, currentStartDate: Date, periodNumber: 1 | 2): Promise<any> {
    let previousStart: Date
    let previousPeriodNumber: 1 | 2

    if (periodNumber === 1) {
      // Previous period is second half of previous month
      const prevMonth = new Date(currentStartDate)
      prevMonth.setMonth(prevMonth.getMonth() - 1)
      previousStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 16)
      previousPeriodNumber = 2
    } else {
      // Previous period is first half of current month
      previousStart = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), 1)
      previousPeriodNumber = 1
    }

    return await HonorScore.findOne({
      userId,
      'period.startDate': previousStart,
      'period.periodNumber': previousPeriodNumber
    })
  }

  /**
   * Calculate trends and improvements
   */
  private static calculateTrends(currentScore: number, previousPeriod: any, dailyPerformance: Map<string, any>): any {
    const previousScore = previousPeriod?.calculation.honorScore || 0
    const improvement = currentScore - previousScore
    
    // Calculate consistency rate
    const totalDays = dailyPerformance.size
    const completedDays = Array.from(dailyPerformance.values()).filter(day => day.completed).length
    const consistencyRate = Math.round((completedDays / totalDays) * 100)

    return {
      previousScore,
      improvement,
      consistencyRate
    }
  }

  /**
   * Format daily logs for storage
   */
  private static formatDailyLogs(dailyPerformance: Map<string, any>): any[] {
    return Array.from(dailyPerformance.values()).map(day => ({
      date: day.date,
      completed: day.completed,
      weight: day.weight,
      streakDay: day.streakDay,
      bonusPoints: day.bonusPoints
    }))
  }

  /**
   * Get current period dates
   */
  static getCurrentPeriod(): { startDate: Date; endDate: Date; periodNumber: 1 | 2 } {
    const now = new Date()
    const currentDay = now.getDate()
    
    if (currentDay <= 15) {
      // First half of month
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 15),
        periodNumber: 1
      }
    } else {
      // Second half of month
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 16),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0), // Last day of month
        periodNumber: 2
      }
    }
  }

  /**
   * Log daily habit completion
   */
  static async logHabitCompletion(
    userId: string, 
    habitId: string, 
    completed: boolean, 
    weight: number = 1,
    notes?: string,
    proofUrl?: string
  ): Promise<any> {
    await connectDB()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate current streak
    const streak = await this.calculateCurrentStreak(userId, habitId, today)
    
    // Calculate honor points for this completion
    const honorPoints = completed ? weight : -weight

    const log = await DailyHabitLog.findOneAndUpdate(
      { userId, habitId, date: today },
      {
        userId,
        habitId,
        date: today,
        completed,
        completedAt: completed ? new Date() : undefined,
        weight,
        streakCount: completed ? streak + 1 : 0,
        notes,
        proofUrl,
        honorPoints
      },
      { upsert: true, new: true }
    )

    // Update user's total honor points immediately
    await User.findByIdAndUpdate(userId, {
      $inc: { honorPoints: honorPoints }
    })

    return log
  }

  /**
   * Calculate current streak for a habit
   */
  private static async calculateCurrentStreak(userId: string, habitId: string, currentDate: Date): Promise<number> {
    const logs = await DailyHabitLog.find({
      userId,
      habitId,
      date: { $lt: currentDate }
    }).sort({ date: -1 }).limit(30)

    let streak = 0
    for (const log of logs) {
      if (log.completed) {
        streak++
      } else {
        break
      }
    }

    return streak
  }
}
