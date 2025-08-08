'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  PhotoIcon, 
  TrophyIcon, 
  ChartBarIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: {
    content: string
    type: string
    tags: string[]
    visibility: string
  }) => void
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('text')
  const [tags, setTags] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const postTypes = [
    { id: 'text', name: 'General', icon: ChatBubbleLeftIcon, color: 'text-gray-600' },
    { id: 'achievement', name: 'Achievement', icon: TrophyIcon, color: 'text-yellow-600' },
    { id: 'habit_progress', name: 'Progress', icon: ChartBarIcon, color: 'text-blue-600' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      await onSubmit({
        content: content.trim(),
        type: postType,
        tags: tagsArray,
        visibility
      })
      
      // Reset form
      setContent('')
      setPostType('text')
      setTags('')
      setVisibility('public')
      onClose()
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Share Your Progress</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Post Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Type
                </label>
                <div className="flex space-x-2">
                  {postTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPostType(type.id)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          postType === type.id
                            ? 'bg-primary-100 text-primary-700 border-primary-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        } border`}
                      >
                        <IconComponent className={`h-4 w-4 mr-2 ${type.color}`} />
                        {type.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Share your progress, achievements, or ask for support..."
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {content.length}/500
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="fitness, productivity, meditation (comma separated)"
                />
              </div>

              {/* Visibility */}
              <div className="mb-6">
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="public">Public - Everyone can see</option>
                  <option value="followers">Followers only</option>
                  <option value="private">Private - Only you</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Share Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
