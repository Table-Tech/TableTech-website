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
    // Fix email format - handle various input formats
    let fromEmail = 'TableTech <info@tabletech.nl>'; // Default

    if (process.env.MAIL_FROM) {
      // Clean up the MAIL_FROM variable
      let cleanFrom = process.env.MAIL_FROM
        .replace(/["']/g, '') // Remove quotes
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      // Check different formats
      if (cleanFrom.includes('<') && cleanFrom.includes('>')) {
        // Already properly formatted: "Name <email>"
        fromEmail = cleanFrom;
      } else if (cleanFrom.includes('@')) {
        // Contains email somewhere
        const emailMatch = cleanFrom.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        if (emailMatch) {
          const email = emailMatch[1];
          // Get the name part (everything before the email)
          const namePart = cleanFrom.replace(email, '').trim();
          const name = namePart || 'TableTech';
          fromEmail = `${name} <${email}>`;
        }
      } else {
        // Fallback to default
        console.log('   ⚠️ Invalid MAIL_FROM format, using default');
      }
    } else if (process.env.FROM_EMAIL) {
      // If only FROM_EMAIL is provided
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
  console.log('  Environment:', process.env.VERCEL_ENV || 'local');
  console.log('  Has Resend Key:', !!process.env.RESEND_API_KEY);
  console.log('  Has Database:', !!process.env.DATABASE_URL_new || !!process.env.DATABASE_URL);
  console.log('  Body:', req.body);

  // Check if environment variables exist
  const hasDbConfig = process.env.DATABASE_URL_new || process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;
  if (!hasDbConfig) {
    console.log('⚠️ No database configuration found - demo mode active');
    // Continue anyway - we'll send emails even without database
  }

  const {
    customer_name,
    customer_email,
    customer_phone,
    appointment_date,
    appointment_time,
    service_type,
    notes,
    language = 'nl' // Default to Dutch
  } = req.body;

  // Validation
  if (!customer_name || !customer_email || !customer_phone || !appointment_date || !appointment_time) {
    return res.status(400).json({
      error: 'Missing required fields',
      errors: []
    });
  }

  let client;
  let newAppointment = null;
  let dbAvailable = false;

  try {

    // Try database connection if config exists
    if (hasDbConfig) {
    try {
      client = await getDbClient();
      dbAvailable = true;

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

      newAppointment = insertResult.rows[0];
      console.log('  ✅ Appointment created in database:', newAppointment.id);
    } catch (dbError) {
      console.error('  ⚠️ Database error:', dbError.message);
      console.log('  📧 Will continue with email sending only');
      // Don't throw - continue to send emails
      if (client) {
        await client.query('ROLLBACK').catch(() => {});
      }
      dbAvailable = false;
    }
  }

  // If no database or database failed, create a mock appointment object
  if (!newAppointment) {
    newAppointment = {
      id: 'DEMO-' + Date.now(),
      customer_name,
      customer_email,
      customer_phone,
      appointment_date,
      appointment_time: appointment_time + ':00',
      service_type: service_type || 'Algemene consultatie',
      notes: notes || '',
      status: 'pending-confirmation',
      created_at: new Date()
    };
    console.log('  📝 Demo appointment created:', newAppointment.id);
  }

    // Send emails
    let emailsSent = false;
    try {
      // Format date for display based on language
      const formatDate = (dateString) => {
        if (!dateString) return language === 'en' ? 'Not provided' : 'Niet opgegeven';
        try {
          const date = new Date(dateString);
          const locale = language === 'en' ? 'en-US' : 'nl-NL';
          return date.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        } catch {
          return dateString;
        }
      };

      // Get email templates based on language
      const getEmailContent = (lang) => {
        if (lang === 'en') {
          return {
            subject: 'Appointment Confirmation - TableTech',
            greeting: `Dear ${customer_name},`,
            thanks: 'Thank you for your request! We have successfully received your appointment.',
            detailsTitle: '📅 Appointment Details',
            dateLabel: '📆 Date:',
            timeLabel: '🕐 Time:',
            serviceLabel: '💼 Service:',
            notesLabel: 'Notes:',
            defaultService: 'General consultation',
            contactTitle: 'Contact:',
            regards: 'Kind regards,',
            teamName: 'Team TableTech',
            copyright: '© 2025 TableTech - All rights reserved',
            emailReason: 'You are receiving this email because you requested an appointment on the website',
            companySubject: `🔥 NEW APPOINTMENT - ${customer_name}${appointment_date ? ` (${formatDate(appointment_date)})` : ''}`,
            newAppointment: 'NEW APPOINTMENT REQUEST',
            status: 'Status',
            statusNew: 'NEW',
            bookingId: 'Booking ID',
            actionRequired: 'Action Required',
            appointmentDetails: '📋 APPOINTMENT DETAILS',
            duration: '⏱️ Duration:',
            durationValue: '30 minutes (Phone call)',
            customerInfo: '👤 CUSTOMER INFORMATION',
            name: '📝 Name:',
            email: '📧 Email:',
            phone: '📱 Phone:',
            customerMessage: '💬 CUSTOMER MESSAGE',
            actionTitle: '⚡ ACTION REQUIRED',
            confirmWithin: 'Confirm this appointment within 24 hours',
            callCustomer: '📞 Call Customer',
            emailCustomer: '📧 Email Customer',
            systemInfo: '🔧 SYSTEM INFORMATION',
            requestId: 'Request ID:',
            source: 'Source:',
            sourceValue: 'TableTech Website',
            created: 'Created:',
            autoGenerated: 'This is an automatically generated message from the TableTech Booking System.'
          };
        } else {
          return {
            subject: 'Bevestiging afspraak - TableTech',
            greeting: `Beste ${customer_name},`,
            thanks: 'Bedankt voor uw aanvraag! We hebben uw afspraak succesvol ontvangen.',
            detailsTitle: '📅 Afspraak Details',
            dateLabel: '📆 Datum:',
            timeLabel: '🕐 Tijd:',
            serviceLabel: '💼 Service:',
            notesLabel: 'Opmerkingen:',
            defaultService: 'Algemene consultatie',
            contactTitle: 'Contact:',
            regards: 'Met vriendelijke groet,',
            teamName: 'Team TableTech',
            copyright: '© 2025 TableTech - Alle rechten voorbehouden',
            emailReason: 'Je ontvangt deze email omdat je een afspraak hebt aangevraagd op de website',
            companySubject: `🔥 NIEUWE AFSPRAAK - ${customer_name}${appointment_date ? ` (${formatDate(appointment_date)})` : ''}`,
            newAppointment: 'NIEUWE AFSPRAAK AANVRAAG',
            status: 'Status',
            statusNew: 'NIEUW',
            bookingId: 'Booking ID',
            actionRequired: 'Actie Vereist',
            appointmentDetails: '📋 AFSPRAAK DETAILS',
            duration: '⏱️ Duur:',
            durationValue: '30 minuten (Telefonisch gesprek)',
            customerInfo: '👤 KLANT INFORMATIE',
            name: '📝 Naam:',
            email: '📧 Email:',
            phone: '📱 Telefoon:',
            customerMessage: '💬 KLANT BERICHT',
            actionTitle: '⚡ ACTIE VEREIST',
            confirmWithin: 'Bevestig deze afspraak binnen 24 uur',
            callCustomer: '📞 Bel Klant',
            emailCustomer: '📧 Email Klant',
            systemInfo: '🔧 SYSTEEM INFORMATIE',
            requestId: 'Request ID:',
            source: 'Bron:',
            sourceValue: 'TableTech Website',
            created: 'Aangemaakt:',
            autoGenerated: 'Dit is een automatisch gegenereerd bericht van het TableTech Booking System.'
          };
        }
      };

      const texts = getEmailContent(language);

      // Customer email - simple black/white/orange theme
      const customerEmail = await sendEmail(
        customer_email,
        texts.subject,
        `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #000000;">
            <div style="background: #000000; padding: 40px 0;">
              <div style="max-width: 600px; margin: 0 auto; background: #000000; border: 1px solid #333; overflow: hidden;">
                <!-- Header -->
                <div style="background: #ff6600; padding: 40px 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 600;">TableTech</h1>
                  <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Afspraak Bevestiging</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px; color: white;">
                  <h2 style="color: #ff6600; margin: 0 0 20px 0; font-size: 24px;">${texts.greeting}</h2>

                  <p style="line-height: 1.6; color: white; margin-bottom: 30px;">
                    ${texts.thanks}
                  </p>

                  <!-- Appointment Card -->
                  <div style="border: 2px solid #ff6600; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #ff6600; margin: 0 0 20px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                      ${texts.detailsTitle}
                    </h3>

                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px 0; color: #999; vertical-align: top; width: 40%;">${texts.dateLabel}</td>
                        <td style="padding: 10px 0; color: white; font-weight: 600;">${formatDate(appointment_date)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #999; vertical-align: top;">${texts.timeLabel}</td>
                        <td style="padding: 10px 0; color: white; font-weight: 600;">${appointment_time}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #999; vertical-align: top;">${texts.serviceLabel}</td>
                        <td style="padding: 10px 0; color: white; font-weight: 600;">${service_type || texts.defaultService}</td>
                      </tr>
                      ${notes ? `
                      <tr>
                        <td style="padding: 10px 0; color: #999; vertical-align: top;">${texts.notesLabel}</td>
                        <td style="padding: 10px 0; color: white;">${notes}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>

                  <!-- Contact Info -->
                  <div style="text-align: center; margin: 40px 0; padding: 30px; border: 1px solid #333;">
                    <p style="color: #999; margin: 0 0 5px 0; font-size: 14px;">${texts.contactTitle}</p>
                    <p style="color: white; margin: 5px 0; font-size: 14px;">
                      📧 <a href="mailto:info@tabletech.nl" style="color: #ff6600; text-decoration: none;">info@tabletech.nl</a>
                    </p>
                    <p style="color: white; margin: 5px 0; font-size: 14px;">
                      📱 <a href="tel:+31648447234" style="color: #ff6600; text-decoration: none;">+31 6 48447234</a>
                    </p>
                    <p style="color: white; margin: 5px 0; font-size: 14px;">
                      🌐 <a href="https://tabletech.nl" style="color: #ff6600; text-decoration: none;">www.tabletech.nl</a>
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="padding: 30px; text-align: center; border-top: 1px solid #333;">
                  <p style="color: #999; margin: 0; font-size: 14px;">
                    ${texts.regards}<br>
                    <strong style="color: #ff6600;">${texts.teamName}</strong>
                  </p>
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #222;">
                    <p style="color: #666; margin: 5px 0; font-size: 11px;">
                      ${texts.copyright}
                    </p>
                    <p style="color: #555; margin: 5px 0; font-size: 11px;">
                      ${texts.emailReason}
                    </p>
                  </div>
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
        // Don't fail the whole request, just note the email error
      } else {
        console.log('  ✅ Customer email sent:', customerEmail.id);
      }

      // Company notification with professional dark theme
      const timestamp = new Date().toLocaleString(language === 'en' ? 'en-US' : 'nl-NL', {
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      // Use COMPANY_EMAIL or MAIL_TO_INTERNAL or default
      const companyEmailAddress = process.env.COMPANY_EMAIL || process.env.MAIL_TO_INTERNAL || 'info@tabletech.nl';
      console.log('  📨 Sending company notification to:', companyEmailAddress);

      const companyEmail = await sendEmail(
        companyEmailAddress,
        texts.companySubject,
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
                  <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🚨 ${texts.newAppointment}</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 14px;">${texts.created} ${timestamp}</p>
                </div>

                <!-- Main Content -->
                <div style="padding: 30px;">
                  <!-- Quick Stats Bar -->
                  <div style="display: flex; background: #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #444;">
                    <div style="flex: 1; text-align: center; border-right: 1px solid #444;">
                      <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">${texts.status}</p>
                      <p style="color: #4ade80; margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">${texts.statusNew}</p>
                    </div>
                    <div style="flex: 1; text-align: center; border-right: 1px solid #444;">
                      <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">${texts.bookingId}</p>
                      <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${newAppointment.id}</p>
                    </div>
                    <div style="flex: 1; text-align: center;">
                      <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">${texts.actionRequired}</p>
                      <p style="color: #fbbf24; margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">⚡ 24u</p>
                    </div>
                  </div>

                  <!-- Appointment Details -->
                  <div style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 1px solid #444;">
                    <h2 style="color: #60a5fa; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                      ${texts.appointmentDetails}
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #888; width: 35%;">${texts.dateLabel}</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${formatDate(appointment_date)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">${texts.timeLabel}</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${appointment_time}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">${texts.serviceLabel}</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${service_type || texts.defaultService}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">${texts.duration}</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${texts.durationValue}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Customer Information -->
                  <div style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 1px solid #444;">
                    <h2 style="color: #4ade80; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                      ${texts.customerInfo}
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; color: #888; width: 35%;">${texts.name}</td>
                        <td style="padding: 12px 0; color: #f0f0f0; font-weight: 500;">${customer_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">${texts.email}</td>
                        <td style="padding: 12px 0;">
                          <a href="mailto:${customer_email}" style="color: #60a5fa; text-decoration: none;">${customer_email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #888;">${texts.phone}</td>
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
                      ${texts.customerMessage}
                    </h2>
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                      <p style="color: #d0d0d0; margin: 0; line-height: 1.8; white-space: pre-wrap;">${notes}</p>
                    </div>
                  </div>
                  ` : ''}

                  <!-- Action Required -->
                  <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); border-radius: 12px; padding: 25px; margin-bottom: 20px;">
                    <h2 style="color: white; margin: 0 0 15px 0; font-size: 18px; text-align: center;">${texts.actionTitle}</h2>
                    <p style="color: rgba(255, 255, 255, 0.95); margin: 0 0 20px 0; text-align: center; line-height: 1.6;">
                      ${texts.confirmWithin}
                    </p>
                    <div style="text-align: center;">
                      <a href="tel:${customer_phone}" style="display: inline-block; margin: 0 10px; padding: 12px 30px; background: white; color: #ff6b6b; text-decoration: none; border-radius: 30px; font-weight: 600;">${texts.callCustomer}</a>
                      <a href="mailto:${customer_email}" style="display: inline-block; margin: 0 10px; padding: 12px 30px; background: rgba(255, 255, 255, 0.2); color: white; text-decoration: none; border-radius: 30px; font-weight: 600; border: 2px solid white;">${texts.emailCustomer}</a>
                    </div>
                  </div>

                  <!-- System Info -->
                  <div style="background: #1f1f1f; border-radius: 12px; padding: 20px; border: 1px solid #333;">
                    <h3 style="color: #666; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase;">${texts.systemInfo}</h3>
                    <table style="width: 100%; font-size: 13px;">
                      <tr>
                        <td style="padding: 8px 0; color: #555;">${texts.requestId}</td>
                        <td style="padding: 8px 0; color: #888; font-family: monospace;">${newAppointment.id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #555;">${texts.source}</td>
                        <td style="padding: 8px 0; color: #888;">${texts.sourceValue}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #555;">${texts.created}</td>
                        <td style="padding: 8px 0; color: #888;">${timestamp}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background: #0f0f0f; padding: 25px; text-align: center; border-top: 1px solid #333;">
                  <p style="color: #666; margin: 0; font-size: 13px;">
                    ${texts.autoGenerated}
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
        // Don't fail the whole request, just note the email error
      } else {
        console.log('  ✅ Company email sent:', companyEmail.id);
      }

      // Track if any email failed
      const emailFailed = customerEmail.error || companyEmail.error;
      emailsSent = !emailFailed;
    } catch (emailError) {
      console.error('  ⚠️ Email error (appointment still created):', emailError);
      console.error('  Error details:', JSON.stringify(emailError));
      emailsSent = false;
    }

    return res.status(201).json({
      success: true,
      appointment: {
        id: newAppointment.id,
        appointment_date: newAppointment.appointment_date,
        appointment_time: newAppointment.appointment_time,
        customer_name: newAppointment.customer_name,
        status: newAppointment.status
      },
      message: dbAvailable && emailsSent
        ? 'Afspraak succesvol aangemaakt. U ontvangt een bevestiging per email.'
        : 'Afspraak geregistreerd. We nemen contact met u op voor bevestiging.',
      demo: !dbAvailable,
      emailSent: emailsSent
    });
  } catch (error) {
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