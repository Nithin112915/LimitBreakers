// Enhanced notification system for task reminders with custom timing
'use client'

export interface TaskReminder {
  taskId: string
  taskTitle: string
  reminderTime: string // Format: "HH:MM"
  days: string[] // ["monday", "tuesday", etc.]
  isActive: boolean
  notificationText?: string
}

export interface TaskNotificationSettings {
  enabled: boolean
  sound: boolean
  vibration: boolean
  beforeMinutes: number // Notify X minutes before the scheduled time
}

class TaskNotificationManager {
  private notificationPermission: { granted: boolean } = { granted: false }
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map()
  private settings: TaskNotificationSettings = {
    enabled: true,
    sound: true,
    vibration: true,
    beforeMinutes: 5
  }

  constructor() {
    this.requestPermission()
    this.loadSettings()
  }

  private async requestPermission(): Promise<void> {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        this.notificationPermission.granted = permission === 'granted'
        
        if (this.notificationPermission.granted) {
          console.log('✅ Task notifications enabled')
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('taskNotificationSettings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }

  public updateSettings(newSettings: Partial<TaskNotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    localStorage.setItem('taskNotificationSettings', JSON.stringify(this.settings))
  }

  public getSettings(): TaskNotificationSettings {
    return { ...this.settings }
  }

  public scheduleTaskReminder(task: any): void {
    if (!this.notificationPermission.granted || !this.settings.enabled || !task.reminders?.length) {
      return
    }

    task.reminders.forEach((reminder: any) => {
      const reminderKey = `${task._id}-${reminder.time}`
      
      // Clear existing notification for this task and time
      this.clearNotification(reminderKey)

      // Calculate next notification time
      const nextNotificationTime = this.calculateNextNotificationTime(
        reminder.time, 
        reminder.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        this.settings.beforeMinutes
      )

      if (nextNotificationTime) {
        const timeUntilNotification = nextNotificationTime.getTime() - Date.now()
        
        if (timeUntilNotification > 0) {
          const timeoutId = setTimeout(() => {
            this.showTaskNotification(task, reminder)
            // Reschedule for next occurrence
            this.scheduleTaskReminder(task)
          }, timeUntilNotification)

          this.scheduledNotifications.set(reminderKey, timeoutId)
          
          console.log(`📅 Task reminder scheduled: "${task.title}" at ${nextNotificationTime.toLocaleString()}`)
        }
      }
    })
  }

  public scheduleAllTaskReminders(tasks: any[]): void {
    console.log(`📱 Scheduling notifications for ${tasks.length} tasks...`)
    tasks.forEach(task => {
      if (task.isActive && task.reminders?.length > 0) {
        this.scheduleTaskReminder(task)
      }
    })
  }

  private showTaskNotification(task: any, reminder: any): void {
    if (!this.notificationPermission.granted || !this.settings.enabled) return

    const customMessage = reminder.notificationText || `Time to complete your task! +${task.honorPointsReward || 10} Honor Points waiting.`
    
    const notification = new Notification(`🎯 ${task.title}`, {
      body: customMessage,
      icon: '/icons/task-reminder.png',
      tag: `task-${task._id}`,
      requireInteraction: true,
      silent: !this.settings.sound
    })

    // Handle notification clicks
    notification.onclick = () => {
      window.focus()
      // Navigate to tasks page
      if (typeof window !== 'undefined') {
        window.location.href = '/habits'
      }
      notification.close()
    }

    // Vibration for mobile devices
    if (this.settings.vibration && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)
  }

  private calculateNextNotificationTime(time: string, days: string[], beforeMinutes: number): Date | null {
    try {
      const [hours, minutes] = time.split(':').map(Number)
      const now = new Date()
      const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
      
      // Convert day names to numbers
      const dayMap: { [key: string]: number } = {
        'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6
      }
      
      const reminderDays = days.map(day => dayMap[day.toLowerCase()]).filter(d => d !== undefined)
      
      if (reminderDays.length === 0) return null

      // Find the next occurrence
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(now)
        checkDate.setDate(now.getDate() + i)
        checkDate.setHours(hours, minutes - beforeMinutes, 0, 0)
        
        const checkDay = checkDate.getDay()
        
        if (reminderDays.includes(checkDay) && checkDate > now) {
          return checkDate
        }
      }
      
      return null
    } catch (error) {
      console.error('Error calculating notification time:', error)
      return null
    }
  }

  public clearNotification(key: string): void {
    const timeoutId = this.scheduledNotifications.get(key)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.scheduledNotifications.delete(key)
    }
  }

  public clearAllNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    this.scheduledNotifications.clear()
    console.log('🔕 All task notifications cleared')
  }

  public getUpcomingReminders(tasks: any[]): Array<{
    taskId: string
    taskTitle: string
    nextReminder: Date
    timeUntil: string
  }> {
    const upcoming: Array<{
      taskId: string
      taskTitle: string
      nextReminder: Date
      timeUntil: string
    }> = []

    tasks.forEach(task => {
      if (task.isActive && task.reminders?.length > 0) {
        task.reminders.forEach((reminder: any) => {
          const nextTime = this.calculateNextNotificationTime(
            reminder.time,
            reminder.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            0
          )
          
          if (nextTime) {
            const timeUntil = this.formatTimeUntil(nextTime)
            upcoming.push({
              taskId: task._id,
              taskTitle: task.title,
              nextReminder: nextTime,
              timeUntil
            })
          }
        })
      }
    })

    return upcoming.sort((a, b) => a.nextReminder.getTime() - b.nextReminder.getTime())
  }

  private formatTimeUntil(targetDate: Date): string {
    const now = new Date()
    const diffMs = targetDate.getTime() - now.getTime()
    
    if (diffMs < 0) return 'Past due'
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    } else {
      return `${diffMinutes}m`
    }
  }

  public isTaskCompletedToday(task: any): boolean {
    const today = new Date().toISOString().split('T')[0]
    return task.completionHistory?.some((entry: any) => 
      entry.date?.startsWith(today) || 
      (typeof entry.date === 'object' && entry.date.toISOString().startsWith(today))
    ) || false
  }

  // Mobile-specific features
  public sendMobileNotification(title: string, body: string, data?: any): void {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // For PWA/mobile app push notifications
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/icons/task-reminder.png',
          data,
          requireInteraction: true
        })
      })
    } else {
      // Fallback to regular notifications
      new Notification(title, { body, icon: '/icons/task-reminder.png' })
    }
  }
}

// Create singleton instance
export const taskNotificationManager = new TaskNotificationManager()

// Export utility functions
export const getUpcomingTasks = (tasks: any[]) => taskNotificationManager.getUpcomingReminders(tasks)
export const isTaskCompletedToday = (task: any) => taskNotificationManager.isTaskCompletedToday(task)
