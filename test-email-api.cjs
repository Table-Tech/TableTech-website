async function testEmailAPI() {
  try {
    console.log('🧪 Testing email API...');
    
    const testData = {
      restaurantName: "Test Restaurant",
      contactPerson: "Test User",
      email: "test@example.com",
      phone: "+31612345678",
      date: "2025-08-18",
      time: "14:00",
      message: "Test afspraak voor email verificatie",
      formRenderTs: Date.now() - 5000, // 5 seconds ago to pass validation
      hp: ""
    };
    
    const response = await fetch('http://localhost:3001/api/v2/appointments', {
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
