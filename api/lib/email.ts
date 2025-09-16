import { Resend } from 'resend';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { Appointment } from './db';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@tabletech.nl';
const COMPANY_NAME = 'TableTech';
const COMPANY_PHONE = '+31 6 12345678';
const COMPANY_ADDRESS = 'Amsterdam, Nederland';

export interface EmailData {
  appointment: Appointment;
  cancelToken?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, 'EEEE d MMMM yyyy', { locale: nl });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  return `${hours}:${minutes}`;
}

export async function sendCustomerConfirmation(data: EmailData): Promise<void> {
  const { appointment } = data;
  const formattedDate = formatDate(appointment.appointment_date);
  const formattedTime = formatTime(appointment.appointment_time);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .appointment-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #666;
        }
        .value {
          color: #333;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
        .cancel-link {
          color: #e53e3e;
          text-decoration: none;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${COMPANY_NAME}</h1>
        <p style="margin: 0;">Afspraak Bevestiging</p>
      </div>

      <div class="content">
        <p>Beste ${appointment.customer_name},</p>

        <p>Bedankt voor het maken van een afspraak bij ${COMPANY_NAME}. Uw afspraak is succesvol ingepland.</p>

        <div class="appointment-box">
          <h3 style="margin-top: 0; color: #667eea;">Afspraak Details</h3>

          <div class="detail-row">
            <span class="label">Datum:</span>
            <span class="value">${formattedDate}</span>
          </div>

          <div class="detail-row">
            <span class="label">Tijd:</span>
            <span class="value">${formattedTime} uur</span>
          </div>

          ${appointment.service_type ? `
          <div class="detail-row">
            <span class="label">Service:</span>
            <span class="value">${appointment.service_type}</span>
          </div>
          ` : ''}

          <div class="detail-row">
            <span class="label">Locatie:</span>
            <span class="value">${COMPANY_ADDRESS}</span>
          </div>

          ${appointment.notes ? `
          <div class="detail-row">
            <span class="label">Opmerkingen:</span>
            <span class="value">${appointment.notes}</span>
          </div>
          ` : ''}
        </div>

        <p><strong>Belangrijke informatie:</strong></p>
        <ul>
          <li>Komt u alstublieft 5 minuten voor uw afspraak</li>
          <li>Bij verhindering graag minimaal 24 uur van tevoren afmelden</li>
          <li>Voor vragen kunt u contact opnemen via ${COMPANY_PHONE}</li>
        </ul>

        ${data.cancelToken ? `
        <p style="margin-top: 30px;">
          <a href="${process.env.BASE_URL}/afspraak/annuleren?token=${data.cancelToken}" class="cancel-link">
            Afspraak annuleren
          </a>
        </p>
        ` : ''}
      </div>

      <div class="footer">
        <p><strong>${COMPANY_NAME}</strong></p>
        <p>${COMPANY_ADDRESS}<br>
        Tel: ${COMPANY_PHONE}<br>
        Email: ${COMPANY_EMAIL}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Deze email is automatisch gegenereerd. Antwoord niet rechtstreeks op deze email.
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Beste ${appointment.customer_name},

Bedankt voor het maken van een afspraak bij ${COMPANY_NAME}.

AFSPRAAK DETAILS:
- Datum: ${formattedDate}
- Tijd: ${formattedTime} uur
${appointment.service_type ? `- Service: ${appointment.service_type}` : ''}
- Locatie: ${COMPANY_ADDRESS}
${appointment.notes ? `- Opmerkingen: ${appointment.notes}` : ''}

BELANGRIJKE INFORMATIE:
- Komt u alstublieft 5 minuten voor uw afspraak
- Bij verhindering graag minimaal 24 uur van tevoren afmelden
- Voor vragen: ${COMPANY_PHONE}

${data.cancelToken ? `Afspraak annuleren: ${process.env.BASE_URL}/afspraak/annuleren?token=${data.cancelToken}` : ''}

Met vriendelijke groet,
${COMPANY_NAME}
  `;

  try {
    await resend.emails.send({
      from: `${COMPANY_NAME} <info@tabletech.nl>`,
      to: appointment.customer_email,
      reply_to: COMPANY_EMAIL,
      subject: `Afspraak bevestiging - ${formattedDate} om ${formattedTime}`,
      html: htmlContent,
      text: textContent,
    });
  } catch (error) {
    console.error('Error sending customer email:', error);
    throw new Error('Failed to send confirmation email');
  }
}

export async function sendCompanyNotification(data: EmailData): Promise<void> {
  const { appointment } = data;
  const formattedDate = formatDate(appointment.appointment_date);
  const formattedTime = formatTime(appointment.appointment_time);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .alert-header {
          background: #48bb78;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .customer-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #48bb78;
        }
        .detail-row {
          padding: 8px 0;
        }
        .label {
          font-weight: 600;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="alert-header">
        <h2 style="margin: 0;">🔔 Nieuwe Afspraak</h2>
      </div>

      <div class="content">
        <div class="customer-box">
          <h3 style="margin-top: 0; color: #48bb78;">Klant Gegevens</h3>

          <div class="detail-row">
            <span class="label">Naam:</span> ${appointment.customer_name}
          </div>

          <div class="detail-row">
            <span class="label">Email:</span> <a href="mailto:${appointment.customer_email}">${appointment.customer_email}</a>
          </div>

          <div class="detail-row">
            <span class="label">Telefoon:</span> <a href="tel:${appointment.customer_phone}">${appointment.customer_phone}</a>
          </div>
        </div>

        <div class="customer-box">
          <h3 style="margin-top: 0; color: #48bb78;">Afspraak Details</h3>

          <div class="detail-row">
            <span class="label">Datum:</span> ${formattedDate}
          </div>

          <div class="detail-row">
            <span class="label">Tijd:</span> ${formattedTime} uur
          </div>

          ${appointment.service_type ? `
          <div class="detail-row">
            <span class="label">Service:</span> ${appointment.service_type}
          </div>
          ` : ''}

          ${appointment.notes ? `
          <div class="detail-row">
            <span class="label">Opmerkingen:</span> ${appointment.notes}
          </div>
          ` : ''}

          <div class="detail-row">
            <span class="label">Aangemaakt op:</span> ${new Date().toLocaleString('nl-NL')}
          </div>
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <a href="${process.env.ADMIN_URL || '#'}" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px;">
            Open Admin Panel
          </a>
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: `${COMPANY_NAME} System <info@tabletech.nl>`,
      to: COMPANY_EMAIL,
      reply_to: appointment.customer_email,
      subject: `🔔 Nieuwe afspraak - ${appointment.customer_name} - ${formattedDate}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending company notification:', error);
  }
}