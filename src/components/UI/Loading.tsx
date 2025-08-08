'use client'

import { motion } from 'framer-motion'
import { TrophyIcon } from '@heroicons/react/24/outline'

interface LoadingProps {
  message?: string
  fullScreen?: boolean
}

const Loading = ({ message = 'Loading...', fullScreen = true }: LoadingProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <div className="h-16 w-16 border-4 border-indigo-200 rounded-full"></div>
        <div className="absolute top-0 left-0 h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <TrophyIcon className="h-6 w-6 text-indigo-600" />
        </div>
      </motion.div>
      
      <div className="text-center">
        <motion.h3
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg font-semibold text-gray-900 mb-2"
        >
          {message}
        </motion.h3>
        <p className="text-sm text-gray-500">Please wait while we prepare your experience</p>
      </div>

      {/* Loading dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-indigo-600 rounded-full"
          />
        ))}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  )
}

export default Loading
