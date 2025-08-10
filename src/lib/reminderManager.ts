// Browser Notification and Reminder System
interface Habit {
  _id: string
  title: string
  reminders: Array<{
    time: string
    isEnabled: boolean
    snoozeEnabled?: boolean
  }>
  category: string
  honorPointsReward: number
}

interface ScheduledReminder {
  habitId: string
  habitTitle: string
  time: string
  timeoutId: number
}

class ReminderManager {
  private scheduledReminders: Map<string, ScheduledReminder> = new Map()
  private notificationPermission: NotificationPermission = 'default'
  private isServiceWorkerRegistered = false

  constructor() {
    this.checkNotificationSupport()
    this.registerServiceWorker()
  }

  private checkNotificationSupport(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
  }

  private async registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        this.isServiceWorkerRegistered = true
        console.log('✅ Service Worker registered for notifications')
        return registration
      } catch (error) {
        console.warn('⚠️ Service Worker registration failed:', error)
        return null
      }
    }
    return null
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !this.checkNotificationSupport()) {
        console.warn('⚠️ Notifications not supported in this environment')
        return false
      }

      if (this.notificationPermission === 'granted') {
        return true
      }

      const permission = await Notification.requestPermission()
      this.notificationPermission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error)
      return false
    }
  }

  getPermissionStatus(): NotificationPermission {
    return this.notificationPermission
  }

  scheduleHabitReminders(habits: Habit[]) {
    // Clear existing reminders
    this.clearAllReminders()

    for (const habit of habits) {
      if (!habit.reminders || habit.reminders.length === 0) continue

      for (const reminder of habit.reminders) {
        if (!reminder.isEnabled || !reminder.time) continue

        this.scheduleReminder(habit, reminder.time)
      }
    }

    console.log(`📅 Scheduled ${this.scheduledReminders.size} habit reminders`)
  }

  private scheduleReminder(habit: Habit, reminderTime: string) {
    try {
      const now = new Date()
      const [hours, minutes] = reminderTime.split(':').map(Number)
      
      // Create reminder for today
      const todayReminder = new Date()
      todayReminder.setHours(hours, minutes, 0, 0)

      // If time has passed today, schedule for tomorrow
      if (todayReminder <= now) {
        todayReminder.setDate(todayReminder.getDate() + 1)
      }

      const timeUntilReminder = todayReminder.getTime() - now.getTime()
      
      const timeoutId = window.setTimeout(() => {
        this.triggerReminder(habit)
        // Reschedule for next day
        this.scheduleReminder(habit, reminderTime)
      }, timeUntilReminder)

      const reminderKey = `${habit._id}-${reminderTime}`
      this.scheduledReminders.set(reminderKey, {
        habitId: habit._id,
        habitTitle: habit.title,
        time: reminderTime,
        timeoutId
      })

      console.log(`⏰ Reminder set for "${habit.title}" at ${reminderTime} (in ${Math.round(timeUntilReminder / 1000 / 60)} minutes)`)
      
    } catch (error) {
      console.error('❌ Error scheduling reminder:', error)
    }
  }

  private async triggerReminder(habit: Habit) {
    console.log(`🔔 Triggering reminder for: ${habit.title}`)

    // Show browser notification
    await this.showNotification(habit)

    // Show in-app notification if page is visible
    if (document.visibilityState === 'visible') {
      this.showInAppNotification(habit)
    }

    // Play notification sound
    this.playNotificationSound()
  }

  private async showNotification(habit: Habit) {
    if (this.notificationPermission !== 'granted') return

    try {
      const notification = new Notification(`🎯 Time for: ${habit.title}`, {
        body: `Complete your ${habit.category.toLowerCase()} habit and earn ${habit.honorPointsReward} honor points!`,
        icon: '/icons/habit-icon.png',
        badge: '/icons/badge-icon.png',
        tag: `habit-${habit._id}`,
        requireInteraction: true,
        data: {
          habitId: habit._id,
          habitTitle: habit.title,
          url: `/habits?complete=${habit._id}`
        }
      })

      notification.onclick = () => {
        window.focus()
        window.location.href = `/habits?complete=${habit._id}`
        notification.close()
      }

      // Auto-close after 30 seconds
      setTimeout(() => {
        notification.close()
      }, 30000)

    } catch (error) {
      console.error('❌ Error showing notification:', error)
    }
  }

  private showInAppNotification(habit: Habit) {
    // Create a custom toast notification
    const toastElement = document.createElement('div')
    toastElement.className = 'fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-indigo-200 p-4 max-w-sm animate-slide-in'
    toastElement.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-12"></path>
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">
            🎯 Habit Reminder
          </p>
          <p class="text-sm text-gray-700 mt-1">
            Time for: <strong>${habit.title}</strong>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Earn ${habit.honorPointsReward} honor points!
          </p>
          <div class="mt-3 flex space-x-2">
            <button onclick="window.location.href='/habits?complete=${habit._id}'" 
                    class="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
              Complete Now
            </button>
            <button onclick="this.closest('.fixed').remove()" 
                    class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(toastElement)

    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.remove()
      }
    }, 15000)
  }

  private playNotificationSound() {
    try {
      // Create a subtle notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('⚠️ Could not play notification sound:', error)
    }
  }

  snoozeReminder(habitId: string, minutes: number = 10) {
    const reminders = Array.from(this.scheduledReminders.values())
    const reminder = reminders.find(r => r.habitId === habitId)
    
    if (reminder) {
      // Clear current reminder
      clearTimeout(reminder.timeoutId)
      
      // Schedule new reminder for snooze time
      const snoozeTime = new Date(Date.now() + minutes * 60 * 1000)
      const newTimeoutId = window.setTimeout(() => {
        // Find the habit and trigger reminder
        // This would need access to the habit data
        console.log(`⏰ Snooze ended for habit: ${reminder.habitTitle}`)
      }, minutes * 60 * 1000)
      
      reminder.timeoutId = newTimeoutId
      console.log(`😴 Reminder snoozed for ${minutes} minutes: ${reminder.habitTitle}`)
    }
  }

  clearAllReminders() {
    this.scheduledReminders.forEach(reminder => {
      clearTimeout(reminder.timeoutId)
    })
    this.scheduledReminders.clear()
    console.log('🧹 All reminders cleared')
  }

  getActiveReminders(): ScheduledReminder[] {
    return Array.from(this.scheduledReminders.values())
  }

  // Get upcoming reminders for today
  getTodaysReminders(habits: Habit[]): Array<{habit: Habit, reminderTime: string, timeUntil: number}> {
    const now = new Date()
    const upcomingReminders = []

    for (const habit of habits) {
      if (!habit.reminders) continue

      for (const reminder of habit.reminders) {
        if (!reminder.isEnabled || !reminder.time) continue

        const [hours, minutes] = reminder.time.split(':').map(Number)
        const reminderToday = new Date()
        reminderToday.setHours(hours, minutes, 0, 0)

        if (reminderToday > now) {
          upcomingReminders.push({
            habit,
            reminderTime: reminder.time,
            timeUntil: reminderToday.getTime() - now.getTime()
          })
        }
      }
    }

    return upcomingReminders.sort((a, b) => a.timeUntil - b.timeUntil)
  }

  async sendTestNotification(): Promise<void> {
    try {
      const testHabit: Habit = {
        _id: 'test-habit',
        title: 'Test Habit',
        category: 'other',
        honorPointsReward: 10,
        reminders: []
      }

      if (this.notificationPermission === 'granted') {
        await this.showNotification(testHabit)
        console.log('✅ Test notification sent via browser')
      } else {
        // Show in-app notification if browser notifications are not available
        this.showInAppNotification(testHabit)
        console.log('✅ Test notification sent via in-app notification')
      }
    } catch (error) {
      console.error('❌ Error sending test notification:', error)
      throw error
    }
  }
}

// Create singleton instance only on client side
export const reminderManager = typeof window !== 'undefined' ? new ReminderManager() : null

// Utility functions
export const formatTimeUntil = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

export const isHabitCompletedToday = (habit: any): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return habit.completions?.some((completion: any) => 
    completion.date.startsWith(today)
  ) || false
}

// Add CSS for animations only on client side
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)
}
