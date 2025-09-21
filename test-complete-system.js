#!/usr/bin/env node

import dotenv from 'dotenv';
import pg from 'pg';
const { Client } = pg;

dotenv.config({ path: '.env.local' });

console.log('\n🔍 COMPLETE SYSTEM TEST FOR TABLETECH\n');
console.log('='.repeat(60));

// Test results
const issues = [];
const fixes = [];

// 1. CHECK ENVIRONMENT VARIABLES
console.log('\n1️⃣ CHECKING ENVIRONMENT VARIABLES\n');

// Check DATABASE_URL_new
if (!process.env.DATABASE_URL_new) {
  issues.push('❌ DATABASE_URL_new is not set');
  fixes.push('Add DATABASE_URL_new to .env.local and Vercel');
} else {
  console.log('✅ DATABASE_URL_new is set');
}

// Check RESEND_API_KEY
if (!process.env.RESEND_API_KEY) {
  issues.push('❌ RESEND_API_KEY is not set');
  fixes.push('Add RESEND_API_KEY to .env.local and Vercel');
} else {
  console.log('✅ RESEND_API_KEY is set');
}

// Check MAIL_FROM format
if (process.env.MAIL_FROM) {
  const mailFrom = process.env.MAIL_FROM;
  if (!mailFrom.includes('<') || !mailFrom.includes('>')) {
    issues.push(`❌ MAIL_FROM format is wrong: "${mailFrom}"`);
    fixes.push('Change MAIL_FROM to: TableTech <noreply@tabletech.nl>');
    console.log(`❌ MAIL_FROM format incorrect: ${mailFrom}`);
  } else {
    console.log(`✅ MAIL_FROM format correct: ${mailFrom}`);
  }
} else {
  console.log('⚠️ MAIL_FROM not set (will use default)');
}

// 2. TEST DATABASE CONNECTION AND STRUCTURE
console.log('\n2️⃣ TESTING DATABASE CONNECTION\n');

async function testDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL_new || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check appointments table
    const tableCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'appointments'
      ORDER BY ordinal_position
    `);

    if (tableCheck.rows.length === 0) {
      issues.push('❌ appointments table does not exist');
      fixes.push('Run setup-database.sql in Neon SQL editor');
      console.log('❌ appointments table not found');
    } else {
      console.log(`✅ appointments table exists with ${tableCheck.rows.length} columns`);
    }

    // Check for appointment conflicts
    const conflictCheck = await client.query(`
      SELECT
        appointment_date,
        appointment_time,
        COUNT(*) as count
      FROM appointments
      WHERE status != 'cancelled'
      GROUP BY appointment_date, appointment_time
      HAVING COUNT(*) > 1
    `);

    if (conflictCheck.rows.length > 0) {
      issues.push(`❌ Found ${conflictCheck.rows.length} time slot conflicts`);
      fixes.push('Review and resolve duplicate bookings');
      console.log(`❌ Found ${conflictCheck.rows.length} booking conflicts`);
    } else {
      console.log('✅ No booking conflicts found');
    }

    // Check availability_config
    const availCheck = await client.query(
      'SELECT COUNT(*) as count FROM availability_config WHERE is_active = true'
    );

    if (availCheck.rows[0].count === 0) {
      issues.push('❌ No availability configuration found');
      fixes.push('Run setup-database.sql to add default availability');
      console.log('❌ No availability configuration');
    } else {
      console.log(`✅ Availability configured for ${availCheck.rows[0].count} days`);
    }

    await client.end();
    return true;
  } catch (error) {
    issues.push(`❌ Database error: ${error.message}`);
    if (error.message.includes('does not exist')) {
      fixes.push('Run setup-database.sql in Neon SQL editor');
    } else {
      fixes.push('Check database connection string');
    }
    console.log(`❌ Database error: ${error.message}`);
    return false;
  }
}

// 3. TEST EMAIL SERVICE
console.log('\n3️⃣ TESTING EMAIL SERVICE\n');

async function testEmail() {
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ Cannot test email - no API key');
    return false;
  }

  try {
    // Determine from email
    let fromEmail = 'TableTech <info@tabletech.nl>';

    if (process.env.MAIL_FROM) {
      const cleanFrom = process.env.MAIL_FROM
        .replace(/["']/g, '')
        .trim();

      if (cleanFrom.includes('<') && cleanFrom.includes('>')) {
        fromEmail = cleanFrom;
      } else if (cleanFrom.includes('@')) {
        const parts = cleanFrom.split('@');
        const beforeAt = parts[0].trim();
        const afterAt = parts[1].trim();
        const name = beforeAt.includes(' ')
          ? beforeAt.substring(0, beforeAt.lastIndexOf(' '))
          : 'TableTech';
        const localPart = beforeAt.includes(' ')
          ? beforeAt.substring(beforeAt.lastIndexOf(' ') + 1)
          : beforeAt;
        fromEmail = `${name} <${localPart}@${afterAt}>`;
      }
    }

    console.log(`Testing with from: ${fromEmail}`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: ['delivered@resend.dev'], // Resend test email that always succeeds
        subject: 'TableTech System Test',
        html: '<p>Testing email configuration</p>'
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email service is working');
      console.log(`   Email ID: ${result.id}`);
      return true;
    } else {
      issues.push(`❌ Email service error: ${JSON.stringify(result)}`);
      fixes.push('Check Resend API key and domain verification');
      console.log(`❌ Email service error: ${result.message || result.error}`);
      return false;
    }
  } catch (error) {
    issues.push(`❌ Email test failed: ${error.message}`);
    fixes.push('Check Resend configuration');
    console.log(`❌ Email test error: ${error.message}`);
    return false;
  }
}

// 4. CHECK BOOKING FLOW
console.log('\n4️⃣ CHECKING BOOKING FLOW\n');

async function testBookingFlow() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL_new || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Test if slots are properly checked
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const testDate = tomorrow.toISOString().split('T')[0];
    const testTime = '14:00';

    // Check if slot is available
    const availCheck = await client.query(
      `SELECT COUNT(*) as count
       FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND status != 'cancelled'`,
      [testDate, testTime + ':00']
    );

    if (availCheck.rows[0].count > 0) {
      console.log(`⚠️ Test slot ${testDate} ${testTime} is already booked`);
    } else {
      console.log(`✅ Test slot ${testDate} ${testTime} is available`);
    }

    // Check recent bookings
    const recentBookings = await client.query(`
      SELECT COUNT(*) as today_count
      FROM appointments
      WHERE created_at >= CURRENT_DATE
    `);

    console.log(`📊 Bookings today: ${recentBookings.rows[0].today_count}`);

    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ Booking flow test error: ${error.message}`);
    return false;
  }
}

// RUN ALL TESTS
async function runAllTests() {
  await testDatabase();
  await testEmail();
  await testBookingFlow();

  // SUMMARY
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 TEST SUMMARY\n');

  if (issues.length === 0) {
    console.log('✅ ALL SYSTEMS OPERATIONAL!');
    console.log('\nYour appointment system is ready to accept bookings.');
  } else {
    console.log(`❌ FOUND ${issues.length} ISSUES:\n`);
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue}`);
    });

    console.log('\n🔧 REQUIRED FIXES:\n');
    fixes.forEach((fix, i) => {
      console.log(`${i + 1}. ${fix}`);
    });

    console.log('\n📝 NEXT STEPS:');
    console.log('1. Fix environment variables in Vercel dashboard');
    console.log('2. Update MAIL_FROM format to include < > brackets');
    console.log('3. Run setup-database.sql in Neon SQL editor');
    console.log('4. Trigger new deployment on Vercel');
  }

  console.log('\n' + '='.repeat(60));
}

// Run tests
runAllTests().catch(console.error);