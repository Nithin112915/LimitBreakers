'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  CalendarDaysIcon, 
  ChartBarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface HonorScoreData {
  currentPeriod: {
    startDate: string
    endDate: string
    periodNumber: 1 | 2
    honorScore: {
      calculation: {
        pointsEarned: number
        pointsLost: number
        rawScore: number
        maxPossiblePoints: number
        totalDaysCompleted: number
        totalDaysMissed: number
        averageWeight: number
        streakBonuses: number
        finalScore: number
        honorScore: number
      }
      trends: {
        previousScore: number
        improvement: number
        consistencyRate: number
      }
      dailyLogs: Array<{
        date: string
        completed: boolean
        weight: number
        streakDay: number
        bonusPoints: number
      }>
    }
  }
  history: any[]
  summary: {
    totalHonorPoints: number
    currentStreak: number
    bestScore: number
    averageScore: number
  }
}

export default function HonorScoreDashboard() {
  const [honorData, setHonorData] = useState<HonorScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHonorScore()
  }, [])

  const fetchHonorScore = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/honor-score')
      if (!response.ok) {
        throw new Error('Failed to fetch honor score')
      }
      const data = await response.json()
      setHonorData(data)
    } catch (error) {
      console.error('Error fetching honor score:', error)
      setError('Failed to load honor score data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600'
    if (score >= 600) return 'text-blue-600'
    if (score >= 400) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 800) return 'bg-green-50 border-green-200'
    if (score >= 600) return 'bg-blue-50 border-blue-200'
    if (score >= 400) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 border">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !honorData) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Failed to load honor score data'}
        </div>
      </div>
    )
  }

  const { currentPeriod, summary } = honorData
  const { calculation, trends, dailyLogs } = currentPeriod.honorScore

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Honor Score Dashboard</h2>
        <p className="text-gray-600">
          Period {currentPeriod.periodNumber}: {formatDate(currentPeriod.startDate)} - {formatDate(currentPeriod.endDate)}
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Honor Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg border-2 ${getScoreBgColor(calculation.honorScore)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Honor Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(calculation.honorScore)}`}>
                {calculation.honorScore}
              </p>
              <p className="text-xs text-gray-500">/ 1000</p>
            </div>
            <TrophyIcon className={`h-12 w-12 ${getScoreColor(calculation.honorScore)}`} />
          </div>
          {trends.improvement !== 0 && (
            <div className="mt-2 flex items-center">
              {trends.improvement > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trends.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trends.improvement > 0 ? '+' : ''}{trends.improvement} from last period
              </span>
            </div>
          )}
        </motion.div>

        {/* Consistency Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consistency Rate</p>
              <p className="text-3xl font-bold text-blue-600">{trends.consistencyRate}%</p>
              <p className="text-xs text-gray-500">Days completed</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-blue-600" />
          </div>
        </motion.div>

        {/* Streak Bonuses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Streak Bonuses</p>
              <p className="text-3xl font-bold text-orange-600">{calculation.streakBonuses}</p>
              <p className="text-xs text-gray-500">Bonus points earned</p>
            </div>
            <FireIcon className="h-12 w-12 text-orange-600" />
          </div>
        </motion.div>

        {/* Best Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Personal Best</p>
              <p className="text-3xl font-bold text-purple-600">{summary.bestScore}</p>
              <p className="text-xs text-gray-500">All-time high</p>
            </div>
            <SparklesIcon className="h-12 w-12 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Visual Summary Table - Following Your Specification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card mb-8"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Period Summary</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Interval</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Achievements (±)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Raw Score</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Scaled Honor Score</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Extras</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 bg-blue-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">
                    {currentPeriod.periodNumber === 1 ? 'First Half' : 'Second Half'} 
                    <span className="block text-xs text-gray-600">
                      {formatDate(currentPeriod.startDate)} - {formatDate(currentPeriod.endDate)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +{calculation.pointsEarned}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        -{calculation.pointsLost}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      ({calculation.totalDaysCompleted} days / {calculation.totalDaysMissed} missed)
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="font-bold text-lg text-gray-900">
                    {calculation.rawScore}
                  </div>
                  <div className="text-xs text-gray-600">
                    Earn - Miss = {calculation.pointsEarned} - {calculation.pointsLost}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className={`font-bold text-xl ${getScoreColor(calculation.honorScore)}`}>
                    {calculation.honorScore}
                  </div>
                  <div className="text-xs text-gray-600">
                    ({calculation.finalScore} / {calculation.maxPossiblePoints}) × 1000
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Avg Weight: {calculation.averageWeight}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="space-y-1">
                    {calculation.streakBonuses > 0 && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <FireIcon className="h-3 w-3 mr-1" />
                        +{calculation.streakBonuses} Streak
                      </div>
                    )}
                    {trends.improvement > 0 && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                        +{trends.improvement}
                      </div>
                    )}
                    {trends.improvement < 0 && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                        {trends.improvement}
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      {trends.consistencyRate}% consistent
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Previous Period for comparison */}
              {trends.previousScore > 0 && (
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-700">
                      Previous Period
                      <span className="block text-xs text-gray-500">
                        For comparison
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-gray-500 text-sm">—</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-gray-500 text-sm">—</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-gray-600">
                      {trends.previousScore}
                    </div>
                    <div className="text-xs text-gray-500">
                      Previous result
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-xs text-gray-500">
                      {trends.improvement > 0 ? '↗️ Improved' : trends.improvement < 0 ? '↘️ Decreased' : '→ Same'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Calculation Formula Display */}
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Formula Breakdown:</h4>
          <div className="text-sm text-indigo-800 space-y-1">
            <div>
              <strong>Raw Score:</strong> Points Earned ({calculation.pointsEarned}) - Points Lost ({calculation.pointsLost}) + Streak Bonuses ({calculation.streakBonuses}) = {calculation.finalScore}
            </div>
            <div>
              <strong>Honor Score:</strong> ({calculation.finalScore} ÷ {calculation.maxPossiblePoints}) × 1000 = <strong>{calculation.honorScore}</strong>
            </div>
            <div className="text-xs text-indigo-700 mt-2">
              💡 Each completed day = +{calculation.averageWeight} points (weighted by task importance), missed day = -{calculation.averageWeight} points (capped at 3 consecutive)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Score Calculation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points Earned</span>
              <span className="font-semibold text-green-600">+{calculation.pointsEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points Lost</span>
              <span className="font-semibold text-red-600">-{calculation.pointsLost}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Streak Bonuses</span>
              <span className="font-semibold text-orange-600">+{calculation.streakBonuses}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Raw Score</span>
              <span className="font-bold text-gray-900">{calculation.finalScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Honor Score (Scaled)</span>
              <span className={`font-bold text-xl ${getScoreColor(calculation.honorScore)}`}>
                {calculation.honorScore}/1000
              </span>
            </div>
          </div>
        </motion.div>

        {/* Daily Progress Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h3>
          <div className="grid grid-cols-5 gap-2">
            {dailyLogs.map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  day.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
                title={`${formatDate(day.date)}: ${day.completed ? 'Completed' : 'Missed'}${
                  day.streakDay > 0 ? ` (Streak: ${day.streakDay})` : ''
                }${day.bonusPoints > 0 ? ` (+${day.bonusPoints} bonus)` : ''}`}
              >
                {day.streakDay > 0 && day.completed ? day.streakDay : new Date(day.date).getDate()}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              Completed
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
              Missed
            </div>
          </div>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.totalHonorPoints}</p>
            <p className="text-sm text-gray-600">Total Honor Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{summary.averageScore}</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{honorData.history.length + 1}</p>
            <p className="text-sm text-gray-600">Periods Tracked</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
