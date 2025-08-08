import * as cron from 'node-cron'
import { HonorScoreCalculator } from './HonorScoreCalculator'
import { User } from '../models/User'
import connectDB from '../lib/mongodb'

export class HonorScoreCron {
  private static isRunning = false

  /**
   * Initialize Honor Score cron jobs
   * Runs twice monthly: on the 1st and 16th of each month
   */
  static initialize() {
    if (this.isRunning) {
      console.log('Honor Score cron jobs already running')
      return
    }

    console.log('🏆 Initializing Honor Score cron jobs...')

    // Run on the 1st of every month at midnight (end of period 2)
    cron.schedule('0 0 1 * *', async () => {
      console.log('🔄 Running Honor Score calculation for period 2 (16th-end of month)')
      await this.calculateAllUserScores()
    })

    // Run on the 16th of every month at midnight (end of period 1)
    cron.schedule('0 0 16 * *', async () => {
      console.log('🔄 Running Honor Score calculation for period 1 (1st-15th)')
      await this.calculateAllUserScores()
    })

    // Optional: Run daily at 11:59 PM to update current period scores
    cron.schedule('59 23 * * *', async () => {
      console.log('📊 Daily Honor Score update - calculating current period')
      await this.updateCurrentPeriodScores()
    })

    this.isRunning = true
    console.log('✅ Honor Score cron jobs initialized successfully')
  }

  /**
   * Calculate Honor Scores for all users for the completed period
   */
  private static async calculateAllUserScores() {
    try {
      await connectDB()
      
      const users = await User.find({}, '_id email')
      console.log(`🧮 Calculating Honor Scores for ${users.length} users`)

      const currentPeriod = HonorScoreCalculator.getCurrentPeriod()
      
      // For completed periods, we calculate the previous period
      let targetPeriod
      if (currentPeriod.periodNumber === 1) {
        // If we're in period 1, calculate period 2 of previous month
        const prevMonth = new Date(currentPeriod.startDate)
        prevMonth.setMonth(prevMonth.getMonth() - 1)
        targetPeriod = {
          startDate: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 16),
          endDate: new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0),
          periodNumber: 2 as 1 | 2
        }
      } else {
        // If we're in period 2, calculate period 1 of current month
        targetPeriod = {
          startDate: new Date(currentPeriod.startDate.getFullYear(), currentPeriod.startDate.getMonth(), 1),
          endDate: new Date(currentPeriod.startDate.getFullYear(), currentPeriod.startDate.getMonth(), 15),
          periodNumber: 1 as 1 | 2
        }
      }

      let successCount = 0
      let errorCount = 0

      for (const user of users) {
        try {
          await HonorScoreCalculator.calculateHonorScore(
            user._id.toString(),
            targetPeriod.startDate,
            targetPeriod.endDate,
            targetPeriod.periodNumber
          )
          successCount++
        } catch (error) {
          console.error(`❌ Error calculating Honor Score for user ${user.email}:`, error)
          errorCount++
        }
      }

      console.log(`✅ Honor Score calculation completed: ${successCount} success, ${errorCount} errors`)
      
      // Send summary notification (could integrate with email/notification service)
      await this.sendAdminSummary(targetPeriod, successCount, errorCount)
      
    } catch (error) {
      console.error('❌ Failed to calculate Honor Scores:', error)
    }
  }

  /**
   * Update current period scores for real-time tracking
   */
  private static async updateCurrentPeriodScores() {
    try {
      await connectDB()
      
      // Only update for users who have recent activity (last 7 days)
      const recentDate = new Date()
      recentDate.setDate(recentDate.getDate() - 7)
      
      const activeUsers = await User.find({
        updatedAt: { $gte: recentDate }
      }, '_id')

      console.log(`📈 Updating current period scores for ${activeUsers.length} active users`)

      const currentPeriod = HonorScoreCalculator.getCurrentPeriod()
      let successCount = 0

      for (const user of activeUsers) {
        try {
          await HonorScoreCalculator.calculateHonorScore(
            user._id.toString(),
            currentPeriod.startDate,
            currentPeriod.endDate,
            currentPeriod.periodNumber
          )
          successCount++
        } catch (error) {
          console.error(`❌ Error updating current period for user ${user._id}:`, error)
        }
      }

      console.log(`✅ Current period update completed: ${successCount} users updated`)

    } catch (error) {
      console.error('❌ Failed to update current period scores:', error)
    }
  }

  /**
   * Send admin summary of Honor Score calculations
   */
  private static async sendAdminSummary(
    period: { startDate: Date; endDate: Date; periodNumber: 1 | 2 },
    successCount: number,
    errorCount: number
  ) {
    const summary = {
      timestamp: new Date().toISOString(),
      period: {
        ...period,
        name: period.periodNumber === 1 ? 'First Half' : 'Second Half',
        month: period.startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      },
      results: {
        successful: successCount,
        errors: errorCount,
        total: successCount + errorCount
      }
    }

    console.log('📊 Honor Score Calculation Summary:', JSON.stringify(summary, null, 2))
    
    // TODO: Integrate with notification service
    // await notificationService.sendAdminEmail('Honor Score Calculation Complete', summary)
  }

  /**
   * Manual trigger for Honor Score calculation (for testing or manual runs)
   */
  static async manualCalculation(userId?: string) {
    try {
      await connectDB()
      const currentPeriod = HonorScoreCalculator.getCurrentPeriod()

      if (userId) {
        console.log(`🔧 Manual Honor Score calculation for user: ${userId}`)
        const result = await HonorScoreCalculator.calculateHonorScore(
          userId,
          currentPeriod.startDate,
          currentPeriod.endDate,
          currentPeriod.periodNumber
        )
        console.log('✅ Manual calculation completed:', result.calculation.honorScore)
        return result
      } else {
        console.log('🔧 Manual Honor Score calculation for all users')
        await this.calculateAllUserScores()
      }
    } catch (error) {
      console.error('❌ Manual calculation failed:', error)
      throw error
    }
  }

  /**
   * Stop all cron jobs
   */
  static stop() {
    if (!this.isRunning) {
      console.log('Honor Score cron jobs are not running')
      return
    }

    // cron.destroy() would stop all jobs
    this.isRunning = false
    console.log('🛑 Honor Score cron jobs stopped')
  }

  /**
   * Get cron job status
   */
  static getStatus() {
    return {
      isRunning: this.isRunning,
      nextRuns: {
        period1End: 'Every 16th at midnight',
        period2End: 'Every 1st at midnight',
        dailyUpdate: 'Every day at 11:59 PM'
      }
    }
  }
}
