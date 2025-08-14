#!/usr/bin/env node

const axios = require('axios');

// Test data for appointment
const testData = {
  restaurantName: "Test Restaurant",
  contactPerson: "John Doe",
  email: "test@example.com",
  phone: "+31612345678", 
  date: "2025-08-15",
  time: "14:00",
  message: "Test appointment booking via V2 API"
};

async function testV2Appointment() {
  console.log('🧪 Testing V2 Appointment API...');
  console.log('Test data:', testData);
  
  try {
    console.log('\n📅 Creating appointment...');
    
    const response = await axios.post('http://localhost:3001/api/v2/appointments', testData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `test-${Date.now()}`
      },
      timeout: 30000
    });
    
    console.log('✅ Appointment created successfully!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.emailConfirmation) {
      console.log('\n📧 Email Status:');
      console.log('Customer email sent:', response.data.emailConfirmation.customer ? '✅' : '❌');
      console.log('Internal email sent:', response.data.emailConfirmation.internal ? '✅' : '❌');
      console.log('Message:', response.data.emailConfirmation.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testV2Appointment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });