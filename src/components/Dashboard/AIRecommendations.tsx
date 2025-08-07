'use client'

import { useState } from 'react'
import { 
  SparklesIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface Recommendation {
  id: number
  type: 'optimization' | 'motivation' | 'warning' | 'insight'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionText: string
  priority: number
}

interface AIRecommendationsProps {
  className?: string
}

export function AIRecommendations({ className = '' }: AIRecommendationsProps) {
  const [dismissedIds, setDismissedIds] = useState<number[]>([])
  const [implementedIds, setImplementedIds] = useState<number[]>([])

  const mockRecommendations: Recommendation[] = [
    {
      id: 1,
      type: 'optimization',
      title: 'Optimize Your Morning Routine',
      description: 'Based on your data, you\'re 78% more likely to complete habits when done before 9 AM. Consider moving your reading habit to morning.',
      impact: 'high',
      actionText: 'Reschedule Habit',
      priority: 1
    },
    {
      id: 2,
      type: 'warning',
      title: 'Workout Streak at Risk',
      description: 'You\'ve missed 2 workout sessions this week. Your 15-day streak might be in jeopardy. Consider a lighter workout today.',
      impact: 'high',
      actionText: 'Plan Workout',
      priority: 2
    },
    {
      id: 3,
      type: 'motivation',
      title: 'Excellent Reading Progress!',
      description: 'You\'ve completed 85% of your reading goals this month. You\'re on track to finish 2 books ahead of schedule!',
      impact: 'medium',
      actionText: 'View Progress',
      priority: 3
    },
    {
      id: 4,
      type: 'insight',
      title: 'Weekend Pattern Detected',
      description: 'Your habit completion rate drops 40% on weekends. Try setting up easier "weekend versions" of your habits.',
      impact: 'medium',
      actionText: 'Create Weekend Habits',
      priority: 4
    }
  ]

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'optimization':
        return SparklesIcon
      case 'warning':
        return ExclamationTriangleIcon
      case 'motivation':
        return HeartIcon
      case 'insight':
        return LightBulbIcon
      default:
        return SparklesIcon
    }
  }

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'optimization':
        return 'text-purple-600 bg-purple-100'
      case 'warning':
        return 'text-red-600 bg-red-100'
      case 'motivation':
        return 'text-green-600 bg-green-100'
      case 'insight':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getImpactColor = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const dismissRecommendation = (id: number) => {
    setDismissedIds([...dismissedIds, id])
  }

  const implementRecommendation = (id: number) => {
    setImplementedIds([...implementedIds, id])
  }

  const visibleRecommendations = mockRecommendations.filter(
    rec => !dismissedIds.includes(rec.id)
  )

  return (
    <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Personalized insights to improve your habits</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {visibleRecommendations.length} suggestions
        </div>
      </div>

      <div className="space-y-4">
        {visibleRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <SparklesIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No new recommendations available</p>
            <p className="text-sm">Check back later for more insights!</p>
          </div>
        ) : (
          visibleRecommendations.map((recommendation) => {
            const IconComponent = getTypeIcon(recommendation.type)
            const isImplemented = implementedIds.includes(recommendation.id)
            
            return (
              <div
                key={recommendation.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isImplemented
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white/50 border-gray-200 hover:bg-white/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(recommendation.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">
                            {recommendation.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(recommendation.impact)}`}>
                            {recommendation.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 ml-11">
                      {recommendation.description}
                    </p>
                    
                    {!isImplemented && (
                      <div className="flex items-center space-x-2 ml-11">
                        <button
                          onClick={() => implementRecommendation(recommendation.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span>{recommendation.actionText}</span>
                        </button>
                        <button
                          onClick={() => dismissRecommendation(recommendation.id)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Maybe Later
                        </button>
                      </div>
                    )}
                    
                    {isImplemented && (
                      <div className="flex items-center space-x-2 ml-11 text-green-600">
                        <CheckIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Implemented</span>
                      </div>
                    )}
                  </div>
                  
                  {!isImplemented && (
                    <button
                      onClick={() => dismissRecommendation(recommendation.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {implementedIds.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {implementedIds.length} recommendation{implementedIds.length !== 1 ? 's' : ''} implemented this week
            </span>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
