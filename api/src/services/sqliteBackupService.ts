import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { logger } from '../lib/logging/logger';

class SQLiteBackupService {
  private db: Database | null = null;

  async initialize(): Promise<void> {
    try {
      const dbPath = path.join(process.cwd(), 'data', 'appointments_backup.db');

      // Ensure data directory exists
      const fs = await import('fs/promises');
      await fs.mkdir(path.dirname(dbPath), { recursive: true });

      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      // Create tables
      await this.createTables();
      logger.info('✅ SQLite backup database initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize SQLite backup:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        reference_number TEXT UNIQUE NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        appointment_end_time TEXT NOT NULL,
        status TEXT DEFAULT 'confirmed',
        restaurant_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointment_time_slots (
        id TEXT PRIMARY KEY,
        day_of_week INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        is_available INTEGER DEFAULT 1,
        max_appointments_per_slot INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY,
        appointment_id TEXT,
        email_type TEXT NOT NULL,
        email_hash TEXT,
        sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'sent',
        error_message TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_reference ON appointments(reference_number);
    `);

    // Insert default time slots if empty
    const slotsCount = await this.db.get('SELECT COUNT(*) as count FROM appointment_time_slots');
    if (slotsCount.count === 0) {
      await this.insertDefaultTimeSlots();
    }
  }

  private async insertDefaultTimeSlots(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const timeSlots = [
      // Monday (1) to Friday (5)
      ...Array.from({ length: 5 }, (_, dayIndex) => {
        const day = dayIndex + 1; // 1-5 for Mon-Fri
        return [
          [day, '09:00', '10:00', 60],
          [day, '10:00', '11:00', 60],
          [day, '11:00', '12:00', 60],
          [day, '13:00', '14:00', 60],
          [day, '14:00', '15:00', 60],
          [day, '15:00', '16:00', 60],
          [day, '16:00', '17:00', 60],
        ];
      }).flat()
    ];

    const stmt = await this.db.prepare(`
      INSERT INTO appointment_time_slots (id, day_of_week, start_time, end_time, duration_minutes)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const [day, start, end, duration] of timeSlots) {
      const id = `${day}-${start}`;
      await stmt.run(id, day, start, end, duration);
    }

    await stmt.finalize();
    logger.info('✅ Default time slots inserted into SQLite backup');
  }

  async getAvailableSlots(date: string): Promise<{ time: string; isAvailable: boolean }[]> {
    if (!this.db) throw new Error('Database not initialized');

    const dayOfWeek = new Date(date).getDay();

    const slots = await this.db.all(`
      SELECT start_time as time
      FROM appointment_time_slots
      WHERE day_of_week = ? AND is_available = 1
      ORDER BY start_time
    `, [dayOfWeek]);

    const bookedTimes = await this.db.all(`
      SELECT appointment_time
      FROM appointments
      WHERE appointment_date = ? AND status IN ('confirmed', 'pending')
    `, [date]);

    const bookedTimeSet = new Set(bookedTimes.map(b => b.appointment_time));

    return slots.map(slot => ({
      time: slot.time,
      isAvailable: !bookedTimeSet.has(slot.time)
    }));
  }

  async createAppointment(data: {
    referenceNumber: string;
    restaurantName: string;
    date: string;
    time: string;
    endTime: string;
  }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();
    await this.db.run(`
      INSERT INTO appointments (id, reference_number, restaurant_name, appointment_date, appointment_time, appointment_end_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, data.referenceNumber, data.restaurantName, data.date, data.time, data.endTime]);

    logger.info('✅ Appointment saved to SQLite backup', { reference: data.referenceNumber });
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const dayOfWeek = new Date(date).getDay();

    // Check if slot exists
    const slot = await this.db.get(`
      SELECT 1 FROM appointment_time_slots
      WHERE day_of_week = ? AND start_time = ? AND is_available = 1
    `, [dayOfWeek, time]);

    if (!slot) return false;

    // Check if already booked
    const booked = await this.db.get(`
      SELECT 1 FROM appointments
      WHERE appointment_date = ? AND appointment_time = ? AND status IN ('confirmed', 'pending')
    `, [date, time]);

    return !booked;
  }

  async generateReferenceNumber(): Promise<string> {
    const today = new Date();
    const datePart = 'TT' + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');

    let attempts = 0;
    while (attempts < 100) {
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const refNumber = `${datePart}-${randomPart}`;

      if (!this.db) throw new Error('Database not initialized');

      const existing = await this.db.get(
        'SELECT 1 FROM appointments WHERE reference_number = ?',
        [refNumber]
      );

      if (!existing) return refNumber;
      attempts++;
    }

    throw new Error('Unable to generate unique reference number');
  }
}

export default new SQLiteBackupService();