// Vercel Function for creating appointments
const { Client } = require('pg');

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL_new,
  ssl: {
    rejectUnauthorized: false
  }
};

async function getDbClient() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// Email service function
async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ No RESEND_API_KEY found, skipping email');
    return { id: 'no-email-service' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'TableTech <info@tabletech.nl>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('✉️ POST /api/appointments/create');
  console.log('  Body:', req.body);

  // Check if environment variables exist
  if (!process.env.DATABASE_URL_new) {
    console.error('❌ DATABASE_URL_new not found');
    return res.status(500).json({
      error: 'Database configuration missing'
    });
  }

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

  let client;
  try {
    client = await getDbClient();

    // Start transaction
    await client.query('BEGIN');

    // Check if slot is available
    const checkResult = await client.query(
      `SELECT id FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND status != 'cancelled'
       FOR UPDATE`,
      [appointment_date, appointment_time + ':00']
    );

    if (checkResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Dit tijdslot is niet meer beschikbaar',
        field: 'appointment_time'
      });
    }

    // Create appointment
    const insertResult = await client.query(
      `INSERT INTO appointments
       (customer_name, customer_email, customer_phone,
        appointment_date, appointment_time, service_type,
        notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        customer_name,
        customer_email,
        customer_phone,
        appointment_date,
        appointment_time + ':00',
        service_type || 'Algemene consultatie',
        notes || '',
        'confirmed'
      ]
    );

    await client.query('COMMIT');

    const newAppointment = insertResult.rows[0];

    console.log('  ✅ Appointment created:', newAppointment.id);

    // Send emails
    try {
      // Customer email
      const customerEmail = await sendEmail(
        customer_email,
        `Afspraak bevestiging - ${appointment_date}`,
        `
          <h2>Afspraak Bevestiging</h2>
          <p>Beste ${customer_name},</p>
          <p>Uw afspraak is bevestigd voor:</p>
          <ul>
            <li><strong>Datum:</strong> ${appointment_date}</li>
            <li><strong>Tijd:</strong> ${appointment_time}</li>
            <li><strong>Service:</strong> ${service_type || 'Algemene consultatie'}</li>
          </ul>
          <p>Met vriendelijke groet,<br>TableTech</p>
        `
      );

      console.log('  📧 Customer email sent:', customerEmail.id);

      // Company notification
      const companyEmail = await sendEmail(
        process.env.MAIL_TO_INTERNAL || 'info@tabletech.nl',
        `🔔 Nieuwe afspraak - ${customer_name}`,
        `
          <h2>Nieuwe Afspraak</h2>
          <h3>Klant Gegevens:</h3>
          <ul>
            <li><strong>Naam:</strong> ${customer_name}</li>
            <li><strong>Email:</strong> ${customer_email}</li>
            <li><strong>Telefoon:</strong> ${customer_phone}</li>
          </ul>
          <h3>Afspraak Details:</h3>
          <ul>
            <li><strong>Datum:</strong> ${appointment_date}</li>
            <li><strong>Tijd:</strong> ${appointment_time}</li>
            <li><strong>Service:</strong> ${service_type || 'Algemene consultatie'}</li>
            ${notes ? `<li><strong>Opmerkingen:</strong> ${notes}</li>` : ''}
          </ul>
        `
      );

      console.log('  📧 Company email sent:', companyEmail.id);
    } catch (emailError) {
      console.error('  ⚠️ Email error (appointment still created):', emailError);
    }

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
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('  ❌ Error:', error);
    res.status(500).json({ 
      error: 'Failed to create appointment',
      message: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
};