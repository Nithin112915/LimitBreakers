import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline'

// Dynamically import client components to prevent SSR issues
const InteractiveDemo = dynamic(() => import('../../components/Demo/InteractiveDemo').then(mod => ({ default: mod.InteractiveDemo })), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-[400px]"><div className="text-lg">Loading interactive demo...</div></div>
})

const VideoDemo = dynamic(() => import('../../components/Demo/VideoDemo').then(mod => ({ default: mod.VideoDemo })), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-[500px]"><div className="text-lg">Loading video demo...</div></div>
})

const DemoGuide = dynamic(() => import('../../components/Demo/DemoGuide').then(mod => ({ default: mod.DemoGuide })), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-[400px]"><div className="text-lg">Loading demo guide...</div></div>
})

const DemoDataProvider = dynamic(() => import('../../components/Demo/DemoDataProvider').then(mod => ({ default: mod.DemoDataProvider })), { 
  ssr: false 
})

export default function DemoPage() {
  return (
    <DemoDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Home
                </Link>
              </div>
              
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Limit Breakers Demo</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="btn-outline">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Experience Limit Breakers
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Take an interactive tour through all the features that make Limit Breakers 
              the ultimate platform for personal growth and habit building.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="btn-primary flex items-center text-lg px-8 py-4 cursor-pointer">
                <PlayIcon className="h-6 w-6 mr-3" />
                Start Interactive Demo
              </div>
              
              <Link 
                href="/features" 
                className="btn-outline flex items-center text-lg px-8 py-4"
              >
                Learn More About Features
              </Link>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Smart Habit Tracking",
                description: "AI-powered suggestions and adaptive scheduling",
                icon: "🎯",
                color: "primary"
              },
              {
                title: "Social Accountability",
                description: "Connect with friends and join challenges",
                icon: "👥",
                color: "secondary"
              },
              {
                title: "Gamification",
                description: "Earn points, levels, and achievements",
                icon: "🏆",
                color: "success"
              },
              {
                title: "AI Coach",
                description: "Personalized insights and motivation",
                icon: "🧠",
                color: "primary"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg border border-${feature.color}-100 hover:shadow-xl transition-shadow`}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className={`text-lg font-semibold text-${feature.color}-900 mb-2`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Join Thousands of Successful Users
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { number: "10,000+", label: "Active Users", color: "primary" },
                { number: "1M+", label: "Habits Completed", color: "secondary" },
                { number: "95%", label: "Success Rate", color: "success" },
                { number: "4.9★", label: "User Rating", color: "warning" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Demo Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Watch the Complete Demo
              </h2>
              <p className="text-lg text-gray-600">
                See all features in action with our guided video tour
              </p>
            </div>
            <VideoDemo />
          </div>

          {/* Demo Guide Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Step-by-Step Demo Guide
              </h2>
              <p className="text-lg text-gray-600">
                Follow our comprehensive guide to explore every feature in detail
              </p>
            </div>
            <DemoGuide />
          </div>

          {/* Interactive Demo Section */}
          <div id="interactive-demo" className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Interactive Feature Demo
              </h2>
              <p className="text-lg text-gray-600">
                Experience all features in action with our guided interactive demo
              </p>
            </div>
            
            {/* Demo will be rendered here */}
            <div className="min-h-[600px] flex items-center justify-center">
              <div className="btn-primary text-xl px-12 py-6 flex items-center cursor-pointer">
                <PlayIcon className="h-8 w-8 mr-4" />
                Launch Full Demo Experience
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Life?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of users who have already started their growth journey
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-secondary text-lg px-8 py-4">
                  Start Free Trial
                </Link>
                <Link href="/pricing" className="btn-outline-white text-lg px-8 py-4">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo Overlay */}
        <InteractiveDemo />
      </div>
    </DemoDataProvider>
  )
}
