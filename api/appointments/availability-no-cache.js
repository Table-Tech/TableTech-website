// Vercel Function - Availability WITHOUT cache for testing
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('📅 GET /api/appointments/availability-no-cache');
  console.log('Current date:', new Date().toISOString());

  const connectionString = process.env.DATABASE_URL_new || process.env.DATABASE_URL;

  if (!connectionString) {
    console.log('No database configured - returning empty');
    return res.status(200).json({
      slots: [],
      message: 'No database configured',
      timestamp: new Date().toISOString()
    });
  }

  let client = null;
  try {
    client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    // Get availability config
    const availabilityResult = await client.query(
      'SELECT * FROM availability_config WHERE is_active = true ORDER BY day_of_week'
    );

    // Get existing appointments for next 60 days
    const appointmentsResult = await client.query(
      `SELECT appointment_date, appointment_time
       FROM appointments
       WHERE appointment_date >= CURRENT_DATE
       AND appointment_date <= CURRENT_DATE + INTERVAL '60 days'
       AND status != 'cancelled'`
    );

    // Get blocked dates
    const blockedResult = await client.query(
      'SELECT * FROM blocked_dates WHERE blocked_date >= CURRENT_DATE'
    );

    const slots = [];
    const today = new Date();
    const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

    // Generate slots for next 60 days (to cover 2 months)
    for (let d = 0; d < 60; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];

      // Check if date is blocked
      const isBlocked = blockedResult.rows.some(b =>
        b.blocked_date.toISOString().split('T')[0] === dateStr
      );

      if (isBlocked) continue;

      // Find config for this day
      const dayConfig = availabilityResult.rows.find(c => c.day_of_week === dayOfWeek);
      if (!dayConfig) continue;

      // Generate time slots
      const startTime = dayConfig.start_time;
      const endTime = dayConfig.end_time;
      const slotDuration = dayConfig.slot_duration || 30;

      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Check if slot is already booked
        const isBooked = appointmentsResult.rows.some(a =>
          a.appointment_date.toISOString().split('T')[0] === dateStr &&
          a.appointment_time.substring(0, 5) === time
        );

        // Check if slot is in the past
        const slotDateTime = new Date(`${dateStr}T${time}:00`);
        const isPast = slotDateTime < new Date();

        slots.push({
          date: dateStr,
          time: time,
          available: !isBooked && !isPast,
          dayName: dayNames[dayOfWeek]
        });
      }
    }

    console.log(`✅ Generated ${slots.length} slots`);
    console.log(`First slot: ${slots[0]?.date} ${slots[0]?.time}`);
    console.log(`Last slot: ${slots[slots.length-1]?.date} ${slots[slots.length-1]?.time}`);

    return res.status(200).json({
      slots: slots,
      timezone: 'Europe/Amsterdam',
      generatedAt: new Date().toISOString(),
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.available).length
    });

  } catch (error) {
    console.error('Database error:', error.message);
    return res.status(200).json({
      slots: [],
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};