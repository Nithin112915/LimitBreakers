import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  author: mongoose.Types.ObjectId
  content: string
  images?: string[]
  type: 'text' | 'image' | 'achievement' | 'habit_progress'
  tags: string[]
  likes: mongoose.Types.ObjectId[]
  comments: {
    user: mongoose.Types.ObjectId
    content: string
    createdAt: Date
  }[]
  metadata?: {
    habitId?: mongoose.Types.ObjectId
    achievementType?: string
    location?: string
  }
  visibility: 'public' | 'followers' | 'private'
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  type: { 
    type: String, 
    enum: ['text', 'image', 'achievement', 'habit_progress'], 
    default: 'text' 
  },
  tags: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  metadata: {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit' },
    achievementType: { type: String },
    location: { type: String }
  },
  visibility: { 
    type: String, 
    enum: ['public', 'followers', 'private'], 
    default: 'public' 
  }
}, {
  timestamps: true
})

// Index for better query performance
PostSchema.index({ author: 1, createdAt: -1 })
PostSchema.index({ visibility: 1, createdAt: -1 })

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
