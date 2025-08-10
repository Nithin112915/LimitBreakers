'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Calendar,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  Flame,
  Target,
  Award
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  honorPoints: number;
  level: number;
  currentStreak: number;
  totalHabits: number;
  completedToday: number;
  rank: number;
  change: 'up' | 'down' | 'same';
  changeAmount: number;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  dataKey: keyof LeaderboardUser;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('points');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  const categories: LeaderboardCategory[] = [
    {
      id: 'points',
      name: 'Honor Points',
      description: 'Total honor points earned',
      icon: <Trophy className="w-5 h-5" />,
      dataKey: 'honorPoints'
    },
    {
      id: 'level',
      name: 'Level',
      description: 'Current user level',
      icon: <Star className="w-5 h-5" />,
      dataKey: 'level'
    },
    {
      id: 'streak',
      name: 'Current Streak',
      description: 'Days in current streak',
      icon: <Flame className="w-5 h-5" />,
      dataKey: 'currentStreak'
    },
    {
      id: 'habits',
      name: 'Total Habits',
      description: 'Number of active habits',
      icon: <Target className="w-5 h-5" />,
      dataKey: 'totalHabits'
    },
    {
      id: 'today',
      name: 'Today\'s Completions',
      description: 'Habits completed today',
      icon: <Calendar className="w-5 h-5" />,
      dataKey: 'completedToday'
    }
  ];

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedCategory, timeframe]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate leaderboard data - in a real app, this would come from an API
      const mockUsers: LeaderboardUser[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          honorPoints: 2450,
          level: 15,
          currentStreak: 28,
          totalHabits: 12,
          completedToday: 8,
          rank: 1,
          change: 'up',
          changeAmount: 2
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          honorPoints: 2180,
          level: 14,
          currentStreak: 22,
          totalHabits: 10,
          completedToday: 6,
          rank: 2,
          change: 'down',
          changeAmount: 1
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          email: 'mike@example.com',
          honorPoints: 1950,
          level: 12,
          currentStreak: 35,
          totalHabits: 8,
          completedToday: 5,
          rank: 3,
          change: 'up',
          changeAmount: 3
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily@example.com',
          honorPoints: 1720,
          level: 11,
          currentStreak: 15,
          totalHabits: 15,
          completedToday: 12,
          rank: 4,
          change: 'same',
          changeAmount: 0
        },
        {
          id: '5',
          name: 'David Wilson',
          email: 'david@example.com',
          honorPoints: 1580,
          level: 10,
          currentStreak: 8,
          totalHabits: 6,
          completedToday: 4,
          rank: 5,
          change: 'up',
          changeAmount: 1
        }
      ];

      // Sort by selected category
      const selectedCat = categories.find(cat => cat.id === selectedCategory);
      if (selectedCat) {
        mockUsers.sort((a, b) => {
          const aValue = a[selectedCat.dataKey] as number;
          const bValue = b[selectedCat.dataKey] as number;
          return bValue - aValue;
        });
        mockUsers.forEach((user, index) => {
          user.rank = index + 1;
        });
      }

      setUsers(mockUsers);
      setCurrentUser(mockUsers[0]); // Simulate current user being #1
      
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600">{rank}</div>;
    }
  };

  const getChangeIcon = (change: 'up' | 'down' | 'same', amount: number) => {
    if (change === 'same' || amount === 0) return null;
    
    return (
      <div className={`flex items-center gap-1 text-xs ${
        change === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {change === 'up' ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        <span>{amount}</span>
      </div>
    );
  };

  const getDisplayValue = (user: LeaderboardUser, dataKey: keyof LeaderboardUser) => {
    const value = user[dataKey];
    if (!value && value !== 0) return '0';
    
    if (dataKey === 'honorPoints') {
      return `${(value as number).toLocaleString()} HP`;
    }
    if (dataKey === 'level') {
      return `Level ${value}`;
    }
    if (dataKey === 'currentStreak') {
      return `${value} days`;
    }
    return value.toString();
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient p-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-morphism p-8 rounded-xl card-3d">
            <div className="h-8 bg-white/20 rounded w-64 mb-6 pulse-animation"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-white/20 rounded-xl pulse-animation"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 glass-morphism p-6 rounded-xl card-3d">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 gold-accent floating-animation" />
            <h1 className="text-4xl font-bold premium-text neon-glow">Leaderboard</h1>
          </div>
          <p className="premium-text-muted">
            Compete with fellow habit builders and track your progress
          </p>
        </div>

        {/* Current User Rank Card */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-6 mb-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Your Current Rank</h3>
                  <p className="text-white/80">You're doing great! Keep it up!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">#{currentUser.rank}</div>
                <div className="text-white/80">
                  {getDisplayValue(currentUser, selectedCategoryData?.dataKey || 'honorPoints')}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Category:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Timeframe:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['today', 'week', 'month', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period as any)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      timeframe === period
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Description */}
        {selectedCategoryData && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-purple-600">
                {selectedCategoryData.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedCategoryData.name}</h3>
                <p className="text-sm text-gray-600">{selectedCategoryData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Rankings</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  currentUser?.id === user.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-2">
                      {getRankIcon(user.rank)}
                      {getChangeIcon(user.change, user.changeAmount)}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {user.name}
                          {currentUser?.id === user.id && (
                            <span className="ml-2 text-sm text-purple-600">(You)</span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">Level {user.level}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-800">
                        {selectedCategoryData && getDisplayValue(user, selectedCategoryData.dataKey)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.currentStreak} day streak
                      </div>
                    </div>

                    {/* Additional mini stats */}
                    <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>{user.honorPoints.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{user.totalHabits}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{user.completedToday}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Rankings update every hour. Keep building habits to climb higher!
          </p>
        </div>
      </div>
    </div>
  );
}
