import { pool, query } from '../lib/database/config';
import crypto from 'crypto';

interface AppointmentData {
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  message?: string;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

class AppointmentDatabaseService {
  /**
   * Create a new appointment with privacy-focused approach
   * Returns reference number for the appointment
   */
  async createAppointment(data: AppointmentData): Promise<{ id: string; referenceNumber: string }> {
    try {
      // Check if time slot is available
      const isAvailable = await this.isTimeSlotAvailable(data.date, data.time);
      if (!isAvailable) {
        throw new Error('This time slot is no longer available');
      }

      // Generate reference number
      const referenceNumber = await this.generateReferenceNumber();
      
      // Calculate end time (assuming 60 minute appointments)
      const endTime = this.calculateEndTime(data.time, 60);

      // Create appointment (no personal data stored)
      const result = await query(
        `INSERT INTO appointments (
          reference_number, 
          appointment_date, 
          appointment_time, 
          appointment_end_time,
          restaurant_name,
          status
        ) VALUES ($1, $2, $3, $4, $5, 'confirmed') 
        RETURNING id, reference_number`,
        [referenceNumber, data.date, data.time, endTime, data.restaurantName]
      );

      const appointment = result.rows[0];

      // Hash email for logging purposes only
      const emailHash = this.hashEmail(data.email);
      
      // Log email sent (no personal data)
      await query(
        `INSERT INTO email_logs (appointment_id, email_type, email_hash, status) 
         VALUES ($1, 'confirmation', $2, 'pending')`,
        [appointment.id, emailHash]
      );

      return {
        id: appointment.id,
        referenceNumber: appointment.reference_number
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a specific date
   */
  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    try {
      const result = await query(
        `SELECT * FROM get_available_slots($1::date)`,
        [date]
      );

      return result.rows.map(row => ({
        time: row.slot_time.substring(0, 5), // Format: HH:MM
        isAvailable: row.is_available
      }));
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  }

  /**
   * Check if a specific time slot is available
   */
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    try {
      const result = await query(
        `SELECT is_time_slot_available($1::date, $2::time) as available`,
        [date, time]
      );

      return result.rows[0]?.available || false;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  /**
   * Check if a date is fully booked (no available slots)
   */
  async isDateFullyBooked(date: string): Promise<boolean> {
    try {
      const result = await query(
        `SELECT COUNT(*) as available_count
         FROM get_available_slots($1::date)
         WHERE is_available = true`,
        [date]
      );

      return parseInt(result.rows[0]?.available_count || '0') === 0;
    } catch (error) {
      console.error('Error checking if date is fully booked:', error);
      return false;
    }
  }

  /**
   * Get available dates for a month (only dates with available slots)
   */
  async getAvailableDates(year: number, month: number): Promise<string[]> {
    try {
      // Generate all dates for the month
      const daysInMonth = new Date(year, month, 0).getDate();
      const dates: string[] = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(date).getDay();
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        // Skip past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(date) < today) continue;
        
        // Check if date has available slots
        const isFullyBooked = await this.isDateFullyBooked(date);
        if (!isFullyBooked) {
          dates.push(date);
        }
      }
      
      return dates;
    } catch (error) {
      console.error('Error getting available dates:', error);
      return [];
    }
  }

  /**
   * Get appointment by reference number (no personal data returned)
   */
  async getAppointmentByReference(referenceNumber: string): Promise<any> {
    try {
      const result = await query(
        `SELECT 
          id,
          reference_number,
          appointment_date,
          appointment_time,
          restaurant_name,
          status,
          created_at
        FROM appointments 
        WHERE reference_number = $1`,
        [referenceNumber]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment by reference number
   */
  async cancelAppointment(referenceNumber: string): Promise<boolean> {
    try {
      const result = await query(
        `UPDATE appointments 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE reference_number = $1 AND status = 'confirmed'
         RETURNING id`,
        [referenceNumber]
      );

      if (result.rows.length > 0) {
        // Log cancellation
        await query(
          `INSERT INTO email_logs (appointment_id, email_type, status) 
           VALUES ($1, 'cancellation', 'pending')`,
          [result.rows[0].id]
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Get all booked slots for a date range (for calendar display)
   */
  async getBookedSlots(startDate: string, endDate: string): Promise<any[]> {
    try {
      const result = await query(
        `SELECT 
          appointment_date,
          appointment_time,
          appointment_end_time
        FROM appointments 
        WHERE appointment_date BETWEEN $1 AND $2
        AND status IN ('confirmed', 'pending')
        ORDER BY appointment_date, appointment_time`,
        [startDate, endDate]
      );

      return result.rows.map(row => ({
        date: row.appointment_date,
        startTime: row.appointment_time.substring(0, 5),
        endTime: row.appointment_end_time.substring(0, 5)
      }));
    } catch (error) {
      console.error('Error getting booked slots:', error);
      throw error;
    }
  }

  /**
   * Update email log status
   */
  async updateEmailLogStatus(appointmentId: string, emailType: string, status: string, errorMessage?: string): Promise<void> {
    try {
      await query(
        `UPDATE email_logs 
         SET status = $1, error_message = $2
         WHERE appointment_id = $3 AND email_type = $4`,
        [status, errorMessage || null, appointmentId, emailType]
      );
    } catch (error) {
      console.error('Error updating email log:', error);
    }
  }

  /**
   * Block a specific date (e.g., holidays)
   */
  async blockDate(date: string, reason?: string): Promise<void> {
    try {
      await query(
        `INSERT INTO blocked_dates (blocked_date, reason) 
         VALUES ($1, $2) 
         ON CONFLICT (blocked_date) DO UPDATE SET reason = $2`,
        [date, reason || 'Admin blocked']
      );
    } catch (error) {
      console.error('Error blocking date:', error);
      throw error;
    }
  }

  /**
   * Unblock a date
   */
  async unblockDate(date: string): Promise<void> {
    try {
      await query(
        `DELETE FROM blocked_dates WHERE blocked_date = $1`,
        [date]
      );
    } catch (error) {
      console.error('Error unblocking date:', error);
      throw error;
    }
  }

  /**
   * Get blocked dates for a month
   */
  async getBlockedDates(year: number, month: number): Promise<string[]> {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const result = await query(
        `SELECT blocked_date FROM blocked_dates 
         WHERE blocked_date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );

      return result.rows.map(row => row.blocked_date);
    } catch (error) {
      console.error('Error getting blocked dates:', error);
      return [];
    }
  }

  /**
   * Clean up old appointments (GDPR compliance)
   */
  async cleanupOldAppointments(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await query(
        `DELETE FROM appointments 
         WHERE created_at < $1 
         AND status IN ('completed', 'cancelled', 'no-show')
         RETURNING id`,
        [cutoffDate.toISOString()]
      );

      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning up old appointments:', error);
      return 0;
    }
  }

  /**
   * Private helper methods
   */
  
  private async generateReferenceNumber(): Promise<string> {
    const result = await query(`SELECT generate_reference_number() as ref_number`);
    return result.rows[0].ref_number;
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }

  private hashEmail(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
  }

  /**
   * Initialize database tables
   */
  async initializeDatabase(): Promise<void> {
    try {
      console.log('Initializing appointment database...');
      
      // Test connection
      const connected = await pool.query('SELECT NOW()');
      console.log('✅ Database connected:', connected.rows[0].now);

      // Check if tables exist
      const tablesExist = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'appointments'
        )`
      );

      if (!tablesExist.rows[0].exists) {
        console.log('Creating appointment tables...');
        // You would run the schema SQL here
        // For now, just log
        console.log('⚠️  Please run enhanced-schema.sql to create tables');
      } else {
        console.log('✅ Appointment tables already exist');
      }

    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }
}

export default new AppointmentDatabaseService();