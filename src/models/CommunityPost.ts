import mongoose, { Schema, Document } from 'mongoose'

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId
  content: string
  type: 'achievement' | 'progress' | 'question' | 'motivation' | 'challenge'
  attachments: {
    type: 'image' | 'video' | 'document'
    url: string
    caption?: string
  }[]
  tags: string[]
  likes: mongoose.Types.ObjectId[]
  comments: {
    userId: mongoose.Types.ObjectId
    content: string
    createdAt: Date
    likes: mongoose.Types.ObjectId[]
  }[]
  shares: number
  visibility: 'public' | 'friends' | 'private'
  relatedHabit?: mongoose.Types.ObjectId
  honorPointsAwarded?: number
  isPinned: boolean
  createdAt: Date
}

const CommunityPostSchema = new Schema<ICommunityPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['achievement', 'progress', 'question', 'motivation', 'challenge'],
    required: true 
  },
  attachments: [{
    type: { 
      type: String, 
      enum: ['image', 'video', 'document'],
      required: true 
    },
    url: { type: String, required: true },
    caption: { type: String }
  }],
  tags: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }],
  shares: { type: Number, default: 0 },
  visibility: { 
    type: String, 
    enum: ['public', 'friends', 'private'],
    default: 'public' 
  },
  relatedHabit: { type: Schema.Types.ObjectId, ref: 'Habit' },
  honorPointsAwarded: { type: Number },
  isPinned: { type: Boolean, default: false }
}, {
  timestamps: true
})

// Indexes for efficient queries
CommunityPostSchema.index({ userId: 1, createdAt: -1 })
CommunityPostSchema.index({ type: 1, visibility: 1 })
CommunityPostSchema.index({ tags: 1 })

export const CommunityPost = mongoose.models.CommunityPost || mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema)
