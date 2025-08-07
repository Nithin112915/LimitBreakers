import mongoose from 'mongoose'
import { User } from '../models/User'

const MONGODB_URI = process.env.MONGODB_URI!

async function checkUsers() {
  try {
    console.log('🔍 Checking database users...')
    
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    const users = await User.find({}, 'name email createdAt').sort({ createdAt: 1 })
    
    console.log(`\n👥 Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log('   ---')
    })
    
    console.log('\n📧 You can sign in with any of these email addresses.')
    console.log('🔑 All demo users have the password: "password123"')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔚 Disconnected from database')
  }
}

checkUsers()
