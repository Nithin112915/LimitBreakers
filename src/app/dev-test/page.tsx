'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [seedResult, setSeedResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/database-test')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: 'Failed to test database' })
    }
    setLoading(false)
  }

  const seedDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seed-database', { method: 'POST' })
      const data = await response.json()
      setSeedResult(data)
    } catch (error) {
      setSeedResult({ success: false, error: 'Failed to seed database' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen gradient-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🔧 Database Test & Setup
          </h1>
          <p className="text-xl text-white/80">
            Test database connection and seed initial data
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Database Test */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔍 Database Connection Test
            </h2>
            <button
              onClick={testDatabase}
              disabled={loading}
              className="btn-primary w-full mb-4"
            >
              {loading ? 'Testing...' : 'Test Database'}
            </button>
            
            {testResult && (
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>

          {/* Database Seeding */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🌱 Seed Database
            </h2>
            <button
              onClick={seedDatabase}
              disabled={loading}
              className="btn-secondary w-full mb-4"
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </button>
            
            {seedResult && (
              <div className={`p-4 rounded-lg ${seedResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(seedResult, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 premium-card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🎯 Next Steps
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>1. ✅ Test database connection</p>
            <p>2. 🌱 Seed initial data (users, habits)</p>
            <p>3. 🔗 Test API endpoints</p>
            <p>4. 🎨 Connect frontend components</p>
            <p>5. 🚀 Full functionality test</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
