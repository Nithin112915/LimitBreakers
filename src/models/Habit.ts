import mongoose, { Schema, Document } from 'mongoose'

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description?: string
  category: 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'social' | 'other'
  difficulty: 'easy' | 'medium' | 'hard'
  honorPointsReward: number
  honorPointsPenalty: number
  frequency: {
    type: 'daily' | 'weekly' | 'custom'
    daysOfWeek?: number[] // 0-6, Sunday to Saturday
    customSchedule?: Date[]
  }
  reminders: {
    time?: string // HH:MM format
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
    successRate: number // percentage
    lastUpdated: Date
  }
}

const HabitSchema = new Schema<IHabit>({
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
    required: true 
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
HabitSchema.index({ userId: 1, isActive: 1 })
HabitSchema.index({ category: 1 })
HabitSchema.index({ 'completions.date': 1 })

export const Habit = mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema)
