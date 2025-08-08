import mongoose, { Schema, Document } from 'mongoose'

export interface IDailyHabitLog extends Document {
  userId: mongoose.Types.ObjectId
  habitId: mongoose.Types.ObjectId
  date: Date
  completed: boolean
  completedAt?: Date
  weight: number // Task importance (1-5)
  streakCount: number
  notes?: string
  proofUrl?: string
  honorPoints: number // Points earned for this completion
  createdAt: Date
  updatedAt: Date
}

const DailyHabitLogSchema = new Schema<IDailyHabitLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  weight: { 
    type: Number, 
    default: 1, 
    min: 1, 
    max: 5,
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v) && v >= 1 && v <= 5
      },
      message: 'Weight must be an integer between 1 and 5'
    }
  },
  streakCount: { type: Number, default: 0 },
  notes: { type: String, maxlength: 500 },
  proofUrl: { type: String },
  honorPoints: { type: Number, default: 0 }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
DailyHabitLogSchema.index({ userId: 1, date: -1 })
DailyHabitLogSchema.index({ userId: 1, habitId: 1, date: -1 })
DailyHabitLogSchema.index({ date: 1, completed: 1 })

// Ensure one log per user per habit per day
DailyHabitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true })

export const DailyHabitLog = mongoose.models.DailyHabitLog || mongoose.model<IDailyHabitLog>('DailyHabitLog', DailyHabitLogSchema)
