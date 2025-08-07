'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface StreakCalendarProps {
  className?: string
}

export function StreakCalendar({ className = '' }: StreakCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Mock data for habit completions
  const mockCompletions: Record<string, number> = {
    '2024-12-01': 2,
    '2024-12-02': 3,
    '2024-12-03': 1,
    '2024-12-05': 2,
    '2024-12-06': 3,
    '2024-12-07': 1,
    '2024-12-09': 2,
    '2024-12-10': 3,
    '2024-12-11': 2,
    '2024-12-12': 1,
    '2024-12-14': 3,
    '2024-12-15': 2,
    '2024-12-16': 1,
    '2024-12-17': 2,
    '2024-12-19': 3,
    '2024-12-20': 1,
    '2024-12-21': 2,
    '2024-12-23': 3,
    '2024-12-24': 2,
    '2024-12-26': 1,
    '2024-12-28': 2,
    '2024-12-29': 3,
    '2024-12-30': 1,
    '2025-01-02': 2,
    '2025-01-03': 3,
    '2025-01-04': 1,
    '2025-01-06': 2,
    '2025-01-07': 3,
    '2025-01-08': 2,
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getIntensityColor = (completions: number) => {
    if (completions === 0) return 'bg-gray-100 hover:bg-gray-200'
    if (completions === 1) return 'bg-green-200 hover:bg-green-300'
    if (completions === 2) return 'bg-green-300 hover:bg-green-400'
    if (completions === 3) return 'bg-green-400 hover:bg-green-500'
    return 'bg-green-500 hover:bg-green-600'
  }

  const getCompletions = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return mockCompletions[dateKey] || 0
  }

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const totalCompletions = Object.values(mockCompletions).reduce((sum, count) => sum + count, 0)
  const activeDays = Object.keys(mockCompletions).length
  const currentStreak = 5 // Mock current streak

  return (
    <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Activity Calendar</h3>
          <p className="text-sm text-gray-600">Track your daily habit completions</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="text-2xl font-bold text-emerald-600">{totalCompletions}</div>
          <div className="text-xs text-gray-600">Total Completions</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-2xl font-bold text-blue-600">{activeDays}</div>
          <div className="text-xs text-gray-600">Active Days</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
          <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
          <div className="text-xs text-gray-600">Current Streak</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="w-8 h-8" />
          ))}
          
          {/* Month days */}
          {monthDays.map((day) => {
            const completions = getCompletions(day)
            const isCurrentDay = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  w-8 h-8 rounded-md transition-all duration-200 cursor-pointer relative
                  ${getIntensityColor(completions)}
                  ${isCurrentDay ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
                `}
                title={`${format(day, 'MMM d')}: ${completions} habits completed`}
              >
                {isCurrentDay && (
                  <div className="absolute inset-0 rounded-md border-2 border-indigo-500 animate-pulse" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
          </div>
          <span>More</span>
        </div>
        <div className="text-xs text-gray-500">
          Inspired by GitHub contribution graph
        </div>
      </div>
    </div>
  )
}
