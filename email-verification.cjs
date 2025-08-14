#!/usr/bin/env node

// Email verificatie script voor TableTech
// Gebruik: node email-verification.cjs

async function verifyEmails() {
  console.log('📧 TableTech Email Verificatie Script');
  console.log('=====================================\n');

  // Test 1: Resend API connectiviteit
  console.log('1️⃣ Testing Resend API...');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_KDb9jyxe_6Xd3MB7JuxVT8KopL3uDa8Px',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TableTech Team <onboarding@resend.dev>',
        to: 'info@tabletech.nl',
        subject: '✅ Email Verificatie - TableTech System Check',
        html: '<h2>✅ Email systeem werkt!</h2><p>Dit is een verificatie dat emails correct worden verzonden.</p>',
        text: 'Email systeem werkt! Dit is een verificatie dat emails correct worden verzonden.'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ Resend API werkt - Email ID:', result.id);
    } else {
      console.log('   ❌ Resend API fout');
    }
  } catch (error) {
    console.log('   ❌ Resend API error:', error.message);
  }

  // Test 2: TableTech API
  console.log('\n2️⃣ Testing TableTech API...');
  try {
    const response = await fetch('http://localhost:3001/api/v2/appointments/slots?date=2025-08-20');
    if (response.ok) {
      console.log('   ✅ TableTech API bereikbaar');
    } else {
      console.log('   ❌ TableTech API niet bereikbaar');
    }
  } catch (error) {
    console.log('   ❌ TableTech API error - zorg dat API server draait');
  }

  console.log('\n📋 Verificatie Checklist:');
  console.log('   □ Check inbox info@tabletech.nl voor test emails');
  console.log('   □ Maak een test booking via website');
  console.log('   □ Controleer of beide emails (klant + business) aankomen');
  console.log('\n🔗 API Server: http://localhost:3001');
  console.log('🔗 Frontend: http://localhost:5174');
}

verifyEmails();
