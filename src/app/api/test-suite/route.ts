import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tests = [
    {
      endpoint: '/api/database-test',
      description: 'Test database connection',
      method: 'GET'
    },
    {
      endpoint: '/api/seed-database',
      description: 'Seed database with sample data',
      method: 'POST'
    },
    {
      endpoint: '/api/habits',
      description: 'Get user habits (requires auth)',
      method: 'GET'
    },
    {
      endpoint: '/api/habits',
      description: 'Create new habit (requires auth)',
      method: 'POST'
    },
    {
      endpoint: '/api/dashboard',
      description: 'Get dashboard stats (requires auth)',
      method: 'GET'
    },
    {
      endpoint: '/api/auth/session',
      description: 'Check authentication session',
      method: 'GET'
    }
  ]

  return NextResponse.json({
    success: true,
    message: 'API Test Suite - LimitBreakers',
    availableTests: tests,
    instructions: {
      authentication: 'Some endpoints require authentication. Sign in first at /auth/signin',
      testing: 'Use these endpoints to test functionality step by step',
      order: [
        '1. Test database connection',
        '2. Seed database with sample data',
        '3. Sign in to test authenticated endpoints',
        '4. Test habits API',
        '5. Test dashboard API'
      ]
    }
  })
}
