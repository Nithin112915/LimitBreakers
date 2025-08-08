import mongoose, { Schema, Document } from 'mongoose'

export interface IHonorScore extends Document {
  userId: mongoose.Types.ObjectId
  period: {
    startDate: Date
    endDate: Date
    periodNumber: number // 1 for first half of month, 2 for second half
    month: number
    year: number
  }
  dailyLogs: {
    date: Date
    completed: boolean
    weight: number
    streakDay: number
    bonusPoints: number
  }[]
  calculation: {
    pointsEarned: number
    pointsLost: number
    rawScore: number
    maxPossiblePoints: number
    totalDaysCompleted: number
    totalDaysMissed: number
    averageWeight: number
    streakBonuses: number
    finalScore: number
    honorScore: number // Scaled to 1000
  }
  trends: {
    previousScore: number
    improvement: number
    consistencyRate: number
  }
  createdAt: Date
  updatedAt: Date
}

const HonorScoreSchema = new Schema<IHonorScore>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    periodNumber: { type: Number, required: true, min: 1, max: 2 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true }
  },
  dailyLogs: [{
    date: { type: Date, required: true },
    completed: { type: Boolean, required: true },
    weight: { type: Number, default: 1, min: 1, max: 5 },
    streakDay: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 0 }
  }],
  calculation: {
    pointsEarned: { type: Number, default: 0 },
    pointsLost: { type: Number, default: 0 },
    rawScore: { type: Number, default: 0 },
    maxPossiblePoints: { type: Number, default: 15 },
    totalDaysCompleted: { type: Number, default: 0 },
    totalDaysMissed: { type: Number, default: 0 },
    averageWeight: { type: Number, default: 1 },
    streakBonuses: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    honorScore: { type: Number, default: 0, min: 0, max: 1000 }
  },
  trends: {
    previousScore: { type: Number, default: 0 },
    improvement: { type: Number, default: 0 },
    consistencyRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
HonorScoreSchema.index({ userId: 1, 'period.year': 1, 'period.month': 1, 'period.periodNumber': 1 })
HonorScoreSchema.index({ userId: 1, createdAt: -1 })

export const HonorScore = mongoose.models.HonorScore || mongoose.model<IHonorScore>('HonorScore', HonorScoreSchema)
