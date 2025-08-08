'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Medal, Crown, Gift, ChevronRight, Filter } from 'lucide-react';
import { ACHIEVEMENTS, Achievement, getRarityColor, getRarityBorderColor } from '@/lib/achievements';

export default function AchievementsPage() {
  const [userAchievements, setUserAchievements] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'unearned'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats
      const statsResponse = await fetch('/api/user/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setUserStats(stats);
        setUserAchievements(stats.recentAchievements || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    // Filter by earned/unearned status
    const isEarned = userAchievements.includes(achievement.id);
    if (filter === 'earned' && !isEarned) return false;
    if (filter === 'unearned' && isEarned) return false;

    // Filter by category
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;

    return true;
  });

  const categories = ['all', ...Array.from(new Set(ACHIEVEMENTS.map(a => a.category)))];
  const earnedCount = userAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = (earnedCount / totalCount) * 100;

  const getRarityIcon = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return <Medal className="w-4 h-4" />;
      case 'rare':
        return <Star className="w-4 h-4" />;
      case 'epic':
        return <Trophy className="w-4 h-4" />;
      case 'legendary':
        return <Crown className="w-4 h-4" />;
      default:
        return <Medal className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'habit':
        return '🎯';
      case 'streak':
        return '🔥';
      case 'social':
        return '👥';
      case 'level':
        return '⭐';
      case 'completion':
        return '✅';
      default:
        return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Achievements</h1>
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
                <p className="text-gray-600">
                  {earnedCount} of {totalCount} achievements unlocked
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Achievements</option>
                <option value="earned">Earned</option>
                <option value="unearned">Not Earned</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredAchievements.map((achievement) => {
              const isEarned = userAchievements.includes(achievement.id);
              
              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    relative bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-md
                    ${isEarned 
                      ? `${getRarityBorderColor(achievement.rarity)} bg-gradient-to-br from-white to-gray-50` 
                      : 'border-gray-200 opacity-75'
                    }
                  `}
                >
                  {/* Earned Badge */}
                  {isEarned && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Achievement Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                        <div className={`${getRarityColor(achievement.rarity)}`}>
                          {getRarityIcon(achievement.rarity)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {getCategoryIcon(achievement.category)} {achievement.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)} bg-gray-100`}>
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>

                  {/* Criteria */}
                  <div className="text-xs text-gray-500 mb-3">
                    Target: {achievement.criteria.target} {achievement.criteria.type.replace('_', ' ')}
                    {achievement.criteria.category && ` (${achievement.criteria.category})`}
                  </div>

                  {/* Reward */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        +{achievement.reward.points} HP
                      </span>
                    </div>
                    
                    {!isEarned && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Progress Indicator for Unearned Achievements */}
                  {!isEarned && userStats && (
                    <div className="mt-3">
                      {(() => {
                        let progress = 0;
                        let current = 0;
                        
                        switch (achievement.criteria.type) {
                          case 'habit_completions':
                            if (achievement.criteria.category) {
                              const categoryData = userStats.categoryBreakdown?.find(
                                (cat: any) => cat.category === achievement.criteria.category
                              );
                              current = categoryData?.completed || 0;
                            } else if (achievement.criteria.timeframe === 'day') {
                              current = userStats.completedToday || 0;
                            } else {
                              current = userStats.totalCompletions || 0;
                            }
                            break;
                          case 'streak_days':
                            current = Math.max(userStats.currentStreak || 0, userStats.longestStreak || 0);
                            break;
                          case 'level_reached':
                            current = userStats.level || 1;
                            break;
                          case 'points_earned':
                            current = userStats.honorPoints || 0;
                            break;
                          case 'total_habits':
                            current = userStats.totalHabits || 0;
                            break;
                        }
                        
                        progress = Math.min((current / achievement.criteria.target) * 100, 100);
                        
                        return (
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{current}/{achievement.criteria.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No achievements found with the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
