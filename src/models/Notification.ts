import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: 'habit_reminder' | 'achievement' | 'social' | 'system'
  title: string
  message: string
  data?: {
    habitId?: mongoose.Types.ObjectId
    postId?: mongoose.Types.ObjectId
    userId?: mongoose.Types.ObjectId
    url?: string
  }
  read: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['habit_reminder', 'achievement', 'social', 'system'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    url: { type: String }
  },
  read: { type: Boolean, default: false },
  readAt: { type: Date }
}, {
  timestamps: true
})

// Index for better query performance
NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, read: 1 })

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)
