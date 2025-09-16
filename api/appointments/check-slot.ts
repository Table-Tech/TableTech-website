import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query, type Appointment } from '../lib/db';
import { validateDate, validateTime } from '../lib/validation';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { date, time } = req.query;

    if (typeof date !== 'string' || typeof time !== 'string') {
      res.status(400).json({
        error: 'Date and time parameters are required',
        available: false
      });
      return;
    }

    if (!validateDate(date)) {
      res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD',
        available: false
      });
      return;
    }

    if (!validateTime(time)) {
      res.status(400).json({
        error: 'Invalid time format. Use HH:MM',
        available: false
      });
      return;
    }

    const appointments = await query<Appointment>(
      `SELECT id FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND status != 'cancelled'
       LIMIT 1`,
      [date, time + ':00']
    );

    const isAvailable = appointments.length === 0;

    const now = new Date();
    const slotDateTime = new Date(`${date}T${time}:00`);
    const isPastSlot = slotDateTime < now;

    if (isPastSlot) {
      res.status(200).json({
        available: false,
        reason: 'Dit tijdslot ligt in het verleden'
      });
      return;
    }

    const dayOfWeek = slotDateTime.getDay();
    const availabilityConfig = await query(
      `SELECT * FROM availability_config
       WHERE day_of_week = $1
       AND is_active = true
       LIMIT 1`,
      [dayOfWeek]
    );

    if (availabilityConfig.length === 0) {
      res.status(200).json({
        available: false,
        reason: 'Geen beschikbaarheid op deze dag'
      });
      return;
    }

    const config = availabilityConfig[0];
    const requestedTime = time + ':00';

    if (requestedTime < config.start_time || requestedTime >= config.end_time) {
      res.status(200).json({
        available: false,
        reason: 'Tijdslot valt buiten openingstijden'
      });
      return;
    }

    const blockedDate = await query(
      `SELECT id FROM blocked_dates
       WHERE blocked_date = $1
       LIMIT 1`,
      [date]
    );

    if (blockedDate.length > 0) {
      res.status(200).json({
        available: false,
        reason: 'Deze datum is geblokkeerd'
      });
      return;
    }

    res.status(200).json({
      available: isAvailable,
      date: date,
      time: time,
      reason: isAvailable ? null : 'Dit tijdslot is al geboekt'
    });
  } catch (error) {
    console.error('Error checking slot:', error);
    res.status(500).json({
      error: 'Failed to check slot availability',
      available: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}