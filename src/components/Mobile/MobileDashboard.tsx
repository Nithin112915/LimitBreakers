'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FireIcon, 
  TrophyIcon, 
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  CalendarDaysIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useHaptics } from '@/hooks/useMobile';

interface QuickAction {
  id: string;
  title: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'habits',
    title: 'My Habits',
    icon: CheckCircleIcon,
    href: '/habits',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: ChartBarIcon,
    href: '/analytics',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    id: 'community',
    title: 'Community',
    icon: UserGroupIcon,
    href: '/community',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    icon: TrophyIcon,
    href: '/achievements',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
  }
];

export default function MobileDashboard() {
  const { data: session } = useSession();
  const { lightImpact } = useHaptics();
  const [todayStats, setTodayStats] = useState({
    completed: 1,
    total: 3,
    streak: 5,
    points: 120
  });

  const completionPercentage = (todayStats.completed / todayStats.total) * 100;

  const handleQuickActionPress = () => {
    lightImpact();
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Good morning, {session?.user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to break some limits today?
        </p>
      </div>

      {/* Today's Progress Card */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Today's Progress</h2>
            <p className="text-white/80 text-sm">
              {todayStats.completed} of {todayStats.total} habits completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(completionPercentage)}%</div>
            <div className="text-white/80 text-sm">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-4">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FireIcon className="h-5 w-5 text-orange-300" />
            <div>
              <div className="font-semibold">{todayStats.streak}</div>
              <div className="text-xs text-white/80">Day Streak</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-yellow-300" />
            <div>
              <div className="font-semibold">{todayStats.points}</div>
              <div className="text-xs text-white/80">Honor Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                onClick={handleQuickActionPress}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all active:scale-95"
              >
                <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {action.title}
                </h4>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Today's Habits Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Habits
          </h3>
          <Link 
            href="/habits"
            className="text-primary text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {/* Sample habit items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircleIconSolid className="h-6 w-6 text-green-500" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Morning Meditation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    10 minutes • Completed
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <FireIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">5</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Read 30 Pages
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Personal development • Pending
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <FireIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
          <div>
            <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">
              "The only impossible journey is the one you never begin."
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              — Tony Robbins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
