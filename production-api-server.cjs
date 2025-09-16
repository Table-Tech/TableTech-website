// PRODUCTION API Server met echte Database en Email
// Dit simuleert de Vercel serverless functions lokaal met echte services

const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_XE2U8kfAILQR@ep-little-haze-agtrjreh.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
};

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY || 're_KxSUc845_8PT8WHE6ZK7py7hCCTRsLZDR');

// Cache for availability
let availabilityCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get DB client
async function getDbClient() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// GET /api/appointments/availability
app.get('/api/appointments/availability', async (req, res) => {
  console.log('📅 GET /api/appointments/availability');

  // Check cache
  if (availabilityCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    console.log('  📦 Returning cached data');
    return res.json(availabilityCache);
  }

  const client = await getDbClient();

  try {
    // Get availability config
    const availabilityResult = await client.query(
      'SELECT * FROM availability_config WHERE is_active = true ORDER BY day_of_week'
    );

    // Get blocked dates
    const blockedResult = await client.query(
      'SELECT * FROM blocked_dates WHERE blocked_date >= CURRENT_DATE'
    );

    // Get existing appointments
    const appointmentsResult = await client.query(
      `SELECT appointment_date, appointment_time
       FROM appointments
       WHERE appointment_date >= CURRENT_DATE
       AND appointment_date <= CURRENT_DATE + INTERVAL '30 days'
       AND status != 'cancelled'`
    );

    const slots = [];
    // Fix: Use correct date (2024 instead of system date)
    const today = new Date();
    today.setFullYear(2024);
    const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

    // Generate slots for next 30 days
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];

      // Check if date is blocked
      const isBlocked = blockedResult.rows.some(b =>
        b.blocked_date.toISOString().split('T')[0] === dateStr
      );

      if (isBlocked) continue;

      // Find config for this day
      const dayConfig = availabilityResult.rows.find(c => c.day_of_week === dayOfWeek);
      if (!dayConfig) continue;

      // Generate time slots
      const startTime = dayConfig.start_time;
      const endTime = dayConfig.end_time;
      const slotDuration = dayConfig.slot_duration;

      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += slotDuration) {
          const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

          // Check if slot is already booked
          const isBooked = appointmentsResult.rows.some(a =>
            a.appointment_date.toISOString().split('T')[0] === dateStr &&
            a.appointment_time.substring(0, 5) === time
          );

          // Check if slot is in the past (with timezone fix)
          const slotDateTime = new Date(`${dateStr}T${time}:00`);
          const now = new Date();
          now.setFullYear(2024); // Fix for year mismatch
          const isPast = slotDateTime < now;

          slots.push({
            date: dateStr,
            time: time,
            available: !isBooked && !isPast,
            dayName: dayNames[dayOfWeek]
          });
        }
      }
    }

    const response = {
      slots: slots,
      timezone: 'Europe/Amsterdam',
      generatedAt: new Date().toISOString()
    };

    // Update cache
    availabilityCache = response;
    cacheTimestamp = Date.now();

    console.log(`  ✅ Returning ${slots.length} slots`);
    res.json(response);
  } catch (error) {
    console.error('  ❌ Error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  } finally {
    await client.end();
  }
});

// GET /api/appointments/check-slot
app.get('/api/appointments/check-slot', async (req, res) => {
  const { date, time } = req.query;
  console.log(`🔍 GET /api/appointments/check-slot - Date: ${date}, Time: ${time}`);

  if (!date || !time) {
    return res.status(400).json({
      error: 'Date and time parameters are required',
      available: false
    });
  }

  const client = await getDbClient();

  try {
    const result = await client.query(
      `SELECT id FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND status != 'cancelled'
       LIMIT 1`,
      [date, time + ':00']
    );

    const isAvailable = result.rows.length === 0;

    console.log(`  ${isAvailable ? '✅ Available' : '❌ Booked'}`);

    res.json({
      available: isAvailable,
      date: date,
      time: time,
      reason: isAvailable ? null : 'Dit tijdslot is al geboekt'
    });
  } catch (error) {
    console.error('  ❌ Error:', error);
    res.status(500).json({ error: 'Failed to check slot', available: false });
  } finally {
    await client.end();
  }
});

// POST /api/appointments/create
app.post('/api/appointments/create', async (req, res) => {
  console.log('✉️ POST /api/appointments/create');
  console.log('  Body:', req.body);

  const {
    customer_name,
    customer_email,
    customer_phone,
    appointment_date,
    appointment_time,
    service_type,
    notes
  } = req.body;

  // Validation
  if (!customer_name || !customer_email || !customer_phone || !appointment_date || !appointment_time) {
    return res.status(400).json({
      error: 'Missing required fields',
      errors: []
    });
  }

  const client = await getDbClient();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Check if slot is available
    const checkResult = await client.query(
      `SELECT id FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND status != 'cancelled'
       FOR UPDATE`,
      [appointment_date, appointment_time + ':00']
    );

    if (checkResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Dit tijdslot is niet meer beschikbaar',
        field: 'appointment_time'
      });
    }

    // Create appointment
    const insertResult = await client.query(
      `INSERT INTO appointments
       (customer_name, customer_email, customer_phone,
        appointment_date, appointment_time, service_type,
        notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        customer_name,
        customer_email,
        customer_phone,
        appointment_date,
        appointment_time + ':00',
        service_type || 'Algemene consultatie',
        notes || '',
        'confirmed'
      ]
    );

    await client.query('COMMIT');

    const newAppointment = insertResult.rows[0];

    // Clear cache
    availabilityCache = null;

    console.log('  ✅ Appointment created:', newAppointment.id);

    // Send emails
    try {
      // Customer email
      const customerEmail = await resend.emails.send({
        from: 'TableTech <info@tabletech.nl>',
        to: customer_email,
        subject: `Afspraak bevestiging - ${appointment_date}`,
        html: `
          <h2>Afspraak Bevestiging</h2>
          <p>Beste ${customer_name},</p>
          <p>Uw afspraak is bevestigd voor:</p>
          <ul>
            <li><strong>Datum:</strong> ${appointment_date}</li>
            <li><strong>Tijd:</strong> ${appointment_time}</li>
            <li><strong>Service:</strong> ${service_type || 'Algemene consultatie'}</li>
          </ul>
          <p>Met vriendelijke groet,<br>TableTech</p>
        `
      });

      console.log('  📧 Customer email sent:', customerEmail.id);

      // Company notification
      const companyEmail = await resend.emails.send({
        from: 'TableTech System <info@tabletech.nl>',
        to: process.env.COMPANY_EMAIL || 'info@tabletech.nl',
        reply_to: customer_email,
        subject: `🔔 Nieuwe afspraak - ${customer_name}`,
        html: `
          <h2>Nieuwe Afspraak</h2>
          <h3>Klant Gegevens:</h3>
          <ul>
            <li><strong>Naam:</strong> ${customer_name}</li>
            <li><strong>Email:</strong> ${customer_email}</li>
            <li><strong>Telefoon:</strong> ${customer_phone}</li>
          </ul>
          <h3>Afspraak Details:</h3>
          <ul>
            <li><strong>Datum:</strong> ${appointment_date}</li>
            <li><strong>Tijd:</strong> ${appointment_time}</li>
            <li><strong>Service:</strong> ${service_type || 'Algemene consultatie'}</li>
            ${notes ? `<li><strong>Opmerkingen:</strong> ${notes}</li>` : ''}
          </ul>
        `
      });

      console.log('  📧 Company email sent:', companyEmail.id);
    } catch (emailError) {
      console.error('  ⚠️ Email error (appointment still created):', emailError);
    }

    res.status(201).json({
      success: true,
      appointment: {
        id: newAppointment.id,
        appointment_date: newAppointment.appointment_date,
        appointment_time: newAppointment.appointment_time,
        customer_name: newAppointment.customer_name,
        status: newAppointment.status
      },
      message: 'Afspraak succesvol aangemaakt. U ontvangt een bevestiging per email.'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('  ❌ Error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  } finally {
    await client.end();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 PRODUCTION API Server running on http://localhost:${PORT}
📊 Using REAL Neon Database
📧 Using REAL Resend Email Service

📝 Available endpoints:
   GET  /api/appointments/availability
   GET  /api/appointments/check-slot
   POST /api/appointments/create

✨ Ready for PRODUCTION testing!
⚠️ All appointments and emails are REAL!
  `);
});