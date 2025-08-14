#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function initTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initializing database tables...');
    
    // Drop existing tables
    await client.query('DROP TABLE IF EXISTS email_logs CASCADE');
    await client.query('DROP TABLE IF EXISTS appointments CASCADE');
    await client.query('DROP TABLE IF EXISTS appointment_time_slots CASCADE');
    await client.query('DROP TABLE IF EXISTS blocked_dates CASCADE');
    
    // Enable extensions
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create appointments table
    await client.query(`
      CREATE TABLE appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        reference_number VARCHAR(12) UNIQUE NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        appointment_end_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        restaurant_name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_appointment_slot UNIQUE (appointment_date, appointment_time)
      )
    `);
    console.log('✅ appointments table created');

    // Create appointment_time_slots table
    await client.query(`
      CREATE TABLE appointment_time_slots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        is_available BOOLEAN DEFAULT true,
        max_appointments_per_slot INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_time_slot UNIQUE (day_of_week, start_time)
      )
    `);
    console.log('✅ appointment_time_slots table created');

    // Create email_logs table
    await client.query(`
      CREATE TABLE email_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
        email_type VARCHAR(100) NOT NULL,
        email_hash VARCHAR(64),
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'sent',
        error_message TEXT
      )
    `);
    console.log('✅ email_logs table created');

    // Create blocked_dates table
    await client.query(`
      CREATE TABLE blocked_dates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        blocked_date DATE NOT NULL,
        reason VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_blocked_date UNIQUE (blocked_date)
      )
    `);
    console.log('✅ blocked_dates table created');

    // Create indexes
    await client.query('CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time)');
    await client.query('CREATE INDEX idx_appointments_reference ON appointments(reference_number)');
    await client.query('CREATE INDEX idx_appointments_status ON appointments(status)');
    await client.query('CREATE INDEX idx_time_slots_day ON appointment_time_slots(day_of_week)');
    await client.query('CREATE INDEX idx_email_logs_appointment ON email_logs(appointment_id)');
    await client.query('CREATE INDEX idx_blocked_dates_date ON blocked_dates(blocked_date)');
    console.log('✅ indexes created');

    // Insert time slots
    const timeSlots = [];
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    
    for (let day = 1; day <= 5; day++) { // Monday to Friday
      for (const time of times) {
        const endTime = time === '16:00' ? '17:00' : 
                       time === '11:00' ? '12:00' : 
                       String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00';
        
        timeSlots.push(`(${day}, '${time}', '${endTime}', 60)`);
      }
    }
    
    await client.query(`
      INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes)
      VALUES ${timeSlots.join(', ')}
      ON CONFLICT (day_of_week, start_time) DO NOTHING
    `);
    console.log(`✅ ${timeSlots.length} time slots inserted`);

    console.log('🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

initTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
  .finally(() => pool.end());