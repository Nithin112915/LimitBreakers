'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  ChartBarIcon, 
  UsersIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden premium-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left glass-morphism p-8 rounded-xl card-3d">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl tracking-tight font-extrabold premium-text sm:text-5xl md:text-6xl neon-glow"
              >
                <span className="block xl:inline">Transform Your</span>{' '}
                <span className="block gold-accent xl:inline floating-animation">Growth Journey</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-3 text-base premium-text-muted sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
              >
                Build lasting habits with AI-powered coaching, accountability through proof submission, 
                and a professional community that celebrates your achievements. Earn Honor Points and 
                showcase your growth journey.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                <div className="rounded-md">
                  <Link
                    href="/auth/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 md:py-4 md:text-lg md:px-10 transition-all button-3d ripple-effect neon-glow"
                  >
                    Start Your Journey
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded-md premium-text glass-morphism hover:bg-white/10 md:py-4 md:text-lg md:px-10 transition-all button-3d"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center"
        >
          <div className="grid grid-cols-2 gap-4 p-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <TrophyIcon className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Honor Points</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <ChartBarIcon className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Analytics</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <UsersIcon className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Community</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <SparklesIcon className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">AI Coach</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
