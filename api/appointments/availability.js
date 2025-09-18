// Vercel Function for appointment availability
const { Client } = require('pg');

// Cache for availability
let availabilityCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

module.exports = async function handler(req, res) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📅 GET /api/appointments/availability');
  console.log('🔍 Environment check:');
  console.log('DATABASE_URL_new exists:', !!process.env.DATABASE_URL_new);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Get connection string with priority
  const connectionString = process.env.DATABASE_URL_new ||
                           process.env.DATABASE_URL ||
                           process.env.DIRECT_DATABASE_URL;

  if (!connectionString) {
    console.error('❌ No database configuration found');
    return res.status(500).json({
      error: 'Database configuration missing',
      message: 'No database environment variable found. Please set DATABASE_URL_new in Vercel Environment Variables.',
      checked: ['DATABASE_URL_new', 'DATABASE_URL', 'DIRECT_DATABASE_URL'],
      envVars: Object.keys(process.env).filter(k => k.includes('DATABASE')).map(k => k)
    });
  }

  // Check cache
  if (availabilityCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    console.log('📦 Returning cached data');
    return res.status(200).json(availabilityCache);
  }

  let client = null;

  try {
    // Create client with connection string
    client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('🔌 Attempting to connect to database...');
    await client.connect();
    console.log('✅ Database connected successfully');

    // Test connection
    const testResult = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database query test successful:', testResult.rows[0].current_time);

    // Get availability config
    console.log('📊 Fetching availability config...');
    const availabilityResult = await client.query(
      'SELECT * FROM availability_config WHERE is_active = true ORDER BY day_of_week'
    );
    console.log(`✅ Found ${availabilityResult.rows.length} availability configs`);

    // Get blocked dates
    console.log('🚫 Fetching blocked dates...');
    const blockedResult = await client.query(
      'SELECT * FROM blocked_dates WHERE blocked_date >= CURRENT_DATE'
    );
    console.log(`✅ Found ${blockedResult.rows.length} blocked dates`);

    // Get existing appointments
    console.log('📅 Fetching existing appointments...');
    const appointmentsResult = await client.query(
      `SELECT appointment_date, appointment_time
       FROM appointments
       WHERE appointment_date >= CURRENT_DATE
       AND appointment_date <= CURRENT_DATE + INTERVAL '30 days'
       AND status != 'cancelled'`
    );
    console.log(`✅ Found ${appointmentsResult.rows.length} existing appointments`);

    const slots = [];
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

          // Check if slot is in the past
          const slotDateTime = new Date(`${dateStr}T${time}:00`);
          const now = new Date();
          now.setFullYear(2024);
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

    console.log(`✅ Returning ${slots.length} slots`);
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);

    // Specific error handling
    if (error.code === '42P01') {
      return res.status(500).json({
        error: 'Database table missing',
        message: 'The required database tables do not exist. Please run the database setup script.',
        details: error.message,
        table: error.message.match(/relation "(.*)" does not exist/)?.[1]
      });
    }

    if (error.message.includes('password authentication failed')) {
      return res.status(500).json({
        error: 'Database authentication failed',
        message: 'Unable to authenticate with the database. Please check DATABASE_URL_new in Vercel Environment Variables.',
        hint: 'Make sure you are using the pooled connection string from Neon'
      });
    }

    if (error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({
        error: 'Database connection refused',
        message: 'Unable to connect to the database server.',
        hint: 'The database might be sleeping or the URL is incorrect'
      });
    }

    // Generic error
    return res.status(500).json({
      error: 'Database error',
      message: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

  } finally {
    // Always close the connection
    if (client) {
      try {
        await client.end();
        console.log('🔌 Database connection closed');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
};