#!/usr/bin/env node

const mongoose = require('mongoose');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/limitbreakers';

// Simple User schema
const userSchema = new mongoose.Schema({}, { strict: false });
const taskSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

async function showDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Show Users
    console.log('👥 USERS:');
    console.log('========================================');
    const users = await User.find({}).limit(10).lean();
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No Name'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username || 'N/A'}`);
        console.log(`   Honor Points: ${user.honorPoints || 0}`);
        console.log(`   Level: ${user.level || 1}`);
        console.log(`   Joined: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}`);
        console.log('   ---');
      });
    }

    console.log(`\n📊 Total Users: ${await User.countDocuments()}`);

    // Show Tasks/Habits
    console.log('\n📋 HABITS/TASKS:');
    console.log('========================================');
    const tasks = await Task.find({}).limit(10).lean();
    
    if (tasks.length === 0) {
      console.log('No habits/tasks found in database');
    } else {
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title}`);
        console.log(`   Description: ${task.description || 'No description'}`);
        console.log(`   Category: ${task.category || 'Uncategorized'}`);
        console.log(`   Difficulty: ${task.difficulty || 'Unknown'}`);
        console.log(`   Honor Points: ${task.honorPointsReward || 0}`);
        console.log(`   Created: ${task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}`);
        console.log('   ---');
      });
    }

    console.log(`\n📊 Total Habits: ${await Task.countDocuments()}`);

    // Show Collections
    console.log('\n🗄️  DATABASE COLLECTIONS:');
    console.log('========================================');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`📁 ${collection.name}`);
    });

    console.log('\n✅ Database overview complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

showDatabase();
