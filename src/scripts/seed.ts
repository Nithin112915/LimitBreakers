import dbConnect from '../lib/mongodb'
import { User } from '../models/User'
import { Habit } from '../models/Habit'

const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeQp5p5p5p5p5p5p5", // "password123"
    honorPoints: 2450,
    level: 5,
    streaks: {
      current: 12,
      longest: 28
    },
    achievements: [
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 10-day streak',
        unlockedAt: new Date('2024-12-20'),
        points: 50
      },
      {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Complete morning habits for 7 days',
        unlockedAt: new Date('2024-12-15'),
        points: 75
      }
    ],
    preferences: {
      notifications: {
        push: true,
        email: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        activityVisibility: 'friends'
      }
    }
  },
  {
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeQp5p5p5p5p5p5p5",
    honorPoints: 1850,
    level: 4,
    streaks: {
      current: 8,
      longest: 15
    },
    achievements: [
      {
        id: 'meditation-master',
        title: 'Meditation Master',
        description: 'Complete 30 days of meditation',
        unlockedAt: new Date('2024-12-18'),
        points: 150
      }
    ]
  }
]

const sampleHabits = [
  {
    title: 'Morning Run',
    description: 'Go for a 30-minute run every morning',
    category: 'fitness',
    difficulty: 'medium',
    honorPointsReward: 15,
    honorPointsPenalty: 7,
    frequency: {
      type: 'daily',
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    reminders: [
      {
        time: '06:00',
        message: 'Time for your morning run!',
        enabled: true
      }
    ],
    analytics: {
      totalCompletions: 45,
      currentStreak: 12,
      longestStreak: 28,
      successRate: 85,
      lastUpdated: new Date()
    }
  },
  {
    title: 'Read for 30 minutes',
    description: 'Read educational or inspirational books',
    category: 'learning',
    difficulty: 'easy',
    honorPointsReward: 10,
    honorPointsPenalty: 5,
    frequency: {
      type: 'daily',
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    analytics: {
      totalCompletions: 28,
      currentStreak: 8,
      longestStreak: 15,
      successRate: 90,
      lastUpdated: new Date()
    }
  },
  {
    title: 'Meditation',
    description: '10 minutes of mindful meditation',
    category: 'mindfulness',
    difficulty: 'easy',
    honorPointsReward: 10,
    honorPointsPenalty: 5,
    frequency: {
      type: 'daily',
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    analytics: {
      totalCompletions: 31,
      currentStreak: 5,
      longestStreak: 12,
      successRate: 78,
      lastUpdated: new Date()
    }
  },
  {
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    difficulty: 'easy',
    honorPointsReward: 10,
    honorPointsPenalty: 5,
    frequency: {
      type: 'daily',
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    analytics: {
      totalCompletions: 52,
      currentStreak: 15,
      longestStreak: 22,
      successRate: 95,
      lastUpdated: new Date()
    }
  },
  {
    title: 'Practice Guitar',
    description: 'Practice guitar for 45 minutes',
    category: 'learning',
    difficulty: 'medium',
    honorPointsReward: 15,
    honorPointsPenalty: 7,
    frequency: {
      type: 'weekly',
      days: [1, 2, 3, 4, 5]
    },
    analytics: {
      totalCompletions: 18,
      currentStreak: 3,
      longestStreak: 7,
      successRate: 72,
      lastUpdated: new Date()
    }
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    await dbConnect()
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Habit.deleteMany({})
    console.log('🧹 Cleared existing data')

    // Create users
    const users = await User.insertMany(sampleUsers)
    console.log(`✅ Created ${users.length} users`)

    // Create habits and assign to first user
    const habitsWithUser = sampleHabits.map(habit => ({
      ...habit,
      userId: users[0]._id
    }))

    const habits = await Habit.insertMany(habitsWithUser)
    console.log(`✅ Created ${habits.length} habits`)

    // Add some habit logs for realistic data
    const today = new Date()
    for (const habit of habits) {
      const logs: any[] = []
      
      // Add logs for the past 30 days
      for (let i = 30; i >= 0; i--) {
        const logDate = new Date(today)
        logDate.setDate(logDate.getDate() - i)
        
        // Random completion (higher chance for easier habits)
        const completionChance = habit.difficulty === 'easy' ? 0.9 : 
                               habit.difficulty === 'medium' ? 0.75 : 0.6
        const completed = Math.random() < completionChance
        
        if (completed) {
          logs.push({
            date: logDate,
            completed: true,
            notes: `Completed on ${logDate.toDateString()}`,
            proof: {
              type: 'text',
              content: 'Task completed successfully'
            }
          })
        }
      }
      
      habit.logs = logs
      await habit.save()
    }

    console.log('✅ Added habit logs')
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase().then(() => {
  console.log('🔚 Seeding process finished')
  process.exit(0)
})
