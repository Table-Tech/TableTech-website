import { logger } from '../lib/logging/logger';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  restaurantName?: string;
  date: string;
  time: string;
  message?: string;
}

interface CreateAppointmentResult {
  id: number;
  referenceNumber: string;
}

// In-memory store for demo purposes
const appointments: Map<string, Set<string>> = new Map();

class SimpleAppointmentService {
  private readonly TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    try {
      // Get booked times for this date from in-memory store
      const bookedTimes = appointments.get(date) || new Set();

      // Return all time slots with availability status
      return this.TIME_SLOTS.map(time => ({
        time,
        available: !bookedTimes.has(time)
      }));
    } catch (error) {
      logger.error('Error fetching available slots:', error);
      // Return all slots as available in case of error
      return this.TIME_SLOTS.map(time => ({
        time,
        available: true
      }));
    }
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    try {
      const bookedTimes = appointments.get(date) || new Set();
      return !bookedTimes.has(time);
    } catch (error) {
      logger.error('Error checking time slot availability:', error);
      throw new Error('Failed to check time slot availability');
    }
  }

  async createAppointment(data: AppointmentData): Promise<CreateAppointmentResult> {
    try {
      // Check if slot is still available
      const isAvailable = await this.isTimeSlotAvailable(data.date, data.time);
      if (!isAvailable) {
        throw new Error('This time slot is no longer available');
      }

      // Generate reference number
      const referenceNumber = this.generateReferenceNumber();

      // Mark the slot as booked in memory
      if (!appointments.has(data.date)) {
        appointments.set(data.date, new Set());
      }
      appointments.get(data.date)!.add(data.time);

      // Simulate database insert
      const appointment = {
        id: Math.floor(Math.random() * 10000),
        reference_number: referenceNumber
      };

      logger.info('Appointment created successfully', {
        id: appointment.id,
        referenceNumber: appointment.reference_number,
        date: data.date,
        time: data.time
      });

      return {
        id: appointment.id,
        referenceNumber: appointment.reference_number
      };
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw error;
    }
  }

  async getAppointmentByReference(reference: string): Promise<any> {
    try {
      // For demo, return a mock appointment
      return {
        reference_number: reference,
        appointment_date: '2025-09-22',
        appointment_time: '10:00',
        status: 'pending',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@example.com',
        restaurant_name: 'Demo Restaurant',
        created_at: new Date()
      };
    } catch (error) {
      logger.error('Error fetching appointment by reference:', error);
      throw new Error('Failed to fetch appointment');
    }
  }

  async logEmail(
    appointmentId: number,
    type: string,
    recipient: string,
    status: string,
    error?: string
  ): Promise<void> {
    try {
      // Log to console for demo
      logger.info('Email log:', {
        appointmentId,
        type,
        recipient,
        status,
        error
      });
    } catch (error) {
      logger.error('Error logging email:', error);
      // Don't throw - email logging failure shouldn't break the flow
    }
  }

  private generateReferenceNumber(): string {
    const prefix = 'APT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

export default new SimpleAppointmentService();