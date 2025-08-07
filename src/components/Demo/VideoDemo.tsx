'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayIcon, PauseIcon, SpeakerWaveIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scenes = [
    {
      title: "Welcome to Limit Breakers",
      duration: 4000, // milliseconds
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-2xl p-8 mx-auto max-w-md"
          >
            <h1 className="text-3xl font-bold mb-4">🚀 Limit Breakers</h1>
            <p className="text-lg">Your AI-powered personal growth companion</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">10K+</div>
                <div className="text-sm opacity-90">Users</div>
              </div>
              <div>
                <div className="text-xl font-bold">1M+</div>
                <div className="text-sm opacity-90">Habits</div>
              </div>
              <div>
                <div className="text-xl font-bold">95%</div>
                <div className="text-sm opacity-90">Success</div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Create Your Profile",
      duration: 4500,
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-xl"
            >
              JD
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-gray-600">Level 5 Growth Seeker</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2,450</div>
              <div className="text-sm text-yellow-700">Honor Points</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12 days</div>
              <div className="text-sm text-orange-700">Current Streak</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Build Powerful Habits",
      duration: 5000,
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Create a New Habit</h3>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Habit Title</label>
              <input 
                type="text" 
                value="Daily Morning Exercise"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-primary-700">
                🏃‍♂️ Fitness & Health
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
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
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Create Habit (+15 Honor Points)
            </motion.button>
          </div>
        </div>
      )
    },
    {
      title: "Track Your Progress",
      duration: 4500,
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
          <div className="space-y-3">
            {[
              { name: 'Morning Exercise', completed: true, points: 15, delay: 0.2 },
              { name: 'Reading', completed: true, points: 10, delay: 0.4 },
              { name: 'Meditation', completed: false, points: 12, delay: 0.6 },
            ].map((habit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: habit.delay }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  habit.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    habit.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {habit.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{habit.name}</span>
                </div>
                <span className={`text-sm font-semibold ${habit.completed ? 'text-green-600' : 'text-gray-400'}`}>
                  +{habit.points}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">+25 Points Earned Today</div>
              <div className="text-sm text-primary-700">2 of 3 habits completed</div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "AI Coach Insights",
      duration: 5000,
      content: (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mb-4"
          >
            <div className="bg-purple-500 rounded-full p-2 mr-3">
              <SpeakerWaveIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900">AI Coach Insights</h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-4 border border-purple-100 mb-4"
          >
            <p className="text-purple-800">
              "Great job on your 12-day streak! Consider adding a mindfulness practice to enhance your morning routine."
            </p>
          </motion.div>
          
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <h5 className="font-medium text-blue-900 text-sm mb-1">💡 New Suggestion</h5>
              <p className="text-xs text-blue-700">Add "5-minute meditation" after exercise</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <h5 className="font-medium text-green-900 text-sm mb-1">📊 Optimization Tip</h5>
              <p className="text-xs text-green-700">Success rate increases by 23% when you log before 8 AM</p>
            </motion.div>
          </div>
        </div>
      )
    },
    {
      title: "Community & Challenges",
      duration: 4500,
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">🏆 Leaderboard</h3>
          <div className="space-y-2">
            {[
              { rank: 1, name: 'Sarah Chen', points: 3200, isYou: false, delay: 0.2 },
              { rank: 2, name: 'Mike Johnson', points: 2800, isYou: false, delay: 0.4 },
              { rank: 3, name: 'You (John Doe)', points: 2450, isYou: true, delay: 0.6 },
            ].map((user, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: user.delay }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.isYou ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                    user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {user.rank}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <span className="text-sm font-semibold text-primary-600">
                  {user.points.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <h5 className="font-medium text-green-900 text-sm mb-1">🎯 Active Challenge</h5>
            <p className="text-xs text-green-700 mb-2">30-Day Fitness Challenge</p>
            <div className="flex justify-between text-xs">
              <span>Progress: 12/30 days</span>
              <span className="font-medium">🏆 500 bonus points</span>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Start Your Journey",
      duration: 4000,
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-8 mx-auto max-w-md"
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-4"
            >
              Ready to Transform?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg mb-6"
            >
              Join thousands building better habits with AI-powered insights
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Link 
                href="/auth/signup"
                className="block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/demo"
                className="block bg-primary-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-800 transition-colors"
              >
                Try Interactive Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (scenes[currentScene].duration / 100)
          const newProgress = prev + increment
          
          if (newProgress >= 100) {
            if (currentScene < scenes.length - 1) {
              setCurrentScene(prev => prev + 1)
              return 0
            } else {
              setIsPlaying(false)
              return 100
            }
          }
          return newProgress
        })
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentScene, scenes])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentScene(0)
    setProgress(0)
    setIsPlaying(true)
  }

  const handleSceneSelect = (index: number) => {
    setCurrentScene(index)
    setProgress(0)
    setIsPlaying(false)
  }

  const totalProgress = ((currentScene / scenes.length) * 100) + (progress / scenes.length)

  return (
    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
      {/* Video Player Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-white text-sm font-medium">
            Limit Breakers - Complete Feature Demo
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          {Math.floor(totalProgress)}% complete
        </div>
      </div>

      {/* Video Content */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-[500px] flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {scenes[currentScene]?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Video Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>
            
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Restart</span>
            </button>
          </div>
          
          <div className="text-white text-sm">
            Scene {currentScene + 1}: {scenes[currentScene]?.title}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-100"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>

        {/* Scene Navigation */}
        <div className="flex justify-center space-x-2 mb-4">
          {scenes.map((scene, index) => (
            <button
              key={index}
              onClick={() => handleSceneSelect(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentScene
                  ? 'bg-primary-600'
                  : index < currentScene
                  ? 'bg-green-500'
                  : 'bg-gray-600'
              }`}
              title={scene.title}
            />
          ))}
        </div>

        {/* Auto-play notification */}
        {currentScene === 0 && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 text-sm"
          >
            Click Play to start the guided demo tour
          </motion.div>
        )}
      </div>

      {/* Demo Actions */}
      <div className="bg-gray-800 p-6 text-center">
        <h3 className="text-white text-lg font-semibold mb-4">
          Want to experience the full platform?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/demo"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Try Interactive Demo
          </Link>
          <Link 
            href="/auth/signup"
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}
