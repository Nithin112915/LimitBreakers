import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from '../models/User'

const MONGODB_URI = process.env.MONGODB_URI!

async function updatePasswords() {
  try {
    console.log('🔐 Updating user passwords...')
    
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash('password123', 12)
    console.log('🔑 Generated hash for password123:', hashedPassword)
    
    // Update all users with the correct password hash
    const result = await User.updateMany(
      {},
      { $set: { password: hashedPassword } }
    )
    
    console.log(`✅ Updated ${result.modifiedCount} users with new password hash`)
    
    // Verify by finding users
    const users = await User.find({}, 'name email').sort({ createdAt: 1 })
    console.log(`\n👥 Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log('   ---')
    })
    
    console.log('\n🔑 All users now have password: "password123"')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔚 Disconnected from database')
  }
}

updatePasswords()
