import dbConnect from '../src/lib/mongodb.js'
import { User } from '../src/models/User.js'

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Test database connection
    await dbConnect()
    console.log('✅ Database connected successfully!')
    
    // Test basic query
    const userCount = await User.countDocuments()
    console.log(`📊 Current user count: ${userCount}`)
    
    // Test if we can create a simple query
    const users = await User.find().limit(3).select('name email')
    console.log('👥 Sample users:', users)
    
    console.log('🎉 Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    process.exit(0)
  }
}

testDatabaseConnection()
