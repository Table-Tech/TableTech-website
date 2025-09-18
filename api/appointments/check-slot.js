// Vercel Function for checking appointment slot availability
const { Client } = require('pg');

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

  const { date, time } = req.query;
  console.log(`🔍 GET /api/appointments/check-slot - Date: ${date}, Time: ${time}`);

  if (!date || !time) {
    return res.status(400).json({
      error: 'Date and time parameters are required',
      available: false
    });
  }

  // Check if environment variables exist
  const hasDbConfig = process.env.DATABASE_URL || process.env.DATABASE_URL_new || process.env.DIRECT_DATABASE_URL;
  if (!hasDbConfig) {
    console.error('❌ No database configuration found');
    return res.status(500).json({
      error: 'Database configuration missing',
      available: false
    });
  }

  let client;
  try {
    client = await getDbClient();

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
    res.status(500).json({ 
      error: 'Failed to check slot', 
      available: false,
      message: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
};