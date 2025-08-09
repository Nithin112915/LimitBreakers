'use client';

import { useState } from 'react';
import { 
  CheckCircleIcon, 
  PlusIcon, 
  PhotoIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  timeOfDay: string;
  category: string;
}

const mockHabits: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness',
    streak: 5,
    difficulty: 'easy',
    completed: true,
    timeOfDay: '7:00 AM',
    category: 'Wellness'
  },
  {
    id: '2',
    title: 'Read 30 Pages',
    description: 'Personal development book',
    streak: 12,
    difficulty: 'medium',
    completed: false,
    timeOfDay: '9:00 PM',
    category: 'Learning'
  },
  {
    id: '3',
    title: 'Exercise',
    description: '45 minutes workout',
    streak: 3,
    difficulty: 'hard',
    completed: false,
    timeOfDay: '6:00 AM',
    category: 'Fitness'
  }
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function MobileHabitCard({ habit }: { habit: Habit }) {
  const [isCompleted, setIsCompleted] = useState(habit.completed);
  const [showProofUpload, setShowProofUpload] = useState(false);

  const handleComplete = () => {
    if (!isCompleted) {
      setShowProofUpload(true);
    } else {
      setIsCompleted(false);
    }
  };

  const handleProofUpload = () => {
    setIsCompleted(true);
    setShowProofUpload(false);
    // Handle proof upload logic
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {habit.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {habit.description}
          </p>
        </div>
        
        <button
          onClick={handleComplete}
          className={`ml-3 p-2 rounded-full transition-all ${
            isCompleted 
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-green-100 hover:text-green-600'
          }`}
        >
          {isCompleted ? (
            <CheckCircleIconSolid className="h-6 w-6" />
          ) : (
            <CheckCircleIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          {/* Streak */}
          <div className="flex items-center space-x-1">
            <FireIcon className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {habit.streak} days
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {habit.timeOfDay}
            </span>
          </div>
        </div>

        {/* Difficulty Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[habit.difficulty]}`}>
          {habit.difficulty}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Today's Progress</span>
          <span>{isCompleted ? '100%' : '0%'}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500 w-full' : 'bg-gray-300 dark:bg-gray-600 w-0'
            }`}
          />
        </div>
      </div>

      {/* Proof Upload Modal */}
      {showProofUpload && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Upload proof to complete this habit:
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleProofUpload}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <PhotoIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Take Photo</span>
            </button>
            
            <button
              onClick={() => setShowProofUpload(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileHabitsList() {
  return (
    <div className="px-4 pb-20">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircleIconSolid className="h-5 w-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="text-2xl font-bold">1/3</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <div className="text-2xl font-bold">5</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Points</span>
          </div>
          <div className="text-2xl font-bold">120</div>
        </div>
      </div>

      {/* Habits List */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Habits
        </h2>
        
        {mockHabits.map((habit) => (
          <MobileHabitCard key={habit.id} habit={habit} />
        ))}
      </div>

      {/* Add New Habit Button */}
      <button className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors">
        <PlusIcon className="h-5 w-5" />
        <span className="font-medium">Add New Habit</span>
      </button>
    </div>
  );
}
