'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Bars3Icon, 
  XMarkIcon, 
  TrophyIcon,
  UserIcon,
  ChartBarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Habits', href: '/habits', icon: CalendarIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Social', href: '/social', icon: UsersIcon },
    { name: 'Discover', href: '/discover', icon: MagnifyingGlassIcon },
    { name: 'Community', href: '/community', icon: UserIcon },
    { name: 'AI Companion', href: '/coach', icon: ChatBubbleLeftRightIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <TrophyIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Limit Breakers
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {session && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {session.user?.honorPoints || 0} HP
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="btn-outline text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="btn-outline text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {session && navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {session ? (
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrophyIcon className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        {session.user?.honorPoints || 0} Honor Points
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="btn-outline text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-gray-200 mt-2 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block w-full btn-outline text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full btn-primary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
