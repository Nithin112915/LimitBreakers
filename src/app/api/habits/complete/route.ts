import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { Task } from '../../../../models/Task';
import type { ITask } from '../../../../models/Task';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habitId, proofText, proofImage } = await request.json();

    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Find the user and habit
    const user = await User.findOne({ email: session.user.email });
    const habit = await Task.findById(habitId);

    if (!user || !habit) {
      return NextResponse.json({ error: 'User or habit not found' }, { status: 404 });
    }

    // Check if user owns this habit
    if (habit.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to complete this habit' }, { status: 403 });
    }

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCompletion = habit.completions.find((completion: any) => {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });

    if (existingCompletion) {
      return NextResponse.json({ error: 'Habit already completed today' }, { status: 400 });
    }

    // Create completion entry
    const completion = {
      date: new Date(),
      proofText: proofText || '',
      proofImage: proofImage || '',
      verified: habit.proofType === 'self' // Self-verification is automatically verified
    };

    // Add completion to habit
    habit.completions.push(completion);

    // Update habit analytics
    if (!habit.analytics) {
      habit.analytics = {
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageSuccessRate: 0
      };
    }

    habit.analytics.totalCompletions += 1;

    // Calculate new streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayCompletion = habit.completions.find((completion: any) => {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === yesterday.getTime();
    });

    if (yesterdayCompletion) {
      habit.analytics.currentStreak += 1;
    } else {
      habit.analytics.currentStreak = 1;
    }

    // Update longest streak
    if (habit.analytics.currentStreak > habit.analytics.longestStreak) {
      habit.analytics.longestStreak = habit.analytics.currentStreak;
    }

    // Calculate success rate (completions vs days since creation)
    const daysSinceCreation = Math.ceil(
      (today.getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    habit.analytics.averageSuccessRate = Math.round(
      (habit.analytics.totalCompletions / Math.max(daysSinceCreation, 1)) * 100
    );

    await habit.save();

    // Award points to user based on difficulty
    let pointsAwarded = 0;
    switch (habit.difficulty) {
      case 'easy':
        pointsAwarded = 10;
        break;
      case 'medium':
        pointsAwarded = 15;
        break;
      case 'hard':
        pointsAwarded = 25;
        break;
      default:
        pointsAwarded = 10;
    }

    user.honorPoints = (user.honorPoints || 0) + pointsAwarded;
    
    // Update user level based on points
    const newLevel = Math.floor(user.honorPoints / 1000) + 1;
    const leveledUp = newLevel > (user.level || 1);
    user.level = newLevel;

    // Check for new achievements
    const userHabits: ITask[] = await Task.find({ userId: user._id });
    
    // Calculate user stats for achievement checking
    const totalCompletions = userHabits.reduce(
      (sum: number, h: ITask) => sum + (h.analytics?.totalCompletions || 0),
      0
    );
    
    const completedToday = userHabits.filter((h: ITask) =>
      h.completions.some((c: any) => {
        const cDate = new Date(c.date);
        cDate.setHours(0, 0, 0, 0);
        return cDate.getTime() === today.getTime();
      })
    ).length;

    const currentStreak = Math.max(...userHabits.map(h => h.analytics?.currentStreak || 0), 0);
    const longestStreak = Math.max(...userHabits.map((h: ITask) => h.analytics?.longestStreak || 0), 0);

    // Category breakdown for achievement checking
    const categoryBreakdown = userHabits.reduce((acc: any[], habit: ITask) => {
      const existing = acc.find(item => item.category === habit.category);
      const completions = habit.analytics?.totalCompletions || 0;
      
      if (existing) {
        existing.completed += completions;
      } else {
        acc.push({
          category: habit.category,
          completed: completions,
          total: 1
        });
      }
      return acc;
    }, []);

    const userStats = {
      totalHabits: userHabits.length,
      totalCompletions,
      completedToday,
      honorPoints: user.honorPoints,
      level: user.level,
      currentStreak,
      longestStreak,
      categoryBreakdown
    };

    // Simple achievement check
    const newAchievements = [];
    if (currentStreak === 7) {
      newAchievements.push({
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Completed a 7-day streak',
        honorPoints: 50,
        unlockedAt: new Date()
      });
    } else if (currentStreak === 30) {
      newAchievements.push({
        id: 'month-master', 
        title: 'Month Master',
        description: 'Completed a 30-day streak',
        honorPoints: 200,
        unlockedAt: new Date()
      });
    }
    
    // Award achievement points and add to user
    let achievementPoints = 0;
    if (newAchievements.length > 0) {
      for (const achievement of newAchievements) {
        user.achievements = user.achievements || [];
        user.achievements.push(achievement.id);
        achievementPoints += achievement.honorPoints;
      }
      user.honorPoints += achievementPoints;
      // Recalculate level after achievement points
      user.level = Math.floor(user.honorPoints / 1000) + 1;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      pointsAwarded: pointsAwarded + achievementPoints,
      leveledUp,
      newLevel: user.level,
      newAchievements,
      completion,
      habit: {
        ...habit.toObject(),
        analytics: habit.analytics
      }
    });

  } catch (error) {
    console.error('Error completing habit:', error);
    return NextResponse.json(
      { error: 'Failed to complete habit' },
      { status: 500 }
    );
  }
}
