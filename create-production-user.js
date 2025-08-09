const bcrypt = require('bcryptjs');

async function createProductionUser() {
  const password = 'test123456';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = {
    "userId": "LB999999",
    "name": "Production Test User",
    "username": "produser",
    "email": "test@example.com",
    "password": hashedPassword,
    "bio": "",
    "avatar": "",
    "honorPoints": 0,
    "level": 1,
    "streak": {
      "current": 0,
      "longest": 0,
      "lastCompletedDate": null
    },
    "achievements": [],
    "following": [],
    "followers": [],
    "isPrivate": false,
    "createdAt": new Date(),
    "updatedAt": new Date()
  };
  
  console.log('Production user object:', JSON.stringify(user, null, 2));
  console.log('\nLogin credentials:');
  console.log('Email: test@example.com');
  console.log('Password: test123456');
}

createProductionUser();
