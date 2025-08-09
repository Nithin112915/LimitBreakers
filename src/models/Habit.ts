import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description?: string
  category: 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'social' | 'other'
  difficulty?: 'easy' | 'medium' | 'hard'
  honorPointsReward: number
  honorPointsPenalty: number
  frequency: {
    type: 'daily' | 'weekly' | 'custom'
    daysOfWeek?: number[]
    customSchedule?: Date[]
  }
  reminders: {
    time?: string
    location?: string
    isEnabled: boolean
    snoozeEnabled: boolean
  }[]
  proofRequirements: {
    type: 'photo' | 'document' | 'video' | 'text'
    description: string
    isRequired: boolean
  }[]
  tags: string[]
  isActive: boolean
  createdAt: Date
  completions: {
    date: Date
    proofSubmitted?: {
      type: 'photo' | 'document' | 'video' | 'text'
      url?: string
      content?: string
      verificationStatus: 'pending' | 'approved' | 'rejected'
    }
    honorPointsAwarded: number
    notes?: string
  }[]
  analytics: {
    totalCompletions: number
    currentStreak: number
    longestStreak: number
    successRate: number
    lastUpdated: Date
  }
}

const TaskSchema = new Schema<ITask>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'social', 'other'],
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    required: false // Made optional
  },
  honorPointsReward: { type: Number, required: true },
  honorPointsPenalty: { type: Number, required: true },
  frequency: {
    type: { 
      type: String, 
      enum: ['daily', 'weekly', 'custom'],
      required: true 
    },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    customSchedule: [{ type: Date }]
  },
  reminders: [{
    time: { type: String },
    location: { type: String },
    isEnabled: { type: Boolean, default: true },
    snoozeEnabled: { type: Boolean, default: true }
  }],
  proofRequirements: [{
    type: { 
      type: String, 
      enum: ['photo', 'document', 'video', 'text'],
      required: true 
    },
    description: { type: String, required: true },
    isRequired: { type: Boolean, default: true }
  }],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  completions: [{
    date: { type: Date, required: true },
    proofSubmitted: {
      type: { 
        type: String, 
        enum: ['photo', 'document', 'video', 'text']
      },
      url: { type: String },
      content: { type: String },
      verificationStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    },
    honorPointsAwarded: { type: Number, required: true },
    notes: { type: String }
  }],
  analytics: {
    totalCompletions: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
})

// Index for efficient queries
TaskSchema.index({ userId: 1, isActive: 1 })
TaskSchema.index({ category: 1 })
TaskSchema.index({ 'completions.date': 1 })

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)
