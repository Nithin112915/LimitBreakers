export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'habit' | 'streak' | 'social' | 'level' | 'completion';
  criteria: {
    type: 'habit_completions' | 'streak_days' | 'total_habits' | 'points_earned' | 'level_reached' | 'social_interactions';
    target: number;
    timeframe?: 'day' | 'week' | 'month' | 'all_time';
    category?: string;
  };
  reward: {
    points: number;
    badge?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Habit Completion Achievements
  {
    id: 'first_habit',
    title: 'First Steps',
    description: 'Complete your first habit',
    icon: '🎯',
    category: 'habit',
    criteria: {
      type: 'habit_completions',
      target: 1,
      timeframe: 'all_time'
    },
    reward: { points: 10 },
    rarity: 'common'
  },
  {
    id: 'habit_master_10',
    title: 'Habit Master',
    description: 'Complete 10 habits',
    icon: '🏆',
    category: 'habit',
    criteria: {
      type: 'habit_completions',
      target: 10,
      timeframe: 'all_time'
    },
    reward: { points: 50 },
    rarity: 'rare'
  },

  {
    id: 'daily_champion',
    title: 'Daily Champion',
    description: 'Complete 5 habits in one day',
    icon: '☀️',
    category: 'habit',
    criteria: {
      type: 'habit_completions',
      target: 5,
      timeframe: 'day'
    },
    reward: { points: 25 },
    rarity: 'rare'
  },

  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    criteria: {
      type: 'streak_days',
      target: 3,
      timeframe: 'all_time'
    },
    reward: { points: 15 },
    rarity: 'common'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    criteria: {
      type: 'streak_days',
      target: 7,
      timeframe: 'all_time'
    },
    reward: { points: 30 },
    rarity: 'rare'
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    category: 'streak',
    criteria: {
      type: 'streak_days',
      target: 30,
      timeframe: 'all_time'
    },
    reward: { points: 50 },
    rarity: 'epic'
  },


  // Level Achievements
  {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'level',
    criteria: {
      type: 'level_reached',
      target: 5,
      timeframe: 'all_time'
    },
    reward: { points: 50 },
    rarity: 'common'
  },
  {
    id: 'level_10',
    title: 'Experienced Tracker',
    description: 'Reach level 10',
    icon: '🌟',
    category: 'level',
    criteria: {
      type: 'level_reached',
      target: 10,
      timeframe: 'all_time'
    },
    reward: { points: 50 },
    rarity: 'rare'
  },
  {
    id: 'level_25',
    title: 'Habit Guru',
    description: 'Reach level 25',
    icon: '✨',
    category: 'level',
    criteria: {
      type: 'level_reached',
      target: 25,
      timeframe: 'all_time'
    },
    reward: { points: 250 },
    rarity: 'epic'
  },

  // Category-specific Achievements
  {
    id: 'health_enthusiast',
    title: 'Health Enthusiast',
    description: 'Complete 20 health habits',
    icon: '💪',
    category: 'completion',
    criteria: {
      type: 'habit_completions',
      target: 20,
      timeframe: 'all_time',
      category: 'Health & Fitness'
    },
    reward: { points: 75 },
    rarity: 'rare'
  },
  {
    id: 'mind_master',
    title: 'Mind Master',
    description: 'Complete 20 mindfulness habits',
    icon: '🧘',
    category: 'completion',
    criteria: {
      type: 'habit_completions',
      target: 20,
      timeframe: 'all_time',
      category: 'Mindfulness & Mental Health'
    },
    reward: { points: 75 },
    rarity: 'rare'
  },
  {
    id: 'productivity_pro',
    title: 'Productivity Pro',
    description: 'Complete 20 productivity habits',
    icon: '📈',
    category: 'completion',
    criteria: {
      type: 'habit_completions',
      target: 20,
      timeframe: 'all_time',
      category: 'Productivity'
    },
    reward: { points: 75 },
    rarity: 'rare'
  },

  // Points Achievements

  {
    id: 'points_500',
    title: 'Honor Seeker',
    description: 'Earn 500 honor points',
    icon: '💎',
    category: 'level',
    criteria: {
      type: 'points_earned',
      target: 500,
      timeframe: 'all_time'
    },
    reward: { points: 50 },
    rarity: 'rare'
  },
  {
    id: 'points_1000',
    title: 'Points Champion',
    description: 'Earn 1000 honor points',
    icon: '💎',
    category: 'level',
    criteria: {
      type: 'points_earned',
      target: 1000,
      timeframe: 'all_time'
    },
    reward: { points: 200 },
    rarity: 'epic'
  }
];

export function checkAchievements(
  userStats: any,
  userAchievements: string[] = []
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if user already has this achievement
    if (userAchievements.includes(achievement.id)) {
      continue;
    }

    let criteriaeMet = false;

    switch (achievement.criteria.type) {
      case 'habit_completions':
        if (achievement.criteria.category) {
          // Category-specific completions
          const categoryData = userStats.categoryBreakdown?.find(
            (cat: any) => cat.category === achievement.criteria.category
          );
          criteriaeMet = (categoryData?.completed || 0) >= achievement.criteria.target;
        } else if (achievement.criteria.timeframe === 'day') {
          criteriaeMet = userStats.completedToday >= achievement.criteria.target;
        } else {
          criteriaeMet = userStats.totalCompletions >= achievement.criteria.target;
        }
        break;

      case 'streak_days':
        criteriaeMet = Math.max(userStats.currentStreak, userStats.longestStreak) >= achievement.criteria.target;
        break;

      case 'level_reached':
        criteriaeMet = userStats.level >= achievement.criteria.target;
        break;

      case 'points_earned':
        criteriaeMet = userStats.honorPoints >= achievement.criteria.target;
        break;

      case 'total_habits':
        criteriaeMet = userStats.totalHabits >= achievement.criteria.target;
        break;
    }

    if (criteriaeMet) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

export function calculateLevelFromPoints(points: number): number {
  // Level formula: Level = floor(sqrt(points / 10)) + 1
  // This means: Level 1: 0-9 points, Level 2: 10-39 points, Level 3: 40-89 points, etc.
  return Math.floor(Math.sqrt(points / 10)) + 1;
}

export function getPointsForNextLevel(currentLevel: number): number {
  // Points needed for next level
  return Math.pow(currentLevel, 2) * 10;
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-600';
    case 'rare':
      return 'text-blue-600';
    case 'epic':
      return 'text-purple-600';
    case 'legendary':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

export function getRarityBorderColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'border-gray-300';
    case 'rare':
      return 'border-blue-300';
    case 'epic':
      return 'border-purple-300';
    case 'legendary':
      return 'border-yellow-300';
    default:
      return 'border-gray-300';
  }
}
