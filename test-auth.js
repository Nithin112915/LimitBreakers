const bcrypt = require('bcryptjs');

// Test password matching
const plainPassword = 'testpassword123';
const hashedPassword = '$2a$12$PVRz1OB56gOzMvweCDfRtOTvYJfrYMYb2McINRSwgKDtoIRYeCX7G';

console.log('Testing password comparison...');
console.log('Plain password:', plainPassword);
console.log('Hashed password:', hashedPassword);

bcrypt.compare(plainPassword, hashedPassword).then(result => {
  console.log('Password comparison result:', result);
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
