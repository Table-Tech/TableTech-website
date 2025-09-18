import { Pool } from '@neondatabase/serverless';
import fs from 'fs/promises';

const connectionString = 'postgresql://neondb_owner:npg_XE2U8kfAILQR@ep-little-haze-agtrjreh-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function setupDatabase() {
  const pool = new Pool({
    connectionString,
    ssl: true,
  });

  console.log('🔗 Connecting to Neon database...');

  try {
    // Drop existing tables if they exist
    console.log('🗑️ Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS appointments CASCADE');
    await pool.query('DROP TABLE IF EXISTS availability_config CASCADE');
    await pool.query('DROP TABLE IF EXISTS blocked_dates CASCADE');

    // Create appointments table
    console.log('📝 Creating appointments table...');
    await pool.query(`
      CREATE TABLE appointments (
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

    // Create availability configuration table
    console.log('⚙️ Creating availability_config table...');
    await pool.query(`
      CREATE TABLE availability_config (
        id SERIAL PRIMARY KEY,
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        slot_duration INTEGER DEFAULT 30,
        is_active BOOLEAN DEFAULT true,
        UNIQUE(day_of_week)
      )
    `);

    // Create blocked dates table
    console.log('🚫 Creating blocked_dates table...');
    await pool.query(`
      CREATE TABLE blocked_dates (
        id SERIAL PRIMARY KEY,
        blocked_date DATE NOT NULL,
        reason VARCHAR(255),
        UNIQUE(blocked_date)
      )
    `);

    // Insert default availability (Monday to Friday, 9:00-17:00)
    console.log('📅 Setting up default availability...');
    const days = [
      { day: 1, name: 'Monday' },
      { day: 2, name: 'Tuesday' },
      { day: 3, name: 'Wednesday' },
      { day: 4, name: 'Thursday' },
      { day: 5, name: 'Friday' }
    ];

    for (const { day, name } of days) {
      await pool.query(
        `INSERT INTO availability_config (day_of_week, start_time, end_time, slot_duration, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        [day, '09:00:00', '17:00:00', 30, true]
      );
      console.log(`  ✅ ${name} configured: 09:00-17:00`);
    }

    // Insert some example blocked dates (optional)
    console.log('🎉 Adding example holidays...');
    const holidays = [
      { date: '2025-01-01', reason: 'Nieuwjaarsdag' },
      { date: '2025-04-21', reason: 'Tweede Paasdag' },
      { date: '2025-04-27', reason: 'Koningsdag' },
      { date: '2025-05-05', reason: 'Bevrijdingsdag' },
      { date: '2025-12-25', reason: 'Eerste Kerstdag' },
      { date: '2025-12-26', reason: 'Tweede Kerstdag' }
    ];

    for (const { date, reason } of holidays) {
      try {
        await pool.query(
          `INSERT INTO blocked_dates (blocked_date, reason) VALUES ($1, $2)`,
          [date, reason]
        );
        console.log(`  🚫 ${date}: ${reason}`);
      } catch (e) {
        // Ignore duplicate key errors
      }
    }

    // Create indexes for performance
    console.log('🚀 Creating indexes...');
    await pool.query('CREATE INDEX idx_appointments_date ON appointments(appointment_date)');
    await pool.query('CREATE INDEX idx_appointments_status ON appointments(status)');
    await pool.query('CREATE INDEX idx_appointments_email ON appointments(customer_email)');
    await pool.query('CREATE INDEX idx_availability_day ON availability_config(day_of_week)');
    await pool.query('CREATE INDEX idx_blocked_dates_date ON blocked_dates(blocked_date)');

    // Create a view for easy appointment overview
    console.log('👁️ Creating appointment overview view...');
    await pool.query(`
      CREATE OR REPLACE VIEW appointment_overview AS
      SELECT
        a.id,
        a.customer_name,
        a.customer_email,
        a.customer_phone,
        a.appointment_date,
        a.appointment_time,
        a.service_type,
        a.status,
        a.created_at,
        EXTRACT(DOW FROM a.appointment_date) as day_of_week,
        TO_CHAR(a.appointment_date, 'Day') as day_name
      FROM appointments a
      WHERE a.status != 'cancelled'
      ORDER BY a.appointment_date, a.appointment_time
    `);

    // Verify setup
    console.log('\n📊 Verifying database setup...');
    const appointmentsCount = await pool.query('SELECT COUNT(*) FROM appointments');
    const availabilityCount = await pool.query('SELECT COUNT(*) FROM availability_config');
    const blockedCount = await pool.query('SELECT COUNT(*) FROM blocked_dates');

    console.log(`  📋 Appointments table: ${appointmentsCount.rows[0].count} records`);
    console.log(`  ⚙️ Availability config: ${availabilityCount.rows[0].count} days configured`);
    console.log(`  🚫 Blocked dates: ${blockedCount.rows[0].count} dates blocked`);

    console.log('\n✨ Database setup complete!');
    console.log('🎉 Your appointment system is ready to use!');

    await pool.end();
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();