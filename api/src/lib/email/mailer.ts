import { Resend } from 'resend';
import { render } from '@react-email/render';
import { env } from '../../env';
import { logger } from '../logging/logger';
import { CustomerConfirmationEmail } from './templates/CustomerConfirmationEmail';
import { InternalNotificationEmail } from './templates/InternalNotificationEmail';
import { AppointmentData } from '../validation/appointment';

const resend = new Resend(env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

// Send email with retry logic
const sendEmailWithRetry = async (options: EmailOptions, attempt = 0): Promise<boolean> => {
  try {
    logger.info({ 
      to: options.to, 
      subject: options.subject,
      from: env.MAIL_FROM,
      attempt: attempt + 1 
    }, 'Attempting to send email');

    const response = await resend.emails.send({
      from: env.MAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      headers: options.headers,
    });

    if (response.error) {
      logger.error({ error: response.error, to: options.to }, 'Resend API returned error');
      throw new Error(response.error.message);
    }

    logger.info({ 
      to: options.to, 
      subject: options.subject,
      messageId: response.data?.id 
    }, 'Email sent successfully');
    return true;
  } catch (error) {
    const isRetryable = 
      error instanceof Error && 
      (error.message.includes('429') || error.message.includes('500') || error.message.includes('503'));

    if (isRetryable && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt];
      logger.warn(
        { error, attempt, delay },
        `Email send failed, retrying in ${delay}ms`
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendEmailWithRetry(options, attempt + 1);
    }

    logger.error({ error, to: options.to }, 'Failed to send email after retries');
    return false;
  }
};

// Format date for display
const formatDate = (dateString?: string): string => {
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

// Send customer confirmation email using React template
export const sendCustomerConfirmation = async (
  data: AppointmentData,
  requestId: string
): Promise<boolean> => {
  try {
    const html = render(CustomerConfirmationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      restaurant: data.restaurant,
      preferredDate: data.preferredDate ? formatDate(data.preferredDate) : undefined,
      preferredTime: data.preferredTime,
      message: data.message,
    }));

    const text = `
Beste ${data.firstName},

Bedankt voor je aanvraag!

We hebben je aanvraag voor een afspraak ontvangen. 
Ons team neemt binnen 1 werkdag contact met je op om de afspraak te bevestigen 
en eventuele vragen te bespreken.

${data.preferredDate && data.preferredTime ? `
📅 Jouw voorkeur: ${formatDate(data.preferredDate)} om ${data.preferredTime}
(Telefonisch gesprek van 30 minuten)
` : ''}

Details van je aanvraag:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Naam: ${data.firstName} ${data.lastName}
• E-mail: ${data.email}
${data.phone ? `• Telefoon: ${data.phone}` : ''}
${data.restaurant ? `• Restaurant: ${data.restaurant}` : ''}
${data.preferredDate ? `• Voorkeursdatum: ${formatDate(data.preferredDate)}` : ''}
${data.preferredTime ? `• Voorkeurstijd: ${data.preferredTime}` : ''}

Bericht:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mocht je vragen hebben of de afspraak willen wijzigen, 
neem dan gerust contact met ons op via info@tabletech.nl

Met vriendelijke groet,
Team ${env.BRAND_NAME}
${env.WEBSITE_URL}

Je ontvangt deze e-mail omdat je een afspraak hebt aangevraagd via onze website.
    `.trim();

    return sendEmailWithRetry({
      to: data.email,
      subject: `Bevestiging afspraak - TableTech`,
      html,
      text,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Mailer': 'TableTech Booking System',
        'List-Unsubscribe': `<mailto:info@tabletech.nl?subject=Unsubscribe>`,
        'X-Auto-Response-Suppress': 'OOF',
      },
    });
  } catch (error) {
    logger.error({ error, requestId }, 'Failed to render customer confirmation email template');
    return false;
  }
};

// Send internal notification email using React template
export const sendInternalNotification = async (
  data: AppointmentData,
  requestId: string,
  ipHash: string
): Promise<boolean> => {
  try {
    const timestamp = new Date().toLocaleString('nl-NL', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // Debug logging
    logger.info({ 
      message: data.message,
      messageLength: data.message?.length,
      messageType: typeof data.message 
    }, 'DEBUG: Message content before sending email');

    const html = render(InternalNotificationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      restaurant: data.restaurant,
      preferredDate: data.preferredDate ? formatDate(data.preferredDate) : undefined,
      preferredTime: data.preferredTime,
      message: data.message,
      requestId,
      pageUrl: data.pageUrl,
      utm: data.utm,
      ipHash,
      timestamp,
    }));

    const text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 NIEUWE AFSPRAAK AANVRAAG - TABLETECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 AFSPRAAK DETAILS:
┌────────────────────────────────────────┐
│ 🆔 Booking ID: ${requestId}
${data.preferredDate ? `│ 📅 Datum: ${formatDate(data.preferredDate)}` : '│ 📅 Datum: Niet opgegeven'}
${data.preferredTime ? `│ 🕐 Tijd: ${data.preferredTime}` : '│ 🕐 Tijd: Niet opgegeven'}
│ ⏱️ Duur: 30 minuten (Telefonisch gesprek)
│ 🔒 Status: NIEUW
└────────────────────────────────────────┘

👤 KLANT INFORMATIE:
┌────────────────────────────────────────┐
│ 📝 Naam: ${data.firstName} ${data.lastName}
│ 📧 Email: ${data.email}
${data.phone ? `│ 📱 Telefoon: ${data.phone}` : '│ 📱 Telefoon: Niet opgegeven'}
${data.restaurant ? `│ 🏪 Restaurant: ${data.restaurant}` : '│ 🏪 Restaurant: Niet opgegeven'}
└────────────────────────────────────────┘

💬 KLANT BERICHT:
┌────────────────────────────────────────┐
│ ${data.message.split('\n').join('\n│ ')}
└────────────────────────────────────────┘

🔧 SYSTEEM INFORMATIE:
┌────────────────────────────────────────┐
│ 🔗 Bron: TableTech Website
│ ⏰ Ontvangen op: ${timestamp}
│ 🌐 IP Hash: ${ipHash}
│ 🆔 Request ID: ${requestId}
${data.pageUrl ? `│ 📄 Pagina: ${data.pageUrl}` : ''}
└────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ACTIE VEREIST: Bevestig deze afspraak binnen 24 uur
📞 Contacteer klant: ${data.phone || 'Alleen email beschikbaar'} of ${data.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return sendEmailWithRetry({
      to: env.MAIL_TO_INTERNAL,
      subject: `🔥 NIEUWE AFSPRAAK - ${data.firstName} ${data.lastName}${data.preferredDate ? ` (${formatDate(data.preferredDate)})` : ''}`,
      html,
      text,
    });
  } catch (error) {
    logger.error({ error, requestId }, 'Failed to render internal notification email template');
    return false;
  }
};

// Send both emails
export const sendAppointmentEmails = async (
  data: AppointmentData,
  requestId: string,
  ipHash: string
): Promise<{ customer: boolean; internal: boolean }> => {
  logger.info('🔧 sendAppointmentEmails called', { 
    data: { ...data, email: data.email.substring(0, 3) + '***' }, 
    requestId, 
    ipHash 
  });
  
  const [customerResult, internalResult] = await Promise.allSettled([
    sendCustomerConfirmation(data, requestId),
    sendInternalNotification(data, requestId, ipHash),
  ]);

  logger.info('📧 Email results', {
    customerResult: customerResult.status,
    internalResult: internalResult.status,
    customerValue: customerResult.status === 'fulfilled' ? customerResult.value : 'failed',
    internalValue: internalResult.status === 'fulfilled' ? internalResult.value : 'failed'
  });

  return {
    customer: customerResult.status === 'fulfilled' && customerResult.value,
    internal: internalResult.status === 'fulfilled' && internalResult.value,
  };
};