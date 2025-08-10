// Service Worker for Background Notifications
const CACHE_NAME = 'limitbreakers-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/habits',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache opened')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Background sync for habit reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'habit-reminder') {
    event.waitUntil(sendHabitReminder())
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  const data = notification.data

  notification.close()

  if (event.action === 'complete') {
    // Open app to habit completion page
    event.waitUntil(
      clients.openWindow(`/habits?complete=${data.habitId}`)
    )
  } else if (event.action === 'snooze') {
    // Schedule snooze notification
    scheduleSnoozeNotification(data.habitId, data.habitTitle)
  } else {
    // Default click - open the app
    event.waitUntil(
      clients.openWindow(data.url || '/habits')
    )
  }
})

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icons/habit-icon.png',
      badge: '/icons/badge-icon.png',
      tag: data.tag,
      data: data.data,
      requireInteraction: true,
      actions: [
        {
          action: 'complete',
          title: '✅ Complete'
        },
        {
          action: 'snooze',
          title: '⏰ Snooze'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Helper function to send habit reminder
async function sendHabitReminder() {
  try {
    // This would typically fetch data from your API
    // For now, we'll just show a generic reminder
    const options = {
      body: 'Don\'t forget to complete your habits today!',
      icon: '/icons/habit-icon.png',
      badge: '/icons/badge-icon.png',
      tag: 'daily-reminder',
      requireInteraction: false
    }

    await self.registration.showNotification('🎯 Habit Reminder', options)
  } catch (error) {
    console.error('Error sending habit reminder:', error)
  }
}

// Helper function for snooze notifications
function scheduleSnoozeNotification(habitId, habitTitle) {
  // Schedule a notification for 10 minutes later
  setTimeout(() => {
    const options = {
      body: `Time to complete: ${habitTitle}`,
      icon: '/icons/habit-icon.png',
      badge: '/icons/badge-icon.png',
      tag: `habit-snooze-${habitId}`,
      data: { habitId, habitTitle },
      requireInteraction: true
    }

    self.registration.showNotification('⏰ Snooze Reminder', options)
  }, 10 * 60 * 1000) // 10 minutes
}
