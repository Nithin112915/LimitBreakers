// Notification System for LimitBreakers
import { Task } from '../models/Task'
import type { ITask } from '../models/Task'

export interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

export interface HabitReminder {
  habitId: string
  habitTitle: string
  time: string
  message: string
  isEnabled: boolean
}

export class NotificationManager {
  private static instance: NotificationManager
  private notificationPermission: NotificationPermission = {
    granted: false,
    denied: false,
    default: true
  }
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map()

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      this.notificationPermission.granted = true
      return true
    }

    if (Notification.permission === 'denied') {
      this.notificationPermission.denied = true
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.notificationPermission.granted = permission === 'granted'
      this.notificationPermission.denied = permission === 'denied'
      this.notificationPermission.default = permission === 'default'
      
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  scheduleHabitReminder(habit: any): void {
    if (!this.notificationPermission.granted || !habit.reminders?.length) {
      return
    }

    habit.reminders.forEach((reminder: any) => {
      if (!reminder.isEnabled || !reminder.time) return

      const reminderKey = `${habit._id}-${reminder.time}`
      
      // Clear existing notification for this habit and time
      this.clearNotification(reminderKey)

      // Calculate next notification time
      const nextNotificationTime = this.calculateNextNotificationTime(reminder.time)
      
      if (nextNotificationTime) {
        const timeoutId = setTimeout(() => {
          this.showHabitNotification(habit, reminder)
          // Reschedule for the next day
          this.scheduleHabitReminder(habit)
        }, nextNotificationTime - Date.now())

        this.scheduledNotifications.set(reminderKey, timeoutId)
      }
    })
  }

  private calculateNextNotificationTime(timeString: string): number | null {
    const now = new Date()
    const [hours, minutes] = timeString.split(':').map(Number)
    
    const nextNotification = new Date()
    nextNotification.setHours(hours, minutes, 0, 0)
    
    // If the time has already passed today, schedule for tomorrow
    if (nextNotification <= now) {
      nextNotification.setDate(nextNotification.getDate() + 1)
    }
    
    return nextNotification.getTime()
  }

  private showHabitNotification(habit: any, reminder: any): void {
    if (!this.notificationPermission.granted) return

    const notification = new Notification(`🎯 ${habit.title}`, {
      body: `Time to complete your habit! +${habit.honorPointsReward} Honor Points waiting.`,
      icon: '/icons/habit-reminder.png',
      tag: `habit-${habit._id}`,
      requireInteraction: true
    })

    notification.onclick = () => {
      window.focus()
      window.location.href = `/habits/${habit._id}`
      notification.close()
    }

    // Auto-close after 30 seconds
    setTimeout(() => {
      notification.close()
    }, 30000)
  }

  scheduleAllHabitReminders(habits: any[]): void {
    // Clear all existing notifications
    this.clearAllNotifications()

    // Schedule reminders for all active habits
    habits.forEach(habit => {
      if (habit.isActive) {
        this.scheduleHabitReminder(habit)
      }
    })
  }

  clearNotification(reminderKey: string): void {
    const timeoutId = this.scheduledNotifications.get(reminderKey)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.scheduledNotifications.delete(reminderKey)
    }
  }

  clearAllNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    this.scheduledNotifications.clear()
  }

  // Browser notification for achievements
  showAchievementNotification(title: string, message: string, honorPoints: number): void {
    if (!this.notificationPermission.granted) return

    new Notification(`🏆 ${title}`, {
      body: `${message} +${honorPoints} Honor Points earned!`,
      icon: '/icons/achievement.png',
      tag: 'achievement'
    })
  }

  // Browser notification for streaks
  showStreakNotification(streak: number, habitTitle: string): void {
    if (!this.notificationPermission.granted) return

    new Notification(`🔥 ${streak} Day Streak!`, {
      body: `Amazing! You've maintained your "${habitTitle}" habit for ${streak} days straight!`,
      icon: '/icons/streak.png',
      tag: 'streak'
    })
  }

  // In-app toast notifications
  showToastNotification(type: 'success' | 'error' | 'info' | 'warning', message: string): void {
    // This will integrate with react-hot-toast
    const event = new CustomEvent('show-toast', {
      detail: { type, message }
    })
    window.dispatchEvent(event)
  }
}

// Utility functions for habit timing
export function getUpcomingHabits(habits: any[]): any[] {
  const now = new Date()
  const today = now.toDateString()
  
  return habits
    .filter(habit => habit.isActive && habit.reminders?.length > 0)
    .map(habit => {
      const nextReminder = habit.reminders.find((r: any) => r.isEnabled)
      if (!nextReminder) return null
      
      const [hours, minutes] = nextReminder.time.split(':').map(Number)
      const reminderTime = new Date()
      reminderTime.setHours(hours, minutes, 0, 0)
      
      // If time has passed today, set for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1)
      }
      
      const timeUntil = Math.round((reminderTime.getTime() - now.getTime()) / (1000 * 60 * 60))
      
      return {
        ...habit,
        nextReminderTime: reminderTime,
        timeUntil: timeUntil < 24 ? `${timeUntil}h` : `${Math.round(timeUntil / 24)}d`,
        reminderSet: true
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.nextReminderTime - b.nextReminderTime)
}

export function isHabitCompletedToday(habit: any): boolean {
  const today = new Date().toDateString()
  return habit.completions?.some((completion: any) => 
    new Date(completion.date).toDateString() === today
  )
}

export function calculateCurrentStreak(habit: any): number {
  if (!habit.completions?.length) return 0
  
  const sortedCompletions = habit.completions
    .map((c: any) => new Date(c.date))
    .sort((a: Date, b: Date) => b.getTime() - a.getTime())
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i])
    completionDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

// Initialize notification manager
export const notificationManager = NotificationManager.getInstance()
