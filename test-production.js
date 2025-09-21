#!/usr/bin/env node

console.log('🔍 Testing TableTech Production Environment\n');
console.log('='.repeat(60));

// 1. Test API endpoints
async function testEndpoints() {
  console.log('\n📡 TESTING API ENDPOINTS:\n');

  const endpoints = [
    { url: 'https://tabletech.nl/api/test-email', method: 'GET' },
    { url: 'https://tabletech.nl/api/appointments/availability', method: 'GET' },
    { url: 'https://tabletech.nl/api/appointments/check-slot?date=2025-09-25&time=14:00', method: 'GET' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint.url}`);
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ Status: ${response.status}`);
        console.log(`  Response keys:`, Object.keys(data));
      } else {
        console.log(`  ❌ Status: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

// 2. Test email sending
async function testEmailSending() {
  console.log('\n📧 TESTING EMAIL SERVICE:\n');

  try {
    const response = await fetch('https://tabletech.nl/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testEmail: 'info@tabletech.nl'
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Email service is working on production');
      console.log(`  Email ID: ${data.emailId}`);
    } else {
      console.log('❌ Email service error:', data);
    }
  } catch (error) {
    console.log('❌ Failed to test email:', error.message);
  }
}

// 3. Test appointment creation (dry run)
async function testAppointmentCreation() {
  console.log('\n📅 TESTING APPOINTMENT CREATION:\n');

  const testData = {
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '+31612345678',
    appointment_date: '2025-09-25',
    appointment_time: '14:00',
    service_type: 'Test Consultatie',
    notes: 'Dit is een test - kan verwijderd worden',
    language: 'nl'
  };

  console.log('NOTE: Not actually creating appointment (dry run only)');
  console.log('Test data would be:', testData);
}

// 4. Check environment
async function checkEnvironment() {
  console.log('\n🔧 ENVIRONMENT CHECK:\n');

  // Check if site is accessible
  try {
    const response = await fetch('https://tabletech.nl');
    if (response.ok) {
      console.log('✅ Website is accessible');
    } else {
      console.log(`⚠️ Website returned status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Website not accessible:', error.message);
  }

  // Check API base
  try {
    const response = await fetch('https://tabletech.nl/api/appointments/availability');
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      console.log('✅ API returns JSON');
    } else {
      console.log(`⚠️ API returns: ${contentType}`);
    }
  } catch (error) {
    console.log('❌ API check failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  await checkEnvironment();
  await testEndpoints();
  await testEmailSending();
  await testAppointmentCreation();

  console.log('\n' + '='.repeat(60));
  console.log('\n📝 REQUIRED ACTIONS ON VERCEL:\n');
  console.log('1. Update MAIL_FROM to: TableTech <noreply@tabletech.nl>');
  console.log('2. Make sure RESEND_API_KEY is set correctly');
  console.log('3. Make sure DATABASE_URL_new is set (not DATABASE_URL)');
  console.log('4. Redeploy after changing environment variables');
  console.log('\n' + '='.repeat(60));
}

runTests().catch(console.error);