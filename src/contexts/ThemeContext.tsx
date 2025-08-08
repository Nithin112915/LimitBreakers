'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeSettings {
  theme: 'light' | 'dark' | 'auto'
  accentColor: 'indigo' | 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink' | 'teal'
  fontSize: 'small' | 'medium' | 'large'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  sidebarStyle: 'compact' | 'expanded' | 'floating'
  backgroundPattern: 'none' | 'dots' | 'grid' | 'waves'
  animationsEnabled: boolean
  highContrast: boolean
  compactMode: boolean
}

const defaultThemeSettings: ThemeSettings = {
  theme: 'light',
  accentColor: 'indigo',
  fontSize: 'medium',
  borderRadius: 'medium',
  sidebarStyle: 'expanded',
  backgroundPattern: 'none',
  animationsEnabled: true,
  highContrast: false,
  compactMode: false,
}

interface ThemeContextType {
  themeSettings: ThemeSettings
  updateTheme: (settings: Partial<ThemeSettings>) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Load theme settings from localStorage or API
    const savedSettings = localStorage.getItem('limitbreakers-theme-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setThemeSettings({ ...defaultThemeSettings, ...parsed })
      } catch (error) {
        console.error('Error parsing saved theme settings:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Determine if dark mode should be active
    let shouldBeDark = false
    
    if (themeSettings.theme === 'dark') {
      shouldBeDark = true
    } else if (themeSettings.theme === 'auto') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    setIsDarkMode(shouldBeDark)
    
    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Apply CSS custom properties for theme
    const root = document.documentElement
    
    // Accent color variables
    const accentColors = {
      indigo: { primary: '79 70 229', secondary: '99 102 241' },
      purple: { primary: '147 51 234', secondary: '168 85 247' },
      blue: { primary: '59 130 246', secondary: '96 165 250' },
      green: { primary: '34 197 94', secondary: '74 222 128' },
      orange: { primary: '249 115 22', secondary: '251 146 60' },
      red: { primary: '239 68 68', secondary: '248 113 113' },
      pink: { primary: '236 72 153', secondary: '244 114 182' },
      teal: { primary: '20 184 166', secondary: '45 212 191' }
    }
    
    const colorSet = accentColors[themeSettings.accentColor as keyof typeof accentColors] || accentColors.indigo
    root.style.setProperty('--color-primary', colorSet.primary)
    root.style.setProperty('--color-primary-light', colorSet.secondary)
    
    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
    root.style.setProperty('--base-font-size', fontSizes[themeSettings.fontSize])
    
    // Border radius
    const borderRadii = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '16px'
    }
    root.style.setProperty('--border-radius', borderRadii[themeSettings.borderRadius])
    
    // Animations
    root.style.setProperty('--animation-duration', themeSettings.animationsEnabled ? '0.3s' : '0s')
    
    // High contrast
    if (themeSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Compact mode
    if (themeSettings.compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }
    
    // Save to localStorage
    localStorage.setItem('limitbreakers-theme-settings', JSON.stringify(themeSettings))
  }, [themeSettings])

  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <ThemeContext.Provider value={{ themeSettings, updateTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
