'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckIcon, 
  PlayIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const demoFeatures = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: PlayIcon,
    colorClasses: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      textDark: 'text-blue-900',
      textLight: 'text-blue-800',
      bgDark: 'bg-blue-200',
      bgLight: 'bg-blue-600'
    },
    duration: '2 min',
    steps: [
      'Sign up with email or social login',
      'Complete your profile setup',
      'Set your personal growth goals',
      'Choose your habit categories'
    ],
    highlights: [
      'Quick 30-second registration',
      'Personalized onboarding flow',
      'Goal-based habit recommendations'
    ]
  },
  {
    id: 'habit-management',
    title: 'Habit Creation & Management',
    icon: DocumentTextIcon,
    colorClasses: {
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      textDark: 'text-purple-900',
      textLight: 'text-purple-800',
      bgDark: 'bg-purple-200',
      bgLight: 'bg-purple-600'
    },
    duration: '3 min',
    steps: [
      'Create custom habits with smart templates',
      'Set difficulty levels and point values',
      'Configure reminders and scheduling',
      'Add proof submission requirements',
      'Track progress with visual indicators'
    ],
    highlights: [
      '50+ pre-built habit templates',
      'Smart scheduling based on your patterns',
      'Flexible proof submission (photo, video, text)',
      'Streak tracking with milestone rewards'
    ]
  },
  {
    id: 'ai-coaching',
    title: 'AI-Powered Coaching',
    icon: SparklesIcon,
    colorClasses: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      textDark: 'text-indigo-900',
      textLight: 'text-indigo-800',
      bgDark: 'bg-indigo-200',
      bgLight: 'bg-indigo-600'
    },
    duration: '2 min',
    steps: [
      'Receive personalized daily insights',
      'Get adaptive habit suggestions',
      'View performance analytics',
      'Access motivational coaching messages'
    ],
    highlights: [
      'Machine learning analyzes your patterns',
      'Personalized recommendations improve over time',
      'Proactive support during challenging periods',
      'Success rate optimization tips'
    ]
  },
  {
    id: 'social-features',
    title: 'Social Accountability',
    icon: UserGroupIcon,
    colorClasses: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      textDark: 'text-green-900',
      textLight: 'text-green-800',
      bgDark: 'bg-green-200',
      bgLight: 'bg-green-600'
    },
    duration: '4 min',
    steps: [
      'Connect with accountability partners',
      'Join community challenges',
      'Compete on global leaderboards',
      'Share achievements and progress',
      'Follow inspiring community members'
    ],
    highlights: [
      'Find accountability partners with similar goals',
      'Monthly themed challenges with rewards',
      'Public and private sharing options',
      'Supportive community environment'
    ]
  },
  {
    id: 'analytics',
    title: 'Progress Analytics',
    icon: ChartBarIcon,
    colorClasses: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      textDark: 'text-blue-900',
      textLight: 'text-blue-800',
      bgDark: 'bg-blue-200',
      bgLight: 'bg-blue-600'
    },
    duration: '3 min',
    steps: [
      'View comprehensive progress dashboards',
      'Analyze streak patterns and trends',
      'Track honor points and level progression',
      'Generate detailed progress reports',
      'Export data for external analysis'
    ],
    highlights: [
      'Real-time progress visualization',
      'Weekly and monthly trend analysis',
      'Success rate calculations',
      'Goal achievement tracking',
      'Exportable progress reports'
    ]
  }
]

export function DemoGuide() {
  const [selectedFeature, setSelectedFeature] = useState(demoFeatures[0])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Complete Feature Demo Guide</h2>
        <p className="text-primary-100">
          Follow along with our comprehensive guide to explore every feature
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Feature Navigation */}
        <div className="lg:col-span-1 bg-gray-50 border-r border-gray-200">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Demo Sections</h3>
            <nav className="space-y-2">
              {demoFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedFeature.id === feature.id
                        ? `${feature.colorClasses.bg} ${feature.colorClasses.border}`
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className={`h-5 w-5 mr-3 ${
                        selectedFeature.id === feature.id 
                          ? feature.colorClasses.text
                          : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          selectedFeature.id === feature.id 
                            ? feature.colorClasses.textDark
                            : 'text-gray-900'
                        }`}>
                          {feature.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {feature.duration}
                        </div>
                      </div>
                      <div className="text-xl">
                        {index + 1}
                      </div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Feature Details */}
        <div className="lg:col-span-2 p-6">
          <motion.div
            key={selectedFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <selectedFeature.icon className={`h-8 w-8 ${selectedFeature.colorClasses.text} mr-4`} />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedFeature.title}
                </h3>
                <p className="text-gray-600">
                  Estimated time: {selectedFeature.duration}
                </p>
              </div>
            </div>

            {/* Step-by-step Instructions */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Step-by-Step Instructions</h4>
              <div className="space-y-3">
                {selectedFeature.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <button
                      onClick={() => toggleStep(index)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 mt-0.5 transition-colors ${
                        completedSteps.includes(index)
                          ? `${selectedFeature.colorClasses.bgLight} ${selectedFeature.colorClasses.border}`
                          : `border-gray-300 hover:${selectedFeature.colorClasses.border}`
                      }`}
                    >
                      {completedSteps.includes(index) && (
                        <CheckIcon className="h-4 w-4 text-white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`${
                        completedSteps.includes(index) 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-900'
                      }`}>
                        {step}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {index + 1}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Key Features & Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedFeature.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${selectedFeature.colorClasses.bg} ${selectedFeature.colorClasses.border}`}
                  >
                    <div className="flex items-start">
                      <CheckIcon className={`h-5 w-5 ${selectedFeature.colorClasses.text} mr-2 flex-shrink-0 mt-0.5`} />
                      <p className={`text-sm ${selectedFeature.colorClasses.textLight}`}>
                        {highlight}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className={`${selectedFeature.colorClasses.bg} rounded-lg p-4 border ${selectedFeature.colorClasses.border}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${selectedFeature.colorClasses.textLight}`}>
                  Section Progress
                </span>
                <span className={`text-sm ${selectedFeature.colorClasses.text}`}>
                  {completedSteps.length} / {selectedFeature.steps.length} completed
                </span>
              </div>
              <div className={`w-full ${selectedFeature.colorClasses.bgDark} rounded-full h-2`}>
                <div
                  className={`${selectedFeature.colorClasses.bgLight} h-2 rounded-full transition-all duration-300`}
                  style={{
                    width: `${(completedSteps.length / selectedFeature.steps.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Overall Demo Progress</h4>
            <p className="text-sm text-gray-600">
              Complete all sections to unlock the full experience
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round((completedSteps.length / demoFeatures.reduce((acc, f) => acc + f.steps.length, 0)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>
    </div>
  )
}
