'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeroSection } from '../components/Home/HeroSection'
import { FeaturesSection } from '../components/Home/FeaturesSection'
import { StatsSection } from '../components/Home/StatsSection'
import { TestimonialsSection } from '../components/Home/TestimonialsSection'
import { CTASection } from '../components/Home/CTASection'
import { VideoDemo } from '../components/Demo/VideoDemo'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showLanding, setShowLanding] = useState(false)

  useEffect(() => {
    console.log('HomePage useEffect - Status:', status, 'Session:', session)
    
    // Set a timeout to show landing page if loading takes too long
    const timeout = setTimeout(() => {
      if (status === 'loading') {
        setShowLanding(true)
      }
    }, 2000) // Show landing page after 2 seconds of loading

    if (status === 'authenticated' && session) {
      console.log('Redirecting to dashboard...')
      router.push('/dashboard')
    }

    return () => clearTimeout(timeout)
  }, [session, status, router])

  console.log('HomePage render - Status:', status, 'Session:', !!session)

  // Show loading only briefly, then show landing page
  if (status === 'loading' && !showLanding) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="text-center glass-morphism p-8 rounded-xl card-3d">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-accent border-t-transparent mx-auto mb-4 floating-animation"></div>
          <p className="premium-text text-lg neon-glow">Loading Limit Breakers...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show a quick redirect message
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="text-center glass-morphism p-8 rounded-xl card-3d">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-accent border-t-transparent mx-auto mb-4 floating-animation"></div>
          <p className="premium-text text-lg neon-glow">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Testing Dashboard Link */}
      <div className="glass-morphism border-l-4 border-gold-accent p-4 mb-4 card-3d">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 gold-accent floating-animation" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm premium-text">
              <strong className="neon-glow">For Testing:</strong> You can{' '}
              <a href="/dashboard" className="font-medium underline gold-accent hover:text-yellow-300 button-3d px-1 rounded transition-all">
                go directly to the dashboard
              </a>
              {' '}or{' '}
              <a href="/auth/signin" className="font-medium underline gold-accent hover:text-yellow-300 button-3d px-1 rounded transition-all">
                sign in here
              </a>
              {' '}with email: john@example.com, password: password123
            </p>
          </div>
        </div>
      </div>

      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      
      {/* Demo Section */}
      <section className="py-20 premium-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 glass-morphism p-8 rounded-xl card-3d">
            <h2 className="text-3xl font-bold premium-text mb-4 neon-glow">
              See Limit Breakers in Action
            </h2>
            <p className="text-xl premium-text-muted max-w-3xl mx-auto">
              Watch how our platform transforms habit building with AI-powered insights, 
              social accountability, and gamified personal growth.
            </p>
          </div>
          <VideoDemo />
        </div>
      </section>
      
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
