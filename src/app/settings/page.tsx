'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTheme } from '../../contexts/ThemeContext'
import { SettingsErrorBoundary } from '../../components/ErrorBoundary/SettingsErrorBoundary'
import { 
  CogIcon, 
  BellIcon, 
  PaintBrushIcon,
  EyeIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  ShieldCheckIcon,
  SwatchIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

interface UserSettings {
  _id?: string
  userId: string
  theme: 'light' | 'dark' | 'auto'
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  backgroundPattern: 'none' | 'dots' | 'grid' | 'waves'
  sidebarStyle: 'compact' | 'expanded' | 'floating'
  animationsEnabled: boolean
  highContrast: boolean
  compactMode: boolean
  notifications: {
    email: {
      habitReminders: boolean
      weeklyProgress: boolean
      achievementNotifications: boolean
      communityUpdates: boolean
      honorScoreUpdates: boolean
    }
    push: {
      habitReminders: boolean
      achievementNotifications: boolean
      honorScoreUpdates: boolean
    }
  }
  habits: {
    defaultDifficulty: number
    defaultReminder: {
      enabled: boolean
      time: string
    }
    showStreakAnimations: boolean
    autoArchiveCompleted: boolean
  }
  dashboard: {
    defaultView: 'compact' | 'detailed' | 'cards'
    showHonorScore: boolean
    showQuickStats: boolean
    showRecentActivity: boolean
    habitOrderBy: 'created' | 'alphabetical' | 'priority' | 'streak'
  }
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    showHonorScoreOnProfile: boolean
    showHabitsOnProfile: boolean
    allowFriendRequests: boolean
    showOnlineStatus: boolean
  }
  honorScore: {
    showDetailedBreakdown: boolean
    includeInLeaderboard: boolean
    notifyOnRankChange: boolean
  }
  community: {
    autoFollow: boolean
    showActivityFeed: boolean
    contentFilters: string[]
    defaultPostVisibility: 'public' | 'friends' | 'private'
  }
  aiCoach: {
    personalityType: 'motivational' | 'analytical' | 'friendly' | 'professional'
    recommendationFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly'
    includeExternalResources: boolean
  }
}

const defaultSettings: UserSettings = {
  userId: '',
  theme: 'auto',
  accentColor: 'indigo',
  fontSize: 'medium',
  borderRadius: 'medium',
  backgroundPattern: 'none',
  sidebarStyle: 'expanded',
  animationsEnabled: true,
  highContrast: false,
  compactMode: false,
  notifications: {
    email: {
      habitReminders: true,
      weeklyProgress: true,
      achievementNotifications: true,
      communityUpdates: false,
      honorScoreUpdates: true
    },
    push: {
      habitReminders: true,
      achievementNotifications: true,
      honorScoreUpdates: false
    }
  },
  habits: {
    defaultDifficulty: 3,
    defaultReminder: {
      enabled: true,
      time: '09:00'
    },
    showStreakAnimations: true,
    autoArchiveCompleted: false
  },
  dashboard: {
    defaultView: 'detailed',
    showHonorScore: true,
    showQuickStats: true,
    showRecentActivity: true,
    habitOrderBy: 'priority'
  },
  privacy: {
    profileVisibility: 'public',
    showHonorScoreOnProfile: true,
    showHabitsOnProfile: true,
    allowFriendRequests: true,
    showOnlineStatus: true
  },
  honorScore: {
    showDetailedBreakdown: true,
    includeInLeaderboard: true,
    notifyOnRankChange: true
  },
  community: {
    autoFollow: false,
    showActivityFeed: true,
    contentFilters: [],
    defaultPostVisibility: 'public'
  },
  aiCoach: {
    personalityType: 'motivational',
    recommendationFrequency: 'weekly',
    includeExternalResources: true
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const { themeSettings, updateTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('appearance')
  const [message, setMessage] = useState('')
  const [importing, setImporting] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    if (session) {
      fetchSettings()
    }
  }, [session])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (section: string, data: any) => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data })
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        
        // Update theme context if appearance settings changed
        if (section === 'theme' || section === 'accentColor' || section === 'fontSize' || 
            section === 'borderRadius' || section === 'backgroundPattern' || 
            section === 'sidebarStyle' || section === 'animationsEnabled' || 
            section === 'highContrast' || section === 'compactMode') {
          updateTheme({ [section]: data })
        }
        
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage('Failed to save settings. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const updateAppearance = async (key: string, value: any) => {
    // Update theme context immediately for real-time preview
    updateTheme({ [key]: value })
    
    // Then save to backend
    await updateSettings(key, value)
  }

  const exportSettings = async () => {
    try {
      const response = await fetch('/api/user/settings/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `limitbreakers-settings-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setMessage('Settings exported successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error exporting settings:', error)
      setMessage('Failed to export settings.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const importSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const importData = JSON.parse(text)

      const response = await fetch('/api/user/settings/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importData)
      })

      if (response.ok) {
        const result = await response.json()
        setSettings(result.settings)
        setMessage('Settings imported successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`Import failed: ${error.error}`)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error importing settings:', error)
      setMessage('Failed to import settings. Please check the file format.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setImporting(false)
      // Reset the file input
      event.target.value = ''
    }
  }

  const resetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return
    }

    setResetting(true)
    try {
      const response = await fetch('/api/user/settings/reset', {
        method: 'POST'
      })

      if (response.ok) {
        const resetSettings = await response.json()
        setSettings(resetSettings)
        setMessage('Settings reset to defaults successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      setMessage('Failed to reset settings.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setResetting(false)
    }
  }

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'habits', name: 'Habits', icon: CogIcon },
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'honorScore', name: 'Honor Score', icon: SparklesIcon },
    { id: 'community', name: 'Community', icon: UserGroupIcon },
    { id: 'aiCoach', name: 'AI Coach', icon: EyeIcon }
  ]

  const accentColors = [
    { name: 'Indigo', value: 'indigo', color: 'bg-indigo-500' },
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Green', value: 'green', color: 'bg-green-500' },
    { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
    { name: 'Red', value: 'red', color: 'bg-red-500' },
    { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
    { name: 'Teal', value: 'teal', color: 'bg-teal-500' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <SettingsErrorBoundary>
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">Customize your LimitBreakers experience</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={exportSettings}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Export Settings
                </button>
                <label className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                  {importing ? 'Importing...' : 'Import Settings'}
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    disabled={importing}
                    className="sr-only"
                  />
                </label>
                <button
                  onClick={resetSettings}
                  disabled={resetting}
                  className="px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {resetting ? 'Resetting...' : 'Reset to Defaults'}
                </button>
              </div>
            </div>
          </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex min-h-[600px]">
            {/* Sidebar */}
            <div className="w-72 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Categories</h2>
                <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div></div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Appearance</h2>
                    <p className="mt-2 text-gray-600">Customize how LimitBreakers looks and feels</p>
                  </div>
                  
                  {/* Theme Selection */}
                  <div className="bg-white rounded-lg p-6 border border-gray-100">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Theme Mode</h3>
                      <p className="text-gray-600">Choose your preferred color scheme</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: SunIcon, desc: 'Clean and bright' },
                        { value: 'dark', label: 'Dark', icon: MoonIcon, desc: 'Easy on your eyes' },
                        { value: 'auto', label: 'Auto', icon: ComputerDesktopIcon, desc: 'Match your system' }
                      ].map((theme) => {
                        const Icon = theme.icon
                        return (
                          <button
                            key={theme.value}
                            onClick={() => updateAppearance('theme', theme.value)}
                            className={`p-4 text-center rounded-lg border-2 transition-all hover:shadow-md ${
                              themeSettings.theme === theme.value
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`w-8 h-8 mx-auto mb-3 ${
                              themeSettings.theme === theme.value 
                                ? 'text-blue-600' 
                                : 'text-gray-500'
                            }`} />
                            <div className={`font-medium mb-1 ${
                              themeSettings.theme === theme.value 
                                ? 'text-blue-900' 
                                : 'text-gray-900'
                            }`}>{theme.label}</div>
                            <div className={`text-sm ${
                              themeSettings.theme === theme.value 
                                ? 'text-blue-600' 
                                : 'text-gray-500'
                            }`}>{theme.desc}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="bg-white rounded-lg p-6 border border-gray-100">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Accent Color</h3>
                      <p className="text-gray-600">Choose your brand color for buttons and highlights</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'indigo', name: 'Indigo', color: 'bg-indigo-500' },
                        { value: 'purple', name: 'Purple', color: 'bg-purple-500' },
                        { value: 'blue', name: 'Blue', color: 'bg-blue-500' },
                        { value: 'green', name: 'Green', color: 'bg-emerald-500' },
                        { value: 'orange', name: 'Orange', color: 'bg-orange-500' },
                        { value: 'red', name: 'Red', color: 'bg-red-500' },
                        { value: 'pink', name: 'Pink', color: 'bg-pink-500' },
                        { value: 'teal', name: 'Teal', color: 'bg-teal-500' }
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateAppearance('accentColor', color.value)}
                          className={`p-4 text-center rounded-lg border-2 transition-all hover:shadow-md ${
                            themeSettings.accentColor === color.value
                              ? 'border-gray-400 bg-gray-50 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 ${color.color} rounded-full mx-auto mb-2 shadow-sm`}></div>
                          <div className="font-medium text-sm text-gray-900">{color.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Typography</h3>
                      <p className="text-slate-600 dark:text-slate-400">Adjust text size for optimal readability</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'small', label: 'Small', preview: 'Aa', size: 'text-sm', desc: 'Compact' },
                        { value: 'medium', label: 'Medium', preview: 'Aa', size: 'text-lg', desc: 'Balanced' },
                        { value: 'large', label: 'Large', preview: 'Aa', size: 'text-xl', desc: 'Comfortable' }
                      ].map((size) => (
                        <button
                          key={size.value}
                          onClick={() => updateAppearance('fontSize', size.value)}
                          className={`group relative p-6 text-center rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                            themeSettings.fontSize === size.value
                              ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 scale-105'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className={`${size.size} font-bold mb-3 ${
                            themeSettings.fontSize === size.value 
                              ? 'text-indigo-600 dark:text-indigo-400' 
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                          }`}>
                            {size.preview}
                          </div>
                          <div className={`font-semibold mb-1 ${
                            themeSettings.fontSize === size.value 
                              ? 'text-indigo-900 dark:text-indigo-100' 
                              : 'text-slate-900 dark:text-slate-100'
                          }`}>{size.label}</div>
                          <div className={`text-sm ${
                            themeSettings.fontSize === size.value 
                              ? 'text-indigo-600 dark:text-indigo-300' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>{size.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Border Radius</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'none', label: 'None', class: 'rounded-none' },
                        { value: 'small', label: 'Small', class: 'rounded-sm' },
                        { value: 'medium', label: 'Medium', class: 'rounded-md' },
                        { value: 'large', label: 'Large', class: 'rounded-lg' }
                      ].map((radius) => (
                        <button
                          key={radius.value}
                          onClick={() => updateAppearance('borderRadius', radius.value)}
                          className={`p-4 border-2 transition-all duration-300 hover:shadow-md ${radius.class} ${
                            themeSettings.borderRadius === radius.value
                              ? 'border-primary bg-primary/10 text-primary scale-105 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className={`w-6 h-6 bg-gray-300 mx-auto mb-2 ${radius.class}`}></div>
                          <span className="text-sm">{radius.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Border Radius</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'none', label: 'None', class: 'rounded-none' },
                        { value: 'small', label: 'Small', class: 'rounded-sm' },
                        { value: 'medium', label: 'Medium', class: 'rounded-lg' },
                        { value: 'large', label: 'Large', class: 'rounded-2xl' }
                      ].map((radius) => (
                        <button
                          key={radius.value}
                          onClick={() => updateAppearance('borderRadius', radius.value)}
                          className={`p-4 text-sm font-medium border-2 transition-all duration-300 hover:shadow-md ${
                            radius.class
                          } ${
                            themeSettings.borderRadius === radius.value
                              ? 'border-primary bg-primary/10 text-primary scale-105 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className={`w-8 h-8 bg-primary/20 mx-auto mb-2 ${radius.class}`}></div>
                          {radius.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Background Pattern</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'none', label: 'None', pattern: 'bg-gray-100' },
                        { value: 'dots', label: 'Dots', pattern: 'bg-gray-100', style: { backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' } },
                        { value: 'grid', label: 'Grid', pattern: 'bg-gray-100', style: { backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' } },
                        { value: 'waves', label: 'Waves', pattern: 'bg-gray-100', style: { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' } }
                      ].map((pattern) => (
                        <button
                          key={pattern.value}
                          onClick={() => updateAppearance('backgroundPattern', pattern.value)}
                          className={`p-4 text-sm font-medium rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                            themeSettings.backgroundPattern === pattern.value
                              ? 'border-primary bg-primary/10 text-primary scale-105 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div 
                            className={`w-8 h-8 mx-auto mb-2 rounded-md ${pattern.pattern}`}
                            style={pattern.style}
                          ></div>
                          {pattern.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Sidebar Style</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'compact', label: 'Compact', icon: '||' },
                        { value: 'expanded', label: 'Expanded', icon: '|||' },
                        { value: 'floating', label: 'Floating', icon: '[ ]' }
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => updateAppearance('sidebarStyle', style.value)}
                          className={`p-4 text-sm font-medium rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                            themeSettings.sidebarStyle === style.value
                              ? 'border-primary bg-primary/10 text-primary scale-105 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="text-lg font-mono mx-auto mb-2">{style.icon}</div>
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Advanced Options</h3>
                      <p className="text-slate-600 dark:text-slate-400">Fine-tune your interface preferences</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span className="text-lg font-semibold text-slate-900 dark:text-white">Smooth Animations</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Enable fluid transitions and micro-interactions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={themeSettings.animationsEnabled}
                              onChange={(e) => updateAppearance('animationsEnabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="group p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                              <span className="text-lg font-semibold text-slate-900 dark:text-white">High Contrast</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Enhance text visibility for better accessibility</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={themeSettings.highContrast}
                              onChange={(e) => updateAppearance('highContrast', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="group p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                              <span className="text-lg font-semibold text-slate-900 dark:text-white">Compact Mode</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Optimize spacing for maximum content density</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={themeSettings.compactMode}
                              onChange={(e) => updateAppearance('compactMode', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-minimal">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-minimal flex items-center justify-center text-white dark:text-black text-xs font-bold">
                          LB
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Sample Card</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Clean, minimal design</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-minimal text-sm">Primary</button>
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-minimal text-sm">Secondary</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      {Object.entries(settings.notifications.email).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => {
                              const newNotifications = {
                                ...settings.notifications,
                                email: {
                                  ...settings.notifications.email,
                                  [key]: e.target.checked
                                }
                              }
                              updateSettings('notifications', newNotifications)
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      {Object.entries(settings.notifications.push).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => {
                              const newNotifications = {
                                ...settings.notifications,
                                push: {
                                  ...settings.notifications.push,
                                  [key]: e.target.checked
                                }
                              }
                              updateSettings('notifications', newNotifications)
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'habits' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Habit Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Difficulty Level</label>
                    <select
                      value={settings.habits.defaultDifficulty}
                      onChange={(e) => updateSettings('habits', {
                        ...settings.habits,
                        defaultDifficulty: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          {level} - {['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'][level - 1]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Reminder Time</label>
                    <input
                      type="time"
                      value={settings.habits.defaultReminder.time}
                      onChange={(e) => updateSettings('habits', {
                        ...settings.habits,
                        defaultReminder: {
                          ...settings.habits.defaultReminder,
                          time: e.target.value
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Show streak animations</span>
                      <input
                        type="checkbox"
                        checked={settings.habits.showStreakAnimations}
                        onChange={(e) => updateSettings('habits', {
                          ...settings.habits,
                          showStreakAnimations: e.target.checked
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-archive completed habits</span>
                      <input
                        type="checkbox"
                        checked={settings.habits.autoArchiveCompleted}
                        onChange={(e) => updateSettings('habits', {
                          ...settings.habits,
                          autoArchiveCompleted: e.target.checked
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Dashboard Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                    <select
                      value={settings.dashboard.defaultView}
                      onChange={(e) => updateSettings('dashboard', {
                        ...settings.dashboard,
                        defaultView: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="compact">Compact</option>
                      <option value="detailed">Detailed</option>
                      <option value="cards">Cards</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Habit Order</label>
                    <select
                      value={settings.dashboard.habitOrderBy}
                      onChange={(e) => updateSettings('dashboard', {
                        ...settings.dashboard,
                        habitOrderBy: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="priority">Priority</option>
                      <option value="created">Created Date</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="streak">Streak Length</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(settings.dashboard).filter(([key]) => 
                      ['showHonorScore', 'showQuickStats', 'showRecentActivity'].includes(key)
                    ).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => updateSettings('dashboard', {
                            ...settings.dashboard,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Privacy Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => updateSettings('privacy', {
                        ...settings.privacy,
                        profileVisibility: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(settings.privacy).filter(([key]) => 
                      key !== 'profileVisibility'
                    ).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => updateSettings('privacy', {
                            ...settings.privacy,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'honorScore' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Honor Score Settings</h2>
                  
                  <div className="space-y-3">
                    {Object.entries(settings.honorScore).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSettings('honorScore', {
                            ...settings.honorScore,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Community Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Post Visibility</label>
                    <select
                      value={settings.community.defaultPostVisibility}
                      onChange={(e) => updateSettings('community', {
                        ...settings.community,
                        defaultPostVisibility: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-follow back</span>
                      <input
                        type="checkbox"
                        checked={settings.community.autoFollow}
                        onChange={(e) => updateSettings('community', {
                          ...settings.community,
                          autoFollow: e.target.checked
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Show activity feed</span>
                      <input
                        type="checkbox"
                        checked={settings.community.showActivityFeed}
                        onChange={(e) => updateSettings('community', {
                          ...settings.community,
                          showActivityFeed: e.target.checked
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'aiCoach' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">AI Coach Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
                    <select
                      value={settings.aiCoach.personalityType}
                      onChange={(e) => updateSettings('aiCoach', {
                        ...settings.aiCoach,
                        personalityType: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="motivational">Motivational</option>
                      <option value="analytical">Analytical</option>
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation Frequency</label>
                    <select
                      value={settings.aiCoach.recommendationFrequency}
                      onChange={(e) => updateSettings('aiCoach', {
                        ...settings.aiCoach,
                        recommendationFrequency: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Include external resources</span>
                      <input
                        type="checkbox"
                        checked={settings.aiCoach.includeExternalResources}
                        onChange={(e) => updateSettings('aiCoach', {
                          ...settings.aiCoach,
                          includeExternalResources: e.target.checked
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {saving && (
          <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Saving settings...
          </div>
        )}
      </div>
    </div>
    </SettingsErrorBoundary>
  )
}
