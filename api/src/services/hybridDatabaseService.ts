import appointmentDb from './appointmentDatabaseService';
import sqliteBackup from './sqliteBackupService';
import { logger } from '../lib/logging/logger';

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

class HybridDatabaseService {
  private isPostgresAvailable = true;

  async initialize(): Promise<void> {
    try {
      // Always initialize SQLite as backup
      await sqliteBackup.initialize();
      logger.info('✅ SQLite backup initialized');

      // Try PostgreSQL initialization
      await appointmentDb.initializeDatabase();
      this.isPostgresAvailable = true;
      logger.info('✅ PostgreSQL primary database initialized');
    } catch (error) {
      logger.error('❌ PostgreSQL initialization failed, using SQLite only:', error);
      this.isPostgresAvailable = false;
    }
  }

  private async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    // Try primary database first
    if (this.isPostgresAvailable) {
      try {
        return await primaryOperation();
      } catch (error) {
        logger.warn(`❌ PostgreSQL ${operationName} failed, falling back to SQLite:`, error);
        this.isPostgresAvailable = false;

        // Auto-recovery attempt
        setTimeout(async () => {
          try {
            await appointmentDb.initializeDatabase();
            this.isPostgresAvailable = true;
            logger.info('✅ PostgreSQL recovered automatically');
          } catch (recoveryError) {
            logger.error('❌ PostgreSQL auto-recovery failed:', recoveryError);
          }
        }, 5000);
      }
    }

    // Use fallback database
    logger.info(`🔄 Using SQLite for ${operationName}`);
    return await fallbackOperation();
  }

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    return this.executeWithFallback(
      () => appointmentDb.getAvailableSlots(date),
      () => sqliteBackup.getAvailableSlots(date),
      'getAvailableSlots'
    );
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    return this.executeWithFallback(
      () => appointmentDb.isTimeSlotAvailable(date, time),
      () => sqliteBackup.isTimeSlotAvailable(date, time),
      'isTimeSlotAvailable'
    );
  }

  async createAppointment(data: AppointmentData): Promise<{ id: string; referenceNumber: string }> {
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + durationMinutes;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    const endTime = calculateEndTime(data.time, 60);

    return this.executeWithFallback(
      async () => appointmentDb.createAppointment(data),
      async () => {
        const referenceNumber = await sqliteBackup.generateReferenceNumber();
        await sqliteBackup.createAppointment({
          referenceNumber,
          restaurantName: data.restaurantName,
          date: data.date,
          time: data.time,
          endTime
        });
        return { id: Date.now().toString(), referenceNumber };
      },
      'createAppointment'
    );
  }

  async getAvailableDates(year: number, month: number): Promise<string[]> {
    return this.executeWithFallback(
      () => appointmentDb.getAvailableDates(year, month),
      async () => {
        // Fallback: generate weekdays for the month
        const daysInMonth = new Date(year, month, 0).getDate();
        const dates: string[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month - 1, day);
          const dayOfWeek = date.getDay();

          // Skip weekends and past dates
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date < today) continue;

          const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          // Check if date has available slots
          const slots = await sqliteBackup.getAvailableSlots(dateString);
          if (slots.some(slot => slot.isAvailable)) {
            dates.push(dateString);
          }
        }

        return dates;
      },
      'getAvailableDates'
    );
  }

  async updateEmailLogStatus(appointmentId: string, emailType: string, status: string, errorMessage?: string): Promise<void> {
    try {
      if (this.isPostgresAvailable) {
        await appointmentDb.updateEmailLogStatus(appointmentId, emailType, status, errorMessage);
      }
      // SQLite doesn't need email logs for the basic functionality
    } catch (error) {
      logger.warn('❌ Email log update failed:', error);
    }
  }

  getDatabaseStatus(): { primary: string; backup: string } {
    return {
      primary: this.isPostgresAvailable ? 'PostgreSQL (Available)' : 'PostgreSQL (Unavailable)',
      backup: 'SQLite (Available)'
    };
  }
}

export default new HybridDatabaseService();