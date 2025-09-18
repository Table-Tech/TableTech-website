// Vercel Function for creating appointments
const { Client } = require('pg');

// Database configuration - Use DATABASE_URL_new as primary (Vercel setup)
const dbConfig = {
  connectionString: process.env.DATABASE_URL_new || process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
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
  console.log(`📧 Attempting to send email to: ${to}`);
  console.log(`   Subject: ${subject}`);

  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ No RESEND_API_KEY found, skipping email');
    console.log('   Available env vars:', Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('MAIL')));
    return { error: 'RESEND_API_KEY not configured', skipped: true };
  }

  console.log('   API Key found:', process.env.RESEND_API_KEY.substring(0, 10) + '...');

  try {
    // Fix: Ensure correct email format with proper brackets
    let fromEmail = 'TableTech <info@tabletech.nl>'; // Default

    if (process.env.MAIL_FROM) {
      // Clean up and ensure proper format
      let cleanFrom = process.env.MAIL_FROM.replace(/["']/g, '').trim();

      // Check if it already has brackets
      if (!cleanFrom.includes('<') && !cleanFrom.includes('>')) {
        // Format: "Name email@domain" -> "Name <email@domain>"
        const parts = cleanFrom.split(' ');
        if (parts.length >= 2) {
          const email = parts[parts.length - 1];
          const name = parts.slice(0, -1).join(' ');
          fromEmail = `${name} <${email}>`;
        } else {
          // Just an email address
          fromEmail = `TableTech <${cleanFrom}>`;
        }
      } else {
        fromEmail = cleanFrom;
      }
    } else if (process.env.FROM_EMAIL) {
      // If only email provided, add name
      const cleanEmail = process.env.FROM_EMAIL.replace(/["']/g, '').trim();
      fromEmail = `TableTech <${cleanEmail}>`;
    }

    console.log('   From address (formatted):', fromEmail);

    const requestBody = {
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html,
    };

    console.log('   Sending to Resend API...');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('   ❌ Resend API error:', response.status, result);
      return { error: result, status: response.status };
    }

    console.log('   ✅ Email sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('   ❌ Email send error:', error.message);
    return { error: error.message, exception: true };
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
  const hasDbConfig = process.env.DATABASE_URL_new || process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;
  if (!hasDbConfig) {
    console.error('❌ No database configuration found');
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
      // Format date for display
      const formatDate = (dateString) => {
        if (!dateString) return 'Niet opgegeven';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('nl-NL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        } catch {
          return dateString;
        }
      };

      // Customer email with beautiful dark theme
      const customerEmail = await sendEmail(
        customer_email,
        `Bevestiging afspraak - TableTech`,
        `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0; min-height: 100vh;">
              <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 600;">TableTech</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Afspraak Bevestiging</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px; color: #e0e0e0;">
                  <h2 style="color: #00d4ff; margin: 0 0 20px 0; font-size: 24px;">Beste ${customer_name},</h2>

                  <p style="line-height: 1.6; color: #b0b0b0; margin-bottom: 30px;">
                    Bedankt voor uw aanvraag! We hebben uw afspraak succesvol ontvangen.
                  </p>

                  <!-- Appointment Card -->
                  <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid #00d4ff; border-radius: 15px; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #00d4ff; margin: 0 0 20px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                      📅 Afspraak Details
                    </h3>

                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px 0; color: #888; vertical-align: top; width: 40%;">📆 Datum:</td>
                        <td style="padding: 10px 0; color: #e0e0e0; font-weight: 600;">${formatDate(appointment_date)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #888; vertical-align: top;">🕐 Tijd:</td>
                        <td style="padding: 10px 0; color: #e0e0e0; font-weight: 600;">${appointment_time}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #888; vertical-align: top;">💼 Service:</td>
                        <td style="padding: 10px 0; color: #e0e0e0; font-weight: 600;">${service_type || 'Algemene consultatie'}</td>
                      </tr>
                      ${notes ? `
                      <tr>
                        <td style="padding: 10px 0; color: #888; vertical-align: top;">📝 Opmerkingen:</td>
                        <td style="padding: 10px 0; color: #e0e0e0;">${notes}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>

                  <!-- Next Steps -->
                  <div style="background: rgba(118, 75, 162, 0.2); border-left: 4px solid #764ba2; padding: 20px; margin: 30px 0; border-radius: 10px;">
                    <h4 style="color: #00d4ff; margin: 0 0 10px 0; font-size: 16px;">⏭️ Volgende stappen</h4>
                    <p style="color: #b0b0b0; margin: 0; line-height: 1.6;">
                      Ons team neemt binnen 1 werkdag contact met u op om de afspraak definitief te bevestigen.
                    </p>
                  </div>

                  <!-- Contact Info -->
                  <div style="text-align: center; margin: 40px 0; padding: 30px; background: rgba(0, 0, 0, 0.3); border-radius: 15px;">
                    <p style="color: #888; margin: 0 0 15px 0; font-size: 14px;">Heeft u vragen?</p>
                    <a href="mailto:info@tabletech.nl" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%); color: white; text-decoration: none; border-radius: 30px; font-weight: 600; transition: all 0.3s;">Contact Opnemen</a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background: rgba(0, 0, 0, 0.5); padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                  <p style="color: #666; margin: 0; font-size: 14px;">
                    Met vriendelijke groet,<br>
                    <strong style="color: #00d4ff;">Team TableTech</strong>
                  </p>
                  <p style="color: #555; margin: 15px 0 0 0; font-size: 12px;">
                    © ${new Date().getFullYear()} TableTech. Alle rechten voorbehouden.
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      );

      console.log('  📧 Customer email result:', JSON.stringify(customerEmail));
      if (customerEmail.error) {
        console.error('  ❌ Customer email failed:', customerEmail.error);
      } else {
        console.log('  ✅ Customer email sent:', customerEmail.id);
      }

      // Company notification with professional dark theme
      const timestamp = new Date().toLocaleString('nl-NL', {
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      const companyEmail = await sendEmail(
        process.env.MAIL_TO_INTERNAL || 'info@tabletech.nl',
        `🔥 NIEUWE AFSPRAAK - ${customer_name}${appointment_date ? ` (${formatDate(appointment_date)})` : ''}`,
        `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="background: #0f0f0f; padding: 40px 0; min-height: 100vh;">
              <div style="max-width: 700px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
                <!-- Alert Header -->
                <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🚨 NIEUWE AFSPRAAK AANVRAAG</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 14px;">Ontvangen op: ${timestamp}</p>
                </div>

                <!-- Main Content -->
                <div style="padding: 30px;">
                  <!-- Quick Stats Bar -->
                  <div style="display: flex; background: #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #444;">
                    <div style="flex: 1; text-align: center; border-right: 1px solid #444;">
                      <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Status</p>
                      <p style="color: #4ade80; margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">NIEUW</p>
                    </div>
                    <div style="flex: 1; text-align: center; border-right: 1px solid #444;">
                      <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Booking ID</p>
                      <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${newAppointment.id}</p>
                    </div>
                    <div style="flex: 1; text-align: center;">
                      <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Actie Vereist</p>
                      <p style="color: #fbbf24; margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">⚡ 24u</p>
                    </div>
                  </div>

                  <!-- Appointment Details -->
                  <div style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 1px solid #444;">
                    <h2 style="color: #60a5fa; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                      📋 AFSPRAAK DETAILS
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #888; width: 35%;">📅 Datum:</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${formatDate(appointment_date)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">🕐 Tijd:</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${appointment_time}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">💼 Service:</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${service_type || 'Algemene consultatie'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">⏱️ Duur:</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">30 minuten (Telefonisch gesprek)</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Customer Information -->
                  <div style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 1px solid #444;">
                    <h2 style="color: #4ade80; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                      👤 KLANT INFORMATIE
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #888; width: 35%;">📝 Naam:</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${customer_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">📧 Email:</td>
                        <td style="padding: 12px 0;">
                          <a href="mailto:${customer_email}" style="color: #60a5fa; text-decoration: none;">${customer_email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">📱 Telefoon:</td>
                        <td style="padding: 12px 0;">
                          <a href="tel:${customer_phone}" style="color: #60a5fa; text-decoration: none;">${customer_phone}</a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  ${notes ? `
                  <!-- Customer Message -->
                  <div style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 1px solid #444;">
                    <h2 style="color: #fbbf24; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                      💬 KLANT BERICHT
                    </h2>
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                      <p style="color: #d0d0d0; margin: 0; line-height: 1.8; white-space: pre-wrap;">${notes}</p>
                    </div>
                  </div>
                  ` : ''}

                  <!-- Action Required -->
                  <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); border-radius: 12px; padding: 25px; margin-bottom: 20px;">
                    <h2 style="color: white; margin: 0 0 15px 0; font-size: 18px; text-align: center;">⚡ ACTIE VEREIST</h2>
                    <p style="color: rgba(255, 255, 255, 0.95); margin: 0 0 20px 0; text-align: center; line-height: 1.6;">
                      Bevestig deze afspraak binnen 24 uur
                    </p>
                    <div style="text-align: center;">
                      <a href="tel:${customer_phone}" style="display: inline-block; margin: 0 10px; padding: 12px 30px; background: white; color: #ff6b6b; text-decoration: none; border-radius: 30px; font-weight: 600;">📞 Bel Klant</a>
                      <a href="mailto:${customer_email}" style="display: inline-block; margin: 0 10px; padding: 12px 30px; background: rgba(255, 255, 255, 0.2); color: white; text-decoration: none; border-radius: 30px; font-weight: 600; border: 2px solid white;">📧 Email Klant</a>
                    </div>
                  </div>

                  <!-- System Info -->
                  <div style="background: #1f1f1f; border-radius: 12px; padding: 20px; border: 1px solid #333;">
                    <h3 style="color: #666; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase;">🔧 Systeem Informatie</h3>
                    <table style="width: 100%; font-size: 13px;">
                      <tr>
                        <td style="padding: 8px 0; color: #555;">Request ID:</td>
                        <td style="padding: 8px 0; color: #888; font-family: monospace;">${newAppointment.id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #555;">Bron:</td>
                        <td style="padding: 8px 0; color: #888;">TableTech Website</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #555;">Aangemaakt:</td>
                        <td style="padding: 8px 0; color: #888;">${timestamp}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background: #0f0f0f; padding: 25px; text-align: center; border-top: 1px solid #333;">
                  <p style="color: #666; margin: 0; font-size: 13px;">
                    Dit is een automatisch gegenereerd bericht van het TableTech Booking System.
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      );

      console.log('  📧 Company email result:', JSON.stringify(companyEmail));
      if (companyEmail.error) {
        console.error('  ❌ Company email failed:', companyEmail.error);
      } else {
        console.log('  ✅ Company email sent:', companyEmail.id);
      }
    } catch (emailError) {
      console.error('  ⚠️ Email error (appointment still created):', emailError);
      console.error('  Error details:', JSON.stringify(emailError));
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