// Test script to verify demo authentication
const { DEMO_USER, DEMO_CREDENTIALS } = require('./config/supabase');

console.log('Testing demo authentication...');
console.log('Demo User:', DEMO_USER);
console.log('Demo Credentials:', DEMO_CREDENTIALS);

// Test demo login logic
const testEmail = 'demo@tourist.com';
const testPassword = 'demo123';

console.log('\nTesting login with demo credentials:');
console.log('Input email:', testEmail);
console.log('Input password:', testPassword);
console.log('Expected email:', DEMO_CREDENTIALS.email);
console.log('Expected password:', DEMO_CREDENTIALS.password);

const emailMatch = testEmail === DEMO_CREDENTIALS.email;
const passwordMatch = testPassword === DEMO_CREDENTIALS.password;

console.log('\nMatching results:');
console.log('Email match:', emailMatch);
console.log('Password match:', passwordMatch);
console.log('Both match:', emailMatch && passwordMatch);

if (emailMatch && passwordMatch) {
  console.log('\n✅ Demo authentication should work!');
  console.log('User data that would be returned:', DEMO_USER);
} else {
  console.log('\n❌ Demo authentication will fail');
  console.log('Check the constants in config/supabase.js');
}
