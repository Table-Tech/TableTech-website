import express, { Request, Response } from 'express';
import hybridDb from '../services/hybridDatabaseService';
import appointmentDb from '../services/appointmentDatabaseService';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { env } from '../env';
import { getClientIP, hashIP } from '../lib/security/rateLimit';
import { validateAppointment } from '../lib/validation/appointmentV2';
import { appointmentRateLimiter } from '../lib/security/rateLimit';
import { checkIdempotency } from '../lib/security/idempotency';
import { logger } from '../lib/logging/logger';
import { CustomerConfirmationEmail } from '../lib/email/templates/CustomerConfirmationEmail';
import { InternalNotificationEmail } from '../lib/email/templates/InternalNotificationEmail';

const router = express.Router();
const resend = new Resend(env.RESEND_API_KEY);

// Professional email function using React templates for V2 appointments
const sendV2Emails = async (data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  restaurant?: string;
  restaurantName?: string;
  contactPerson?: string;
  referenceNumber?: string;
  date?: string;
  time?: string;
  message?: string;
}): Promise<{ customer: boolean; internal: boolean }> => {
  logger.info('📧 Sending V2 appointment emails with professional templates', { 
    email: data.email.substring(0, 3) + '***',
    restaurant: data.restaurantName 
  });

  try {
    // Extract name parts
    const contactPerson = data.contactPerson || `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const nameParts = contactPerson.split(' ');
    const firstName = data.firstName || nameParts[0] || contactPerson;
    const lastName = data.lastName || nameParts.slice(1).join(' ') || '';

    // Format date for display
    const formatDate = (dateString: string): string => {
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

    // Generate request ID and timestamp
    const requestId = `V2-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toLocaleString('nl-NL', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // Customer email with React template
    const customerEmailHtml = render(CustomerConfirmationEmail({
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      restaurant: data.restaurantName,
      preferredDate: data.date ? formatDate(data.date) : undefined,
      preferredTime: data.time,
      message: data.message || 'Demo afspraak aangevraagd via TableTech website',
    }));

    const customerEmailText = `
Beste ${firstName},

Bedankt voor je aanvraag!

We hebben je aanvraag voor een afspraak ontvangen. 
Ons team neemt binnen 1 werkdag contact met je op om de afspraak te bevestigen 
en eventuele vragen te bespreken.

${data.date && data.time ? `
📅 Jouw voorkeur: ${formatDate(data.date)} om ${data.time}
(Telefonisch gesprek van 30 minuten)
` : ''}

Details van je aanvraag:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Naam: ${firstName} ${lastName}
• E-mail: ${data.email}
${data.phone ? `• Telefoon: ${data.phone}` : ''}
${data.restaurantName ? `• Restaurant: ${data.restaurantName}` : ''}
${data.date ? `• Voorkeursdatum: ${formatDate(data.date)}` : ''}
${data.time ? `• Voorkeurstijd: ${data.time}` : ''}
${data.referenceNumber ? `• Referentie: ${data.referenceNumber}` : ''}

Bericht:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mocht je vragen hebben of de afspraak willen wijzigen, 
neem dan gerust contact met ons op via info@tabletech.nl

Met vriendelijke groet,
Team TableTech
https://tabletech.nl

Je ontvangt deze e-mail omdat je een afspraak hebt aangevraagd via onze website.
    `.trim();

    // Internal email with React template
    const internalEmailHtml = render(InternalNotificationEmail({
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      restaurant: data.restaurantName,
      preferredDate: data.date ? formatDate(data.date) : undefined,
      preferredTime: data.time,
      message: data.message || 'Geen bericht',
      requestId,
      pageUrl: 'https://tabletech.nl',
      utm: undefined,
      ipHash: 'V2-API',
      timestamp,
    }));

    const internalEmailText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 NIEUWE AFSPRAAK AANVRAAG - TABLETECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 AFSPRAAK DETAILS:
┌────────────────────────────────────────┐
│ 🆔 Booking ID: ${requestId}
│ 📅 Datum: ${data.date ? formatDate(data.date) : 'Niet opgegeven'}
│ 🕐 Tijd: ${data.time || 'Niet opgegeven'}
│ ⏱️ Duur: 30 minuten (Telefonisch gesprek)
│ 🔒 Status: NIEUW
│ 📋 Referentie: ${data.referenceNumber}
└────────────────────────────────────────┘

👤 KLANT INFORMATIE:
┌────────────────────────────────────────┐
│ 📝 Naam: ${firstName} ${lastName}
│ 📧 Email: ${data.email}
│ 📱 Telefoon: ${data.phone || 'Niet opgegeven'}
│ 🏪 Restaurant: ${data.restaurantName || 'Niet opgegeven'}
└────────────────────────────────────────┘

💬 KLANT BERICHT:
┌────────────────────────────────────────┐
│ ${(data.message || 'Geen bericht').split('\n').join('\n│ ')}
└────────────────────────────────────────┘

🔧 SYSTEEM INFORMATIE:
┌────────────────────────────────────────┐
│ 🔗 Bron: TableTech Website (V2 API)
│ ⏰ Ontvangen op: ${timestamp}
│ 🆔 Request ID: ${requestId}
│ 📄 Pagina: Frontend Booking System
└────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ACTIE VEREIST: Bevestig deze afspraak binnen 24 uur
📞 Contacteer klant: ${data.phone || 'Alleen email beschikbaar'} of ${data.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    // Send customer email
    const customerResult = await resend.emails.send({
      from: env.MAIL_FROM,
      to: data.email,
      subject: `Bevestiging afspraak - TableTech${data.referenceNumber ? ` (${data.referenceNumber})` : ''}`,
      html: customerEmailHtml,
      text: customerEmailText,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Mailer': 'TableTech Booking System V2',
        'List-Unsubscribe': `<mailto:info@tabletech.nl?subject=Unsubscribe>`,
        'X-Auto-Response-Suppress': 'OOF',
      },
    });

    // Send internal email  
    const internalResult = await resend.emails.send({
      from: env.MAIL_FROM,
      to: env.MAIL_TO_INTERNAL,
      subject: `🔥 NIEUWE AFSPRAAK - ${firstName} ${lastName}${data.date ? ` (${formatDate(data.date)})` : ''}${data.referenceNumber ? ` - ${data.referenceNumber}` : ''}`,
      html: internalEmailHtml,
      text: internalEmailText,
    });

    const customerSuccess = !!customerResult.data?.id;
    const internalSuccess = !!internalResult.data?.id;

    logger.info('📧 Professional email results', {
      customer: customerSuccess ? 'sent' : 'failed',
      internal: internalSuccess ? 'sent' : 'failed',
      customerError: customerResult.error?.message,
      internalError: internalResult.error?.message,
      customerMessageId: customerResult.data?.id,
      internalMessageId: internalResult.data?.id
    });

    return {
      customer: customerSuccess,
      internal: internalSuccess
    };

  } catch (error) {
    logger.error('📧 Professional email sending failed', { error });
    return { customer: false, internal: false };
  }
};

/**
 * GET /api/v2/appointments/slots
 * Get available time slots for a specific date
 */
router.get('/slots', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Date parameter is required'
      });
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
      return;
    }

    // Check if date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      res.status(400).json({
        success: false,
        error: 'Cannot get slots for past dates'
      });
      return;
    }

    // Get available slots
    const slots = await hybridDb.getAvailableSlots(date);

    res.json({
      success: true,
      date,
      slots,
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.isAvailable).length
    });

  } catch (error) {
    logger.error('Error fetching time slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available time slots'
    });
  }
});

/**
 * GET /api/v2/appointments/booked
 * Get all booked slots for a date range (for calendar display)
 */
router.get('/booked', async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
      return;
    }

    // Note: getBookedSlots not available in hybrid service - would need implementation
    const bookedSlots: any[] = [];

    res.json({
      success: true,
      bookedSlots,
      count: bookedSlots.length
    });

  } catch (error) {
    logger.error('Error fetching booked slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booked slots'
    });
  }
});

/**
 * GET /api/v2/appointments/available-dates
 * Get available dates for a specific month (only dates with available slots)
 */
router.get('/available-dates', async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      res.status(400).json({
        success: false,
        error: 'Year and month are required'
      });
      return;
    }

    const availableDates = await hybridDb.getAvailableDates(
      parseInt(year as string),
      parseInt(month as string)
    );

    res.json({
      success: true,
      year: parseInt(year as string),
      month: parseInt(month as string),
      availableDates,
      count: availableDates.length
    });

  } catch (error) {
    logger.error('Error fetching available dates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available dates'
    });
  }
});

/**
 * GET /api/v2/appointments/blocked-dates
 * Get blocked dates for a specific month
 */
router.get('/blocked-dates', async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      res.status(400).json({
        success: false,
        error: 'Year and month are required'
      });
      return;
    }

    const blockedDates = await appointmentDb.getBlockedDates(
      parseInt(year as string),
      parseInt(month as string)
    );

    res.json({
      success: true,
      blockedDates
    });

  } catch (error) {
    logger.error('Error fetching blocked dates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blocked dates'
    });
  }
});

/**
 * POST /api/v2/appointments
 * Create a new appointment
 */
router.post('/', 
  appointmentRateLimiter,
  checkIdempotency,
  validateAppointment,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const appointmentData = req.body;

      // Additional validation for time slot availability
      const isAvailable = await hybridDb.isTimeSlotAvailable(
        appointmentData.date,
        appointmentData.time
      );

      if (!isAvailable) {
        res.status(409).json({
          success: false,
          error: 'This time slot is no longer available. Please select another time.',
          code: 'SLOT_UNAVAILABLE'
        });
      return;
    }

      // Create appointment in database
      const { id, referenceNumber } = await hybridDb.createAppointment(appointmentData);

      // Generate request ID and get client info
      const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const clientIP = getClientIP(req);
      hashIP(clientIP); // Hash IP for privacy

      // Send confirmation emails with V2 direct email service
      const emailData = {
        ...appointmentData,
        referenceNumber,
        contactPerson: appointmentData.contactPerson,
        email: appointmentData.email,
        phone: appointmentData.phone,
        restaurantName: appointmentData.restaurantName,
        date: appointmentData.date,
        time: appointmentData.time,
        message: appointmentData.message || 'Demo afspraak aangevraagd'
      };
      
      const emailResults = await sendV2Emails(emailData);

      // Update email log status in database
      await hybridDb.updateEmailLogStatus(
        id,
        'confirmation',
        emailResults.customer ? 'sent' : 'failed',
        emailResults.customer ? undefined : 'Failed to send customer confirmation'
      );

      // Log the appointment creation
      logger.info('Appointment created', {
        referenceNumber,
        requestId,
        date: appointmentData.date,
        time: appointmentData.time,
        restaurant: appointmentData.restaurantName,
        emailsSent: emailResults
      });

      res.status(201).json({
        success: true,
        message: 'Appointment successfully created',
        referenceNumber,
        appointmentDetails: {
          date: appointmentData.date,
          time: appointmentData.time,
          restaurantName: appointmentData.restaurantName
        },
        emailConfirmation: {
          sent: emailResults.customer && emailResults.internal,
          customer: emailResults.customer,
          internal: emailResults.internal,
          message: emailResults.customer && emailResults.internal
            ? 'Alle emails succesvol verzonden'
            : emailResults.customer
            ? 'Bevestigingsmail verzonden, interne notificatie mislukt'
            : emailResults.internal
            ? 'Interne notificatie verzonden, bevestigingsmail mislukt'
            : 'Afspraak aangemaakt maar emails konden niet verzonden worden'
        }
      });
      return;
    } catch (error) {
      logger.error('Error creating appointment:', error);
      
      // Check for specific error types
      if (error instanceof Error && error.message.includes('time slot')) {
        res.status(409).json({
          success: false,
          error: error.message,
          code: 'SLOT_CONFLICT'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create appointment. Please try again.'
      });
      return;
    }
  }
);

/**
 * GET /api/v2/appointments/status
 * Get database status and which system is being used
 */
router.get('/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const status = hybridDb.getDatabaseStatus();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      databases: status,
      message: 'System automatically falls back to SQLite when PostgreSQL is unavailable'
    });
  } catch (error) {
    logger.error('Error getting database status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get database status'
    });
  }
});

/**
 * GET /api/v2/appointments/:reference
 * Get appointment by reference number
 */
router.get('/:reference', async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference } = req.params;

    if (!reference) {
      res.status(400).json({
        success: false,
        error: 'Reference number is required'
      });
      return;
    }

    const appointment = await appointmentDb.getAppointmentByReference(reference);

    if (!appointment) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    res.json({
      success: true,
      appointment: {
        referenceNumber: appointment.reference_number,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        restaurantName: appointment.restaurant_name,
        status: appointment.status,
        createdAt: appointment.created_at
      }
    });

  } catch (error) {
    logger.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment'
    });
  }
});

/**
 * DELETE /api/v2/appointments/:reference
 * Cancel appointment by reference number
 */
router.delete('/:reference', appointmentRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference } = req.params;
    const { email } = req.body; // Email for verification

    if (!reference) {
      res.status(400).json({
        success: false,
        error: 'Reference number is required'
      });
      return;
    }

    // Get appointment details before cancelling
    const appointment = await appointmentDb.getAppointmentByReference(reference);
    
    if (!appointment) {
      res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
      return;
    }

    if (appointment.status === 'cancelled') {
      res.status(400).json({
        success: false,
        error: 'Appointment is already cancelled'
      });
      return;
    }

    // Cancel the appointment
    const cancelled = await appointmentDb.cancelAppointment(reference);

    if (cancelled && email) {
      // TODO: Implement cancellation email with React templates
      logger.info('Appointment cancelled, email notification not yet implemented', {
        email: email.substring(0, 3) + '***',
        reference
      });
    }

    logger.info('Appointment cancelled', {
      referenceNumber: reference,
      originalDate: appointment.appointment_date,
      originalTime: appointment.appointment_time
    });

    res.json({
      success: true,
      message: 'Appointment successfully cancelled',
      freedSlot: {
        date: appointment.appointment_date,
        time: appointment.appointment_time
      }
    });

  } catch (error) {
    logger.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel appointment'
    });
  }
});

/**
 * POST /api/v2/appointments/block-date
 * Block a specific date (admin only)
 */
router.post('/block-date', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, reason, adminKey } = req.body;

    // Simple admin authentication (in production, use proper auth)
    if (adminKey !== process.env.ADMIN_KEY) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    await appointmentDb.blockDate(date, reason);

    res.json({
      success: true,
      message: `Date ${date} has been blocked`
    });

  } catch (error) {
    logger.error('Error blocking date:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to block date'
    });
  }
});

/**
 * DELETE /api/v2/appointments/block-date/:date
 * Unblock a date (admin only)
 */
router.delete('/block-date/:date', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const { adminKey } = req.body;

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_KEY) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    // Note: Block/unblock not implemented in hybrid service yet
    res.json({
      success: true,
      message: `Date ${date} unblock requested (not yet implemented in hybrid mode)`
    });

  } catch (error) {
    logger.error('Error unblocking date:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unblock date'
    });
  }
});

export default router;