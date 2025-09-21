#!/usr/bin/env node

import dotenv from 'dotenv';
import pg from 'pg';
const { Client } = pg;

dotenv.config({ path: '.env.local' });

async function checkAppointments() {
  console.log('📅 Checking Recent Appointments\n');
  console.log('='.repeat(60));

  const connectionString = process.env.DATABASE_URL_new || process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Get last 10 appointments
    const result = await client.query(`
      SELECT
        id,
        customer_name,
        customer_email,
        appointment_date,
        appointment_time,
        status,
        created_at
      FROM appointments
      ORDER BY created_at DESC
      LIMIT 10
    `);

    console.log(`\nFound ${result.rows.length} recent appointments:\n`);

    result.rows.forEach((apt, index) => {
      const date = new Date(apt.appointment_date).toLocaleDateString('nl-NL');
      const created = new Date(apt.created_at).toLocaleString('nl-NL');

      console.log(`${index + 1}. ${apt.customer_name}`);
      console.log(`   📧 ${apt.customer_email}`);
      console.log(`   📅 ${date} om ${apt.appointment_time.substring(0, 5)}`);
      console.log(`   ✓ Status: ${apt.status}`);
      console.log(`   🕐 Gemaakt: ${created}`);
      console.log(`   ID: ${apt.id}`);
      console.log('');
    });

    // Count total appointments
    const countResult = await client.query('SELECT COUNT(*) as total FROM appointments');
    console.log('='.repeat(60));
    console.log(`Totaal aantal afspraken in database: ${countResult.rows[0].total}`);

    // Check for today's appointments
    const todayResult = await client.query(`
      SELECT COUNT(*) as count
      FROM appointments
      WHERE appointment_date = CURRENT_DATE
      AND status != 'cancelled'
    `);
    console.log(`Afspraken voor vandaag: ${todayResult.rows[0].count}`);

    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAppointments().catch(console.error);