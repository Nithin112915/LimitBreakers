import { HonorScoreCron } from '../services/HonorScoreCron'

/**
 * Initialize server-side services
 * This runs when the Next.js server starts
 */
export function initializeServerServices() {
  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
    console.log('🚀 Initializing server services...')
    
    // Initialize Honor Score cron jobs
    HonorScoreCron.initialize()
    
    console.log('✅ Server services initialized successfully')
  } else {
    console.log('ℹ️ Cron jobs disabled in development. Set ENABLE_CRON=true to enable.')
  }
}

// Auto-initialize when this module is imported in server context
if (typeof window === 'undefined') {
  initializeServerServices()
}
