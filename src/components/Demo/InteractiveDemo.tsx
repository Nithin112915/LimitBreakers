'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon, 
  BackwardIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface DemoStep {
  id: number
  title: string
  description: string
  component: React.ReactNode
  duration: number
  highlightSelector?: string
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Welcome to Limit Breakers",
    description: "Your AI-powered personal growth companion that helps you build lasting habits and achieve your goals.",
    component: <WelcomeDemo />,
    duration: 5000
  },
  {
    id: 2,
    title: "Create Your Profile",
    description: "Set up your personal profile with goals, skills, and preferences to get personalized recommendations.",
    component: <ProfileDemo />,
    duration: 6000
  },
  {
    id: 3,
    title: "Build Your First Habit",
    description: "Create habits with categories, difficulty levels, and custom reminders tailored to your lifestyle.",
    component: <HabitCreationDemo />,
    duration: 7000
  },
  {
    id: 4,
    title: "Track Your Progress",
    description: "Monitor your streaks, earn honor points, and watch your level increase as you complete habits.",
    component: <ProgressTrackingDemo />,
    duration: 6000
  },
  {
    id: 5,
    title: "AI Coach Insights",
    description: "Get personalized recommendations, motivational messages, and adaptive scheduling from your AI coach.",
    component: <AICoachDemo />,
    duration: 8000
  },
  {
    id: 6,
    title: "Submit Proof & Accountability",
    description: "Upload photos, documents, or videos as proof of completion to maintain accountability.",
    component: <ProofSubmissionDemo />,
    duration: 5000
  },
  {
    id: 7,
    title: "Community & Social Features",
    description: "Connect with others, join challenges, compete on leaderboards, and share your achievements.",
    component: <CommunityDemo />,
    duration: 7000
  },
  {
    id: 8,
    title: "Analytics & Insights",
    description: "View detailed analytics, streak calendars, success rates, and comprehensive progress reports.",
    component: <AnalyticsDemo />,
    duration: 6000
  }
]

export function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showDemo, setShowDemo] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStep < demoSteps.length) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (demoSteps[currentStep].duration / 100))
          
          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prev => prev + 1)
              return 0
            } else {
              setIsPlaying(false)
              return 100
            }
          }
          
          return newProgress
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentStep])

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setProgress(0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setProgress(0)
    }
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (!showDemo) {
    return null
  }

  const currentStepData = demoSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Demo Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Interactive Demo</h2>
              <p className="text-primary-100 mt-1">
                Step {currentStep + 1} of {demoSteps.length}: {currentStepData.title}
              </p>
            </div>
            <button
              onClick={() => setShowDemo(false)}
              className="text-white hover:text-primary-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-primary-800 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-100"
                style={{ width: `${((currentStep / demoSteps.length) * 100) + (progress / demoSteps.length)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600">
                  {currentStepData.description}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                {currentStepData.component}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Demo Controls */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <BackwardIcon className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={handlePlay}
                className="btn-primary flex items-center"
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentStep === demoSteps.length - 1}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ForwardIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentStep(index)
                  setProgress(0)
                  setIsPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Demo Components for each step
function WelcomeDemo() {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-2xl p-8 mx-auto max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-4">🚀 Limit Breakers</h2>
        <p className="text-lg mb-6">
          Transform your life with AI-powered habit tracking, social accountability, and gamified personal growth.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm opacity-90">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold">1M+</div>
            <div className="text-sm opacity-90">Habits Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm opacity-90">Success Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ProfileDemo() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
          JD
        </div>
        <div>
          <h3 className="text-xl font-semibold">John Doe</h3>
          <p className="text-gray-600">Level 5 Growth Seeker</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Goals & Interests</h4>
          <div className="flex flex-wrap gap-2">
            {['Fitness', 'Learning', 'Productivity', 'Mindfulness'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Current Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Honor Points</span>
              <span className="font-semibold text-primary-600">2,450</span>
            </div>
            <div className="flex justify-between">
              <span>Current Streak</span>
              <span className="font-semibold text-orange-600">12 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HabitCreationDemo() {
  const [currentField, setCurrentField] = useState(0)
  const fields = ['title', 'category', 'difficulty', 'frequency']
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentField(prev => (prev + 1) % fields.length)
    }, 1500)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Create a New Habit</h3>
      
      <div className="space-y-4">
        <div className={`transition-all duration-300 ${currentField === 0 ? 'ring-2 ring-primary-500' : ''}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Habit Title</label>
          <input 
            type="text" 
            value="Daily Morning Exercise"
            readOnly
            className="input-field"
          />
        </div>
        
        <div className={`transition-all duration-300 ${currentField === 1 ? 'ring-2 ring-primary-500' : ''}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select className="input-field" value="fitness" disabled>
            <option>Fitness & Health</option>
          </select>
        </div>
        
        <div className={`transition-all duration-300 ${currentField === 2 ? 'ring-2 ring-primary-500' : ''}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
          <div className="flex space-x-2">
            {['Easy', 'Medium', 'Hard'].map((level, index) => (
              <button
                key={level}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  index === 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${currentField === 3 ? 'ring-2 ring-primary-500' : ''}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-600">Daily at 7:00 AM</span>
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full mt-6"
      >
        Create Habit (+15 Honor Points)
      </motion.button>
    </div>
  )
}

function ProgressTrackingDemo() {
  const [completedDays, setCompletedDays] = useState(5)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedDays(prev => prev === 12 ? 5 : prev + 1)
    }, 600)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Your Progress Dashboard</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">2,450</div>
            <div className="text-sm text-yellow-700">Honor Points</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{completedDays} days</div>
            <div className="text-sm text-orange-700">Current Streak</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">Level 5</div>
            <div className="text-sm text-green-700">Growth Level</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {Array.from({ length: completedDays }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm">Morning Exercise completed</span>
                </div>
                <span className="text-sm text-green-600">+15 points</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AICoachDemo() {
  const [currentTip, setCurrentTip] = useState(0)
  const tips = [
    "Great job on your 12-day streak! Consider adding a mindfulness practice to enhance your morning routine.",
    "Your exercise consistency is impressive. Maybe try increasing the intensity slightly this week?",
    "Based on your patterns, Tuesdays seem challenging. Consider setting a motivational reminder.",
    "You're 85% of the way to Level 6! One more week of consistency will get you there."
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-500 rounded-full p-2 mr-3">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-purple-900">AI Coach Insights</h3>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-4 border border-purple-100"
          >
            <p className="text-purple-800">{tips[currentTip]}</p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center mt-4 space-x-1">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTip ? 'bg-purple-500' : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-medium mb-3">Personalized Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-900 mb-2">New Habit Suggestion</h5>
            <p className="text-sm text-blue-700">Add "5-minute meditation" after your exercise</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="font-medium text-green-900 mb-2">Optimization Tip</h5>
            <p className="text-sm text-green-700">Your success rate increases by 23% when you log before 8 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProofSubmissionDemo() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Submit Proof of Completion</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-600 mb-2">Upload photo or video proof</p>
          <button className="btn-outline">Choose File</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Xb3Jrb3V0IFBob3RvPC90ZXh0Pjwvc3ZnPg==" 
              alt="Workout proof" 
              className="w-full h-32 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">Morning run - 5km completed</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea 
                className="input-field h-20 resize-none" 
                placeholder="Great workout today! Felt energized throughout..."
                readOnly
                value="Great workout today! Felt energized throughout..."
              />
            </div>
            
            <button className="btn-primary w-full">
              Submit Proof (+15 Honor Points)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommunityDemo() {
  const [selectedTab, setSelectedTab] = useState('leaderboard')
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'leaderboard', label: 'Leaderboard' },
              { key: 'friends', label: 'Friends' },
              { key: 'challenges', label: 'Challenges' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {selectedTab === 'leaderboard' && (
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', points: 3200, level: 7, rank: 1 },
                { name: 'Mike Johnson', points: 2800, level: 6, rank: 2 },
                { name: 'You (John Doe)', points: 2450, level: 5, rank: 3 },
                { name: 'Lisa Wang', points: 2100, level: 5, rank: 4 }
              ].map(user => (
                <div key={user.name} className={`flex items-center justify-between p-4 rounded-lg ${
                  user.name.includes('You') ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                      user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : user.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">Level {user.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-600">{user.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedTab === 'friends' && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Connect with friends to share your progress and motivate each other!</p>
              <button className="btn-primary">Find Friends</button>
            </div>
          )}
          
          {selectedTab === 'challenges' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">30-Day Fitness Challenge</h4>
                <p className="text-sm text-green-700 mb-3">Complete any fitness habit for 30 consecutive days</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">Progress: 12/30 days</span>
                  <span className="text-sm font-medium text-green-800">🏆 500 bonus points</span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Team Learning Sprint</h4>
                <p className="text-sm text-blue-700 mb-3">Join a team and learn something new together</p>
                <button className="btn-outline btn-sm">Join Challenge</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AnalyticsDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex items-center">
                <div className="w-12 text-sm text-gray-600">{day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 w-8">{Math.floor(Math.random() * 5) + 1}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Success Rates</h3>
          <div className="space-y-4">
            {[
              { habit: 'Morning Exercise', rate: 92 },
              { habit: 'Reading', rate: 78 },
              { habit: 'Meditation', rate: 85 },
              { habit: 'Journaling', rate: 66 }
            ].map(item => (
              <div key={item.habit}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.habit}</span>
                  <span>{item.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      item.rate >= 80 ? 'bg-green-500' : item.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Streak Calendar</h3>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded border text-xs flex items-center justify-center ${
                Math.random() > 0.3 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">Green squares indicate days when you completed at least one habit</p>
      </div>
    </div>
  )
}
