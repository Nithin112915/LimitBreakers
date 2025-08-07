import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  username: string // Unique username like @username
  avatar?: string
  honorPoints: number
  level: number
  joinedAt: Date
  stats: {
    postsCount: number
    followersCount: number
    followingCount: number
  }
  profile: {
    bio?: string
    skills: string[]
    achievements: string[]
    education: {
      institution: string
      degree: string
      year: number
    }[]
    experience: {
      company: string
      position: string
      duration: string
    }[]
    socialLinks: {
      linkedin?: string
      twitter?: string
      website?: string
    }
  }
  settings: {
    notifications: {
      email: boolean
      push: boolean
      reminders: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private'
      shareProgress: boolean
    }
  }
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  streaks: {
    current: number
    longest: number
    lastUpdated: Date
  }
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String },
  honorPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  joinedAt: { type: Date, default: Date.now },
  stats: {
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    achievements: [{ type: String }],
    education: [{
      institution: { type: String },
      degree: { type: String },
      year: { type: Number }
    }],
    experience: [{
      company: { type: String },
      position: { type: String },
      duration: { type: String }
    }],
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String }
    }
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { 
        type: String, 
        enum: ['public', 'friends', 'private'], 
        default: 'public' 
      },
      shareProgress: { type: Boolean, default: true }
    }
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  streaks: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
