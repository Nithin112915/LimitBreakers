'use client'

import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useReducer, ReactNode } from 'react'

// App State Context
interface AppState {
  user: any
  habits: any[]
  honorPoints: number
  notifications: any[]
}

interface AppAction {
  type: string
  payload?: any
}

const initialState: AppState = {
  user: null,
  habits: [],
  honorPoints: 0,
  notifications: []
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_HABITS':
      return { ...state, habits: action.payload }
    case 'UPDATE_HONOR_POINTS':
      return { ...state, honorPoints: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </SessionProvider>
  )
}
