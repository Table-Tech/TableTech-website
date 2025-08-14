#!/usr/bin/env node

const { sendAppointmentEmails } = require('../dist/lib/email/mailer.js');

const testEmailData = {
  firstName: 'Test',
  lastName: 'Gebruiker',
  email: 'test@example.com',
  phone: '0612345678',
  restaurant: 'Test Restaurant',
  preferredDate: '2025-08-15',
  preferredTime: '10:00',
  message: 'Dit is een test bericht voor de email service'
};

const requestId = 'TEST-' + Date.now();
const ipHash = 'test-hash';

console.log('🧪 Testing email service...');
console.log('Email data:', testEmailData);

sendAppointmentEmails(testEmailData, requestId, ipHash)
  .then(result => {
    console.log('✅ Email test completed!');
    console.log('Results:', result);
  })
  .catch(error => {
    console.error('❌ Email test failed:', error);
  });