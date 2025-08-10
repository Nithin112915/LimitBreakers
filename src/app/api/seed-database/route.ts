import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../models/User'
import { Task } from '../../../models/Task'

export async function POST() {
  try {
    await dbConnect()
    
    // Clear existing data (optional)
    // await User.deleteMany({})
    // await Task.deleteMany({})
    
    // Create sample users
    const users = [
      {
        email: 'john@example.com',
        name: 'John Doe',
        username: 'johndoe',
        userId: '12345678',
        honorPoints: 1250,
        level: 5,
        verified: true,
        stats: {
          postsCount: 12,
          followersCount: 156,
          followingCount: 89
        },
        profile: {
          bio: 'Passionate about personal growth and building healthy habits',
          skills: ['Meditation', 'Reading', 'Exercise'],
          achievements: ['Early Bird', 'Streak Master', 'Community Helper']
        },
        streaks: {
          current: 15,
          longest: 45
        }
      },
      {
        email: 'sarah@example.com', 
        name: 'Sarah Wilson',
        username: 'sarahw',
        userId: '87654321',
        honorPoints: 2100,
        level: 8,
        verified: true,
        stats: {
          postsCount: 28,
          followersCount: 342,
          followingCount: 134
        },
        profile: {
          bio: 'Fitness enthusiast and mindfulness advocate',
          skills: ['Yoga', 'Nutrition', 'Time Management'],
          achievements: ['Fitness Guru', 'Mindful Master', 'Goal Crusher']
        },
        streaks: {
          current: 32,
          longest: 67
        }
      },
      {
        email: 'mike@example.com',
        name: 'Mike Chen',
        username: 'mikechen',
        userId: '11223344',
        honorPoints: 850,
        level: 3,
        verified: false,
        stats: {
          postsCount: 8,
          followersCount: 45,
          followingCount: 67
        },
        profile: {
          bio: 'Learning to build better habits one day at a time',
          skills: ['Programming', 'Reading'],
          achievements: ['First Step', 'Consistency']
        },
        streaks: {
          current: 7,
          longest: 12
        }
      }
    ]
    
    const createdUsers = await User.insertMany(users)
    console.log('✅ Created users:', createdUsers.length)
    
    // Create sample habits/tasks for users
    const habits = [
      // John's habits
      {
        userId: createdUsers[0]._id,
        title: 'Morning Meditation',
        description: 'Start each day with 10 minutes of mindfulness meditation',
        category: 'Wellness',
        difficulty: 'Easy',
        honorPoints: 10,
        reminderTime: '07:00',
        tags: ['meditation', 'mindfulness', 'morning'],
        requiresProof: true,
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        completedDates: Array.from({length: 15}, (_, i) => 
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        )
      },
      {
        userId: createdUsers[0]._id,
        title: 'Read 30 Minutes',
        description: 'Read books for personal and professional development',
        category: 'Learning',
        difficulty: 'Medium',
        honorPoints: 15,
        reminderTime: '20:00',
        tags: ['reading', 'learning', 'growth'],
        requiresProof: false,
        status: 'active',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        completedDates: Array.from({length: 12}, (_, i) => 
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        )
      },
      
      // Sarah's habits
      {
        userId: createdUsers[1]._id,
        title: 'Morning Workout',
        description: '45-minute strength training or cardio session',
        category: 'Fitness',
        difficulty: 'Hard',
        honorPoints: 25,
        reminderTime: '06:30',
        tags: ['exercise', 'fitness', 'strength'],
        requiresProof: true,
        status: 'active',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        completedDates: Array.from({length: 32}, (_, i) => 
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        )
      },
      {
        userId: createdUsers[1]._id,
        title: 'Healthy Meal Prep',
        description: 'Prepare nutritious meals for the day',
        category: 'Health',
        difficulty: 'Medium',
        honorPoints: 20,
        reminderTime: '18:00',
        tags: ['nutrition', 'health', 'cooking'],
        requiresProof: true,
        status: 'active',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        completedDates: Array.from({length: 18}, (_, i) => 
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        )
      },
      
      // Mike's habits
      {
        userId: createdUsers[2]._id,
        title: 'Code Practice',
        description: 'Practice coding for at least 1 hour daily',
        category: 'Learning',
        difficulty: 'Medium',
        honorPoints: 20,
        reminderTime: '19:00',
        tags: ['programming', 'coding', 'learning'],
        requiresProof: false,
        status: 'active',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        completedDates: Array.from({length: 7}, (_, i) => 
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        )
      },
      {
        userId: createdUsers[2]._id,
        title: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day',
        category: 'Health',
        difficulty: 'Easy',
        honorPoints: 5,
        reminderTime: '12:00',
        tags: ['health', 'hydration', 'wellness'],
        requiresProof: false,
        status: 'active',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedDates: Array.from({length: 5}, (_, i) => 
          new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        )
      }
    ]
    
    const createdHabits = await Task.insertMany(habits)
    console.log('✅ Created habits:', createdHabits.length)
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: createdUsers.length,
        habits: createdHabits.length
      }
    })
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
