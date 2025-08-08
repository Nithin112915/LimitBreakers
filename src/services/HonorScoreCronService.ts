import cron from 'node-cron'
import { HonorScoreCalculator } from '../services/HonorScoreCalculator'
import { User } from '../models/User'
import connectDB from '../lib/mongodb'

export class HonorScoreCronService {
  private static isRunning = false

  /**
   * Initialize cron jobs for honor score calculations
   */
  static initialize() {
    if (this.isRunning) return
    
    // Run twice monthly: 15th and last day of month at 23:59
    cron.schedule('59 23 15 * *', async () => {
      console.log('Running mid-month honor score calculation...')
      await this.calculateAllUsersHonorScores(1)
    })

    cron.schedule('59 23 28-31 * *', async () => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      
      // Only run on last day of month
      if (tomorrow.getDate() === 1) {
        console.log('Running end-of-month honor score calculation...')
        await this.calculateAllUsersHonorScores(2)
      }
    })

    // Daily calculation for immediate feedback (optional)
    cron.schedule('0 0 * * *', async () => {
      console.log('Running daily honor score updates...')
      await this.updateCurrentPeriodScores()
    })

    this.isRunning = true
    console.log('Honor Score Cron Service initialized')
  }

  /**
   * Calculate honor scores for all users for a specific period
   */
  private static async calculateAllUsersHonorScores(periodNumber: 1 | 2) {
    try {
      await connectDB()
      
      const today = new Date()
      let startDate: Date, endDate: Date

      if (periodNumber === 1) {
        // First half of month (1st to 15th)
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 15)
      } else {
        // Second half of month (16th to last day)
        startDate = new Date(today.getFullYear(), today.getMonth(), 16)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      }

      // Get all active users
      const users = await User.find({ 
        $or: [
          { lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Active in last 30 days
          { createdAt: { $gte: startDate } } // New users in this period
        ]
      })

      console.log(`Calculating honor scores for ${users.length} users for period ${periodNumber}`)

      const results = []
      for (const user of users) {
        try {
          const honorScore = await HonorScoreCalculator.calculateHonorScore(
            user._id.toString(),
            startDate,
            endDate,
            periodNumber
          )
          results.push({
            userId: user._id,
            username: user.username || user.name,
            honorScore: honorScore.calculation.honorScore,
            improvement: honorScore.trends.improvement
          })
        } catch (error) {
          console.error(`Error calculating honor score for user ${user._id}:`, error)
        }
      }

      // Sort by honor score for potential leaderboard updates
      results.sort((a, b) => b.honorScore - a.honorScore)

      console.log(`Honor score calculation completed. Top 5 users:`)
      results.slice(0, 5).forEach((result, index) => {
        console.log(`${index + 1}. ${result.username}: ${result.honorScore} (${result.improvement >= 0 ? '+' : ''}${result.improvement})`)
      })

      // Optional: Send notifications to top performers
      await this.notifyTopPerformers(results.slice(0, 10))

      return results
    } catch (error) {
      console.error('Error in calculateAllUsersHonorScores:', error)
    }
  }

  /**
   * Update current period scores for immediate feedback
   */
  private static async updateCurrentPeriodScores() {
    try {
      await connectDB()
      
      const currentPeriod = HonorScoreCalculator.getCurrentPeriod()
      
      // Get users who were active today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const activeUsers = await User.find({
        lastActive: { $gte: today }
      })

      console.log(`Updating current period scores for ${activeUsers.length} active users`)

      for (const user of activeUsers) {
        try {
          await HonorScoreCalculator.calculateHonorScore(
            user._id.toString(),
            currentPeriod.startDate,
            currentPeriod.endDate,
            currentPeriod.periodNumber
          )
        } catch (error) {
          console.error(`Error updating score for user ${user._id}:`, error)
        }
      }

      console.log('Current period score updates completed')
    } catch (error) {
      console.error('Error in updateCurrentPeriodScores:', error)
    }
  }

  /**
   * Notify top performers (optional feature)
   */
  private static async notifyTopPerformers(topUsers: any[]) {
    try {
      const { Notification } = await import('../models/Notification')
      
      // Notify top 3 performers
      for (let i = 0; i < Math.min(3, topUsers.length); i++) {
        const user = topUsers[i]
        const rank = i + 1
        
        let title = ''
        let message = ''
        
        switch (rank) {
          case 1:
            title = '🏆 Honor Score Champion!'
            message = `Congratulations! You're #1 with ${user.honorScore} honor points this period!`
            break
          case 2:
            title = '🥈 Outstanding Performance!'
            message = `Amazing work! You're #2 with ${user.honorScore} honor points this period!`
            break
          case 3:
            title = '🥉 Excellent Achievement!'
            message = `Well done! You're #3 with ${user.honorScore} honor points this period!`
            break
        }

        await Notification.create({
          userId: user.userId,
          type: 'achievement',
          title,
          message,
          data: {
            rank,
            honorScore: user.honorScore,
            improvement: user.improvement
          }
        })
      }

      console.log(`Notifications sent to top ${Math.min(3, topUsers.length)} performers`)
    } catch (error) {
      console.error('Error sending notifications:', error)
    }
  }

  /**
   * Manual trigger for honor score calculation (for testing)
   */
  static async manualCalculation(periodNumber?: 1 | 2) {
    if (periodNumber) {
      return await this.calculateAllUsersHonorScores(periodNumber)
    } else {
      return await this.updateCurrentPeriodScores()
    }
  }

  /**
   * Stop all cron jobs
   */
  static stop() {
    const tasks = cron.getTasks()
    tasks.forEach((task: any) => task.stop())
    this.isRunning = false
    console.log('Honor Score Cron Service stopped')
  }
}

// Auto-initialize in production
if (process.env.NODE_ENV === 'production') {
  HonorScoreCronService.initialize()
}
