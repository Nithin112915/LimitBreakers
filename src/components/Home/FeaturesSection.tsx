'use client'

import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  ChartBarIcon, 
  UsersIcon, 
  SparklesIcon,
  CameraIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'AI-Powered Coaching',
    description: 'Personalized daily schedules and habit recommendations based on your goals and behavior patterns.',
    icon: SparklesIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  {
    name: 'Proof Submission',
    description: 'Submit photos, documents, or videos as proof of completion to earn Honor Points and build accountability.',
    icon: CameraIcon,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100'
  },
  {
    name: 'Honor Points System',
    description: 'Earn or lose points based on habit completion with consequence-based feedback loops for motivation.',
    icon: TrophyIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    name: 'Smart Reminders',
    description: 'Time-based, location-aware, and snoozable reminders that adapt to your lifestyle and preferences.',
    icon: CalendarIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    name: 'Professional Network',
    description: 'Live résumé-style profiles showcasing skills, achievements, and growth journey within a peer-driven ecosystem.',
    icon: UsersIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    name: 'Deep Analytics',
    description: 'Streak heatmaps, completion trends, leaderboards, and comprehensive insights into your progress.',
    icon: ChartBarIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    name: 'Community Challenges',
    description: 'Participate in group challenges, share achievements, and get motivated by your peers.',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    name: 'Privacy & Security',
    description: 'Strong privacy controls and secure data handling to protect your personal growth journey.',
    icon: ShieldCheckIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
]

export function FeaturesSection() {
  return (
    <div id="features" className="py-12 premium-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center glass-morphism p-8 rounded-xl card-3d mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base gold-accent font-semibold tracking-wide uppercase neon-glow"
          >
            Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight premium-text sm:text-4xl neon-glow"
          >
            Everything you need to build lasting habits
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-xl premium-text-muted lg:mx-auto"
          >
            Combining AI-driven insights, social accountability, and gamification 
            to create a comprehensive personal growth platform.
          </motion.p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-morphism hover:bg-white/10 transition-all duration-300 card-3d p-6 rounded-xl">
                  <div>
                    <span className="rounded-lg p-3 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center w-12 h-12 floating-animation">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium premium-text neon-glow">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base premium-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
