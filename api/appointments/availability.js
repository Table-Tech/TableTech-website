// Vercel Function for appointment availability
const { Client } = require('pg');

// Cache for availability
let availabilityCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Database configuration - Use DATABASE_URL as primary
const dbConfig = {
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_URL_new || process.env.DIRECT_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

async function getDbClient() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📅 GET /api/appointments/availability');
  console.log('🔍 Environment check:');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DATABASE_URL_new exists:', !!process.env.DATABASE_URL_new);
  console.log('DIRECT_DATABASE_URL exists:', !!process.env.DIRECT_DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Check if environment variables exist
  const hasDbConfig = process.env.DATABASE_URL || process.env.DATABASE_URL_new || process.env.DIRECT_DATABASE_URL;
  if (!hasDbConfig) {
    console.error('❌ No database configuration found');
    console.error('Checked: DATABASE_URL, DATABASE_URL_new, DIRECT_DATABASE_URL');
    return res.status(500).json({
      error: 'Database configuration missing',
      message: 'No database environment variable found. Please set DATABASE_URL in Vercel Environment Variables.',
      checked: ['DATABASE_URL', 'DATABASE_URL_new', 'DIRECT_DATABASE_URL']
    });
  }

  // Check cache
  if (availabilityCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    console.log('  📦 Returning cached data');
    return res.json(availabilityCache);
  }

  let client;
  try {
    client = await getDbClient();
    console.log('✅ Database connected');

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

    console.log(`  ✅ Returning ${slots.length} slots`);
    res.json(response);
  } catch (error) {
    console.error('  ❌ Error:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      error: 'Failed to fetch availability',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
};