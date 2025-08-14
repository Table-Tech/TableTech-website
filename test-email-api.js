const fetch = require('node-fetch');

async function testEmailAPI() {
  try {
    console.log('🧪 Testing email API...');
    
    const testData = {
      firstName: "Test",
      lastName: "User", 
      email: "test@example.com",
      phone: "+31612345678",
      restaurant: "Test Restaurant",
      preferredDate: "2025-08-15",
      preferredTime: "14:00",
      message: "Test afspraak voor email verificatie",
      formRenderTs: Date.now().toString(),
      hp: ""
    };
    
    const response = await fetch('http://localhost:3001/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ API call successful!');
      console.log('🎯 Request ID:', result.requestId);
    } else {
      console.log('❌ API call failed!');
      console.log('🚨 Error:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testEmailAPI();
