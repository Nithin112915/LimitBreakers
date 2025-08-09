import mongoose from 'mongoose'

const UserSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // Removed unique: true since we have schema.index() below
  },
  // Theme Settings
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'auto'
  },
  accentColor: {
    type: String,
    enum: ['indigo', 'purple', 'blue', 'green', 'orange', 'red', 'pink', 'teal'],
    default: 'indigo'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  borderRadius: {
    type: String,
    enum: ['none', 'small', 'medium', 'large'],
    default: 'medium'
  },
  backgroundPattern: {
    type: String,
    enum: ['none', 'dots', 'grid', 'waves'],
    default: 'none'
  },
  sidebarStyle: {
    type: String,
    enum: ['compact', 'expanded', 'floating'],
    default: 'expanded'
  },
  animationsEnabled: {
    type: Boolean,
    default: true
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  compactMode: {
    type: Boolean,
    default: false
  },
  
  // Notification Settings
  notifications: {
    email: {
      habitReminders: { type: Boolean, default: true },
      weeklyProgress: { type: Boolean, default: true },
      achievementNotifications: { type: Boolean, default: true },
      communityUpdates: { type: Boolean, default: false },
      honorScoreUpdates: { type: Boolean, default: true }
    },
    push: {
      habitReminders: { type: Boolean, default: true },
      achievementNotifications: { type: Boolean, default: true },
      honorScoreUpdates: { type: Boolean, default: false }
    }
  },

  // Habit Settings
  habits: {
    defaultDifficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    defaultReminder: {
      enabled: { type: Boolean, default: true },
      time: { type: String, default: '09:00' }
    },
    showStreakAnimations: { type: Boolean, default: true },
    autoArchiveCompleted: { type: Boolean, default: false }
  },

  // Dashboard Settings
  dashboard: {
    defaultView: {
      type: String,
      enum: ['compact', 'detailed', 'cards'],
      default: 'detailed'
    },
    showHonorScore: { type: Boolean, default: true },
    showQuickStats: { type: Boolean, default: true },
    showRecentActivity: { type: Boolean, default: true },
    habitOrderBy: {
      type: String,
      enum: ['created', 'alphabetical', 'priority', 'streak'],
      default: 'priority'
    }
  },

  // Privacy Settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    showHonorScoreOnProfile: { type: Boolean, default: true },
    showHabitsOnProfile: { type: Boolean, default: true },
    allowFriendRequests: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true }
  },

  // Honor Score Settings
  honorScore: {
    showDetailedBreakdown: { type: Boolean, default: true },
    includeInLeaderboard: { type: Boolean, default: true },
    notifyOnRankChange: { type: Boolean, default: true }
  },

  // Community Settings
  community: {
    autoFollow: { type: Boolean, default: false },
    showActivityFeed: { type: Boolean, default: true },
    contentFilters: [{
      type: String,
      enum: ['profanity', 'sensitive', 'promotional']
    }],
    defaultPostVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    }
  },

  // AI Coach Settings
  aiCoach: {
    personalityType: {
      type: String,
      enum: ['motivational', 'analytical', 'friendly', 'professional'],
      default: 'motivational'
    },
    recommendationFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
      default: 'weekly'
    },
    includeExternalResources: { type: Boolean, default: true }
  }
}, {
  timestamps: true
})

UserSettingsSchema.index({ userId: 1 }, { unique: true })

export default mongoose.models.UserSettings || mongoose.model('UserSettings', UserSettingsSchema)
