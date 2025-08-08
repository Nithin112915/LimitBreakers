'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Star, Medal, Crown, Gift, ChevronRight } from 'lucide-react';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements';

interface RecentAchievement extends Achievement {
  unlockedAt: Date;
  isNew?: boolean;
}

export function AchievementNotifications() {
  const [achievements, setAchievements] = useState<RecentAchievement[]>([]);
  const [dismissedAchievements, setDismissedAchievements] = useState<string[]>([]);

  useEffect(() => {
    fetchRecentAchievements();
  }, []);

  const fetchRecentAchievements = async () => {
    try {
      // Simulate recent achievements - in a real app, this would come from an API
      // For now, we'll show the first achievement as "recently unlocked"
      const recentAchievements: RecentAchievement[] = [
        {
          ...ACHIEVEMENTS[0], // First achievement
          unlockedAt: new Date(),
          isNew: true
        }
      ];
      
      setAchievements(recentAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const dismissAchievement = (achievementId: string) => {
    setDismissedAchievements([...dismissedAchievements, achievementId]);
  };

  const visibleAchievements = achievements.filter(
    achievement => !dismissedAchievements.includes(achievement.id)
  );

  const getRarityIcon = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return <Medal className="w-5 h-5" />;
      case 'rare':
        return <Star className="w-5 h-5" />;
      case 'epic':
        return <Trophy className="w-5 h-5" />;
      case 'legendary':
        return <Crown className="w-5 h-5" />;
      default:
        return <Medal className="w-5 h-5" />;
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  if (visibleAchievements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {visibleAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-10`} />
            
            {/* Main Content */}
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                    {getRarityIcon(achievement.rarity)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">Achievement Unlocked!</h3>
                      {achievement.isNew && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => dismissAchievement(achievement.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Achievement Details */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Gift className="w-4 h-4" />
                      <span>+{achievement.reward.points} Honor Points</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <a
                  href="/achievements"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View All Achievements
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-2 right-2 opacity-20">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            
            {/* Animated Sparkles */}
            <motion.div
              className="absolute top-4 left-4"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-4 right-16"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
