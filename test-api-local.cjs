// Local test server voor API endpoints
// Dit simuleert de Vercel serverless functions lokaal

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockSlots = [];

// Generate mock availability for next 30 days
function generateMockSlots() {
  const slots = [];
  const today = new Date();
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayOfWeek = date.getDay();

    // Skip weekends (zondag = 0, zaterdag = 6)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    // Generate time slots from 09:00 to 17:00
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push({
          date: dateStr,
          time: time,
          available: Math.random() > 0.3, // 70% available
          dayName: dayNames[dayOfWeek]
        });
      }
    }
  }

  return slots;
}

// Booked appointments storage
const bookedAppointments = [];

// API Endpoints

// GET /api/appointments/availability
app.get('/api/appointments/availability', (req, res) => {
  console.log('📅 GET /api/appointments/availability');

  const slots = generateMockSlots().map(slot => {
    // Check if slot is already booked
    const isBooked = bookedAppointments.some(
      app => app.appointment_date === slot.date &&
            app.appointment_time === slot.time + ':00'
    );

    return {
      ...slot,
      available: slot.available && !isBooked
    };
  });

  res.json({
    slots: slots,
    timezone: 'Europe/Amsterdam',
    generatedAt: new Date().toISOString()
  });
});

// GET /api/appointments/check-slot
app.get('/api/appointments/check-slot', (req, res) => {
  const { date, time } = req.query;
  console.log(`🔍 GET /api/appointments/check-slot - Date: ${date}, Time: ${time}`);

  if (!date || !time) {
    return res.status(400).json({
      error: 'Date and time parameters are required',
      available: false
    });
  }

  const isBooked = bookedAppointments.some(
    app => app.appointment_date === date &&
          app.appointment_time === time + ':00'
  );

  res.json({
    available: !isBooked,
    date: date,
    time: time,
    reason: isBooked ? 'Dit tijdslot is al geboekt' : null
  });
});

// POST /api/appointments/create
app.post('/api/appointments/create', (req, res) => {
  console.log('✉️ POST /api/appointments/create');
  console.log('Body:', req.body);

  const {
    customer_name,
    customer_email,
    customer_phone,
    appointment_date,
    appointment_time,
    service_type,
    notes
  } = req.body;

  // Validation
  if (!customer_name || !customer_email || !customer_phone || !appointment_date || !appointment_time) {
    return res.status(400).json({
      error: 'Missing required fields',
      errors: []
    });
  }

  // Check if slot is already booked
  const isBooked = bookedAppointments.some(
    app => app.appointment_date === appointment_date &&
          app.appointment_time === appointment_time + ':00'
  );

  if (isBooked) {
    return res.status(409).json({
      error: 'Dit tijdslot is niet meer beschikbaar',
      field: 'appointment_time'
    });
  }

  // Create appointment
  const newAppointment = {
    id: bookedAppointments.length + 1,
    customer_name,
    customer_email,
    customer_phone,
    appointment_date,
    appointment_time: appointment_time + ':00',
    service_type: service_type || 'Algemene consultatie',
    notes: notes || '',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  bookedAppointments.push(newAppointment);

  console.log('✅ Appointment created:', newAppointment);
  console.log('📧 Email would be sent to:', customer_email);
  console.log('📧 Company notification would be sent');

  res.status(201).json({
    success: true,
    appointment: {
      id: newAppointment.id,
      appointment_date: newAppointment.appointment_date,
      appointment_time: newAppointment.appointment_time,
      customer_name: newAppointment.customer_name,
      status: newAppointment.status
    },
    message: 'Afspraak succesvol aangemaakt. U ontvangt een bevestiging per email.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test API Server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('   GET  /api/appointments/availability');
  console.log('   GET  /api/appointments/check-slot');
  console.log('   POST /api/appointments/create');
  console.log('');
  console.log('✨ Ready to test appointments!');
});