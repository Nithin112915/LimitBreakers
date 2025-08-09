'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MobileHeader() {
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div 
        className="flex items-center justify-between px-4 py-3"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      >
        {/* Left side - Logo/Streak */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                LimitBreakers
              </h1>
            </div>
          </div>
          
          {session && (
            <div className="flex items-center space-x-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
              <FireIcon className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                5
              </span>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <BellIcon className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </div>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center space-x-2"
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-primary"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            )}
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search habits, users, challenges..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
