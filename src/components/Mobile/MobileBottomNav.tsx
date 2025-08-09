'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  UserIcon,
  Cog6ToothIcon,
  PlusIcon,
  BellIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';

const tabs = [
  { 
    id: 'dashboard', 
    label: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon, 
    activeIcon: HomeIconSolid 
  },
  { 
    id: 'habits', 
    label: 'Habits', 
    href: '/habits', 
    icon: ChartBarIcon, 
    activeIcon: ChartBarIconSolid 
  },
  { 
    id: 'add', 
    label: 'Add', 
    href: '/habits/create', 
    icon: PlusIcon, 
    activeIcon: PlusIcon,
    isSpecial: true 
  },
  { 
    id: 'community', 
    label: 'Social', 
    href: '/community', 
    icon: UserGroupIcon, 
    activeIcon: UserGroupIconSolid 
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    href: '/profile', 
    icon: UserIcon, 
    activeIcon: UserIconSolid 
  }
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show on auth pages
  if (pathname?.includes('/auth/')) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.id === 'habits' && pathname?.startsWith('/habits')) ||
            (tab.id === 'dashboard' && pathname === '/') ||
            (tab.id === 'profile' && pathname?.startsWith('/profile'));
          
          const Icon = isActive ? tab.activeIcon : tab.icon;

          if (tab.isSpecial) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="flex flex-col items-center justify-center min-h-[60px] w-16"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-h-[60px] w-16 transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs mt-1 ${
                isActive ? 'text-primary font-medium' : ''
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 bg-primary rounded-full mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
