#!/usr/bin/env node

import dotenv from 'dotenv';
import pg from 'pg';
const { Client } = pg;

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 Testing TableTech Services Connection\n');
console.log('=' .repeat(50));

// Test results tracker
const results = {
  database: false,
  resend: false
};

// 1. TEST DATABASE CONNECTION
async function testDatabase() {
  console.log('\n📊 TESTING DATABASE CONNECTION');
  console.log('-'.repeat(30));

  const connectionString = process.env.DATABASE_URL_new || process.env.DATABASE_URL;

  if (!connectionString) {
    console.log('❌ No database URL found in environment');
    return false;
  }

  console.log('✓ Database URL found');
  console.log(`  Host: ${connectionString.includes('neon.tech') ? 'Neon Cloud' : 'Unknown'}`);

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to database');

    // Test query
    const result = await client.query('SELECT NOW() as time, version() as version');
    console.log('✓ Database query successful');
    console.log(`  Server time: ${result.rows[0].time}`);

    // Check appointments table
    const tableCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM appointments
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    console.log(`✓ Appointments table accessible`);
    console.log(`  Recent appointments (last 7 days): ${tableCheck.rows[0].count}`);

    await client.end();
    results.database = true;
    return true;
  } catch (error) {
    console.log('❌ Database connection failed');
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

// 2. TEST RESEND API
async function testResend() {
  console.log('\n📧 TESTING RESEND EMAIL SERVICE');
  console.log('-'.repeat(30));

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('❌ No Resend API key found');
    return false;
  }

  console.log('✓ Resend API key found');
  console.log(`  Key: ${apiKey.substring(0, 10)}...`);

  try {
    // Test API key validity
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TableTech <info@tabletech.nl>',
        to: ['test@resend.dev'], // Resend's test email
        subject: 'Test Connection',
        html: '<p>Testing TableTech email service</p>'
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✓ Resend API key is valid');
      console.log('✓ Email service is operational');
      console.log(`  Test email ID: ${result.id}`);
      results.resend = true;
      return true;
    } else {
      console.log('❌ Resend API error');
      console.log(`  Status: ${response.status}`);
      console.log(`  Error: ${JSON.stringify(result)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to connect to Resend');
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

// 3. TEST INTEGRATION
async function testIntegration() {
  console.log('\n🔗 TESTING SERVICE INTEGRATION');
  console.log('-'.repeat(30));

  if (results.database && results.resend) {
    console.log('✅ Both services are operational');
    console.log('✅ System ready to accept appointments');

    // Check environment
    console.log('\n📌 DEPLOYMENT CHECKLIST:');
    console.log('  ✓ Database connected (Neon)');
    console.log('  ✓ Email service active (Resend)');
    console.log('  ✓ Domain verified (tabletech.nl)');

    if (process.env.VERCEL_ENV) {
      console.log(`  ✓ Deployed on Vercel (${process.env.VERCEL_ENV})`);
    } else {
      console.log('  ⚠️  Not running on Vercel (local environment)');
    }
  } else {
    console.log('⚠️  Some services are not working:');
    if (!results.database) console.log('  ❌ Database connection failed');
    if (!results.resend) console.log('  ❌ Email service not configured');

    console.log('\n📝 TO FIX:');
    if (!results.database) {
      console.log('  1. Set DATABASE_URL_new in Vercel Environment Variables');
      console.log('     Go to: https://vercel.com/[your-team]/tabletech-website/settings/environment-variables');
    }
    if (!results.resend) {
      console.log('  2. Set RESEND_API_KEY in Vercel Environment Variables');
      console.log('     Get key from: https://resend.com/api-keys');
    }
  }
}

// Run all tests
async function runTests() {
  await testDatabase();
  await testResend();
  await testIntegration();

  console.log('\n' + '='.repeat(50));
  console.log('Test completed!');
  process.exit(results.database && results.resend ? 0 : 1);
}

runTests().catch(console.error);