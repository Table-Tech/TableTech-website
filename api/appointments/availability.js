// Vercel Function for appointment availability - V3 with URL validation
const { Client } = require('pg');

// Cache for availability
let availabilityCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback data generator
function generateFallbackSlots() {
  const slots = [];
  const today = new Date();
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

  // Generate slots for next 14 days
  for (let d = 0; d < 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    // Add slots from 9:00 to 17:00
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Check if slot is in the past
        const slotDateTime = new Date(`${dateStr}T${time}:00`);
        const now = new Date();
        const amsterdamOffset = 2; // hours (summer time)
        now.setHours(now.getHours() + amsterdamOffset);
        const bufferTime = new Date(now.getTime() + 30 * 60000);
        const isPast = slotDateTime < bufferTime;

        // Only add future slots
        if (!isPast) {
          slots.push({
            date: dateStr,
            time: time,
            available: Math.random() > 0.3,
            dayName: dayNames[dayOfWeek]
          });
        }
      }
    }
  }

  return {
    slots: slots,
    timezone: 'Europe/Amsterdam',
    generatedAt: new Date().toISOString(),
    fallback: true,
    message: 'Using demo data - database connection pending'
  };
}

// Validate database URL
function isValidDatabaseUrl(url) {
  if (!url) return false;

  // Check if it's a proper PostgreSQL URL
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    return false;
  }

  // Check for invalid hostnames
  const invalidHosts = ['base', 'localhost', 'example.com', 'your-database-url'];
  for (const invalid of invalidHosts) {
    if (url.includes(invalid)) {
      console.error(`❌ Invalid database URL detected: contains '${invalid}'`);
      return false;
    }
  }

  // Check if it contains Neon hostname pattern
  if (!url.includes('.neon.tech') && !url.includes('.amazonaws.com')) {
    console.warn('⚠️ Database URL does not appear to be a Neon or AWS database');
  }

  return true;
}

module.exports = async function handler(req, res) {
  try {
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

    console.log('📅 GET /api/appointments/availability - V3');

    // Check DATABASE_URL_new first (Vercel setup)
    let connectionString = process.env.DATABASE_URL_new;
    let dbSource = 'DATABASE_URL_new';

    // Fallback to DATABASE_URL if needed
    if (!connectionString || !isValidDatabaseUrl(connectionString)) {
      connectionString = process.env.DATABASE_URL;
      dbSource = 'DATABASE_URL';
    }

    // Final fallback to DIRECT_DATABASE_URL
    if (!connectionString || !isValidDatabaseUrl(connectionString)) {
      connectionString = process.env.DIRECT_DATABASE_URL;
      dbSource = 'DIRECT_DATABASE_URL';
    }

    console.log('🔍 Database check:');
    console.log(`  Using: ${dbSource}`);
    console.log(`  Valid: ${isValidDatabaseUrl(connectionString)}`);

    // If no valid database URL, return fallback
    if (!connectionString || !isValidDatabaseUrl(connectionString)) {
      console.log('📦 No valid database URL - returning fallback data');
      console.log('  DATABASE_URL_new:', process.env.DATABASE_URL_new ? 'SET but invalid' : 'NOT SET');
      console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'SET but invalid' : 'NOT SET');

      const response = generateFallbackSlots();
      response.debug = {
        message: 'Database URL is invalid or not set correctly',
        help: 'Please set DATABASE_URL_new in Vercel with your Neon pooled connection string',
        example: 'postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require'
      };

      return res.status(200).json(response);
    }

    // Check cache
    if (availabilityCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      console.log('📦 Returning cached data');
      return res.status(200).json(availabilityCache);
    }

    // Try database connection
    let client = null;
    try {
      // Parse and validate connection
      console.log('🔌 Connecting to database...');
      const urlPreview = connectionString.substring(0, 30) + '...';
      console.log(`  URL preview: ${urlPreview}`);

      client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000 // 5 second timeout
      });

      await client.connect();
      console.log('✅ Database connected successfully');

      // Get availability config
      const availabilityResult = await client.query(
        'SELECT * FROM availability_config WHERE is_active = true ORDER BY day_of_week'
      );
      console.log(`  Found ${availabilityResult.rows.length} availability configs`);

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

            // For timezone correction (Amsterdam is UTC+1 or UTC+2)
            const amsterdamOffset = 2; // hours (summer time)
            now.setHours(now.getHours() + amsterdamOffset);

            // Add 30 minute buffer (don't allow booking within next 30 min)
            const bufferTime = new Date(now.getTime() + 30 * 60000);
            const isPast = slotDateTime < bufferTime;

            // Only include future slots
            if (!isPast) {
              slots.push({
                date: dateStr,
                time: time,
                available: !isBooked,
                dayName: dayNames[dayOfWeek]
              });
            }
          }
        }
      }

      const response = {
        slots: slots,
        timezone: 'Europe/Amsterdam',
        generatedAt: new Date().toISOString(),
        fromDatabase: true
      };

      // Update cache
      availabilityCache = response;
      cacheTimestamp = Date.now();

      console.log(`✅ Returning ${slots.length} slots from database`);
      return res.status(200).json(response);

    } catch (dbError) {
      console.error('⚠️ Database error:', dbError.message);

      // Specific error messages
      if (dbError.message.includes('ENOTFOUND')) {
        console.error('  → Database hostname not found. Check your DATABASE_URL.');
      } else if (dbError.message.includes('password authentication failed')) {
        console.error('  → Invalid database password. Check your credentials.');
      } else if (dbError.message.includes('does not exist')) {
        console.error('  → Database table missing. Run database setup script.');
      }

      console.log('📦 Returning fallback data due to database error');

      // Return fallback data with error info
      const response = generateFallbackSlots();
      response.debug = {
        error: dbError.message,
        source: dbSource,
        help: 'Check DATABASE_URL_new in Vercel Environment Variables'
      };

      return res.status(200).json(response);

    } finally {
      if (client) {
        try {
          await client.end();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }

  } catch (error) {
    // Ultimate fallback - should never reach here
    console.error('❌ Unexpected error:', error);
    return res.status(200).json(generateFallbackSlots());
  }
};