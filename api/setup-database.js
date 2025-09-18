// API endpoint to setup database tables
// IMPORTANT: Run this ONCE to create all required tables
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to setup database.' });
  }

  console.log('🔧 Setting up database tables...');

  // Security check - require a setup key
  const setupKey = req.body?.setupKey || req.query?.setupKey;
  if (setupKey !== 'tabletech-setup-2024') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid setup key. Use { "setupKey": "tabletech-setup-2024" } in request body'
    });
  }

  // Find database connection string
  const connectionString =
    process.env.DATABASE_URL_new ||
    process.env.DIRECT_DATABASE_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    return res.status(500).json({
      error: 'No database connection string found',
      message: 'Please set DATABASE_URL_new in Vercel environment variables'
    });
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const results = [];

    // 1. Drop existing tables (be careful!)
    if (req.body?.dropExisting === true) {
      console.log('⚠️ Dropping existing tables...');
      await client.query('DROP TABLE IF EXISTS appointments CASCADE');
      await client.query('DROP TABLE IF EXISTS availability_config CASCADE');
      await client.query('DROP TABLE IF EXISTS blocked_dates CASCADE');
      results.push('Dropped existing tables');
    }

    // 2. Create appointments table
    console.log('📋 Creating appointments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        service_type VARCHAR(100),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(appointment_date, appointment_time)
      )
    `);
    results.push('Created appointments table');

    // 3. Create availability_config table
    console.log('⏰ Creating availability_config table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS availability_config (
        id SERIAL PRIMARY KEY,
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        slot_duration INTEGER DEFAULT 30,
        is_active BOOLEAN DEFAULT true,
        UNIQUE(day_of_week)
      )
    `);
    results.push('Created availability_config table');

    // 4. Create blocked_dates table
    console.log('🚫 Creating blocked_dates table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS blocked_dates (
        id SERIAL PRIMARY KEY,
        blocked_date DATE NOT NULL,
        reason VARCHAR(255),
        UNIQUE(blocked_date)
      )
    `);
    results.push('Created blocked_dates table');

    // 5. Check if availability config exists
    const configCheck = await client.query('SELECT COUNT(*) FROM availability_config');

    if (configCheck.rows[0].count === '0') {
      // Insert default availability (Monday to Friday, 9:00-17:00)
      console.log('📅 Inserting default availability...');
      await client.query(`
        INSERT INTO availability_config (day_of_week, start_time, end_time, slot_duration, is_active) VALUES
        (1, '09:00:00', '17:00:00', 30, true), -- Monday
        (2, '09:00:00', '17:00:00', 30, true), -- Tuesday
        (3, '09:00:00', '17:00:00', 30, true), -- Wednesday
        (4, '09:00:00', '17:00:00', 30, true), -- Thursday
        (5, '09:00:00', '17:00:00', 30, true)  -- Friday
      `);
      results.push('Added default availability (Mon-Fri 9:00-17:00)');
    } else {
      results.push('Availability config already exists, skipped');
    }

    // 6. Create indexes
    console.log('🔍 Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(customer_email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_availability_day ON availability_config(day_of_week)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(blocked_date)');
    results.push('Created database indexes');

    // 7. Verify tables
    console.log('✔️ Verifying tables...');
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('appointments', 'availability_config', 'blocked_dates')
    `);

    await client.end();

    return res.json({
      success: true,
      message: 'Database setup completed successfully!',
      results: results,
      tables: tables.rows.map(t => t.table_name),
      nextSteps: [
        'Test the API at /api/appointments/availability',
        'Create appointments at /api/appointments/create',
        'Customize availability in the database'
      ]
    });

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);

    if (client) {
      await client.end();
    }

    return res.status(500).json({
      error: 'Database setup failed',
      message: error.message,
      hint: 'Check your database connection and permissions',
      code: error.code
    });
  }
};