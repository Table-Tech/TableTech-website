import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query, type AvailabilityConfig, type BlockedDate, type Appointment } from '../lib/db';
import { cache, getCacheKey } from '../lib/cache';
import { format, addDays, getDay, parse, isValid } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = process.env.TIMEZONE || 'Europe/Amsterdam';

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  dayName: string;
}

interface AvailabilityResponse {
  slots: TimeSlot[];
  timezone: string;
  generatedAt: string;
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number
): string[] {
  const slots: string[] = [];
  const start = parse(startTime, 'HH:mm:ss', new Date());
  const end = parse(endTime, 'HH:mm:ss', new Date());

  let current = start;
  while (current < end) {
    slots.push(format(current, 'HH:mm'));
    current = new Date(current.getTime() + slotDuration * 60000);
  }

  return slots;
}

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
    const cacheKey = getCacheKey('availability', 'slots');
    const cachedData = cache.get<AvailabilityResponse>(cacheKey);

    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    const [availabilityConfigs, blockedDates, existingAppointments] = await Promise.all([
      query<AvailabilityConfig>(
        'SELECT * FROM availability_config WHERE is_active = true ORDER BY day_of_week'
      ),
      query<BlockedDate>(
        'SELECT * FROM blocked_dates WHERE blocked_date >= CURRENT_DATE'
      ),
      query<Appointment>(
        `SELECT appointment_date, appointment_time
         FROM appointments
         WHERE appointment_date >= CURRENT_DATE
         AND appointment_date <= CURRENT_DATE + INTERVAL '30 days'
         AND status != 'cancelled'`
      ),
    ]);

    const slots: TimeSlot[] = [];
    const today = new Date();
    const endDate = addDays(today, 30);

    const blockedDatesSet = new Set(
      blockedDates.map(bd => bd.blocked_date)
    );

    const bookedSlotsSet = new Set(
      existingAppointments.map(app =>
        `${app.appointment_date}_${app.appointment_time}`
      )
    );

    const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

    let currentDate = today;
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = getDay(currentDate);
      const dayName = dayNames[dayOfWeek];

      if (blockedDatesSet.has(dateStr)) {
        currentDate = addDays(currentDate, 1);
        continue;
      }

      const dayConfig = availabilityConfigs.find(
        config => config.day_of_week === dayOfWeek
      );

      if (!dayConfig) {
        currentDate = addDays(currentDate, 1);
        continue;
      }

      const timeSlots = generateTimeSlots(
        dayConfig.start_time,
        dayConfig.end_time,
        dayConfig.slot_duration
      );

      for (const time of timeSlots) {
        const slotKey = `${dateStr}_${time}:00`;
        const isBooked = bookedSlotsSet.has(slotKey);

        const now = new Date();
        const slotDateTime = parse(
          `${dateStr} ${time}`,
          'yyyy-MM-dd HH:mm',
          new Date()
        );

        const isPastSlot = slotDateTime < now;

        slots.push({
          date: dateStr,
          time: time,
          available: !isBooked && !isPastSlot,
          dayName: dayName
        });
      }

      currentDate = addDays(currentDate, 1);
    }

    const response: AvailabilityResponse = {
      slots: slots,
      timezone: TIMEZONE,
      generatedAt: new Date().toISOString()
    };

    cache.set(cacheKey, response, 5);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      error: 'Failed to fetch availability',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}