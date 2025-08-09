const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('testpassword123', 12);
    
    const testUser = {
      userId: 'LB123456',
      name: 'Test User',
      username: 'testuser',
      email: 'thisisnithin99@gmail.com',
      password: hashedPassword,
      bio: '',
      avatar: '',
      honorPoints: 0,
      level: 1,
      streak: {
        current: 0,
        longest: 0,
        lastCompletedDate: null
      },
      achievements: [],
      following: [],
      followers: [],
      isPrivate: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Test user object:', JSON.stringify(testUser, null, 2));
    console.log('\nYou can use this to manually insert into MongoDB if needed.');
    console.log('\nLogin credentials:');
    console.log('Email: thisisnithin99@gmail.com');
    console.log('Password: testpassword123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
