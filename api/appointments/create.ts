import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transaction, query, type Appointment } from '../lib/db';
import { validateAppointmentInput, sanitizeInput } from '../lib/validation';
import { sendCustomerConfirmation, sendCompanyNotification } from '../lib/email';
import { cache, getCacheKey } from '../lib/cache';
import crypto from 'crypto';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const sanitizedInput = sanitizeInput(req.body);

    const validationErrors = validateAppointmentInput(sanitizedInput);
    if (validationErrors.length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const existingAppointment = await query<Appointment>(
      `SELECT id FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND status != 'cancelled'
       LIMIT 1`,
      [sanitizedInput.appointment_date, sanitizedInput.appointment_time + ':00']
    );

    if (existingAppointment.length > 0) {
      res.status(409).json({
        error: 'Dit tijdslot is niet meer beschikbaar',
        field: 'appointment_time'
      });
      return;
    }

    const newAppointment = await transaction<Appointment>(async (client) => {
      const insertResult = await client.query<Appointment>(
        `INSERT INTO appointments
         (customer_name, customer_email, customer_phone,
          appointment_date, appointment_time, service_type,
          notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          sanitizedInput.customer_name,
          sanitizedInput.customer_email,
          sanitizedInput.customer_phone,
          sanitizedInput.appointment_date,
          sanitizedInput.appointment_time + ':00',
          sanitizedInput.service_type || null,
          sanitizedInput.notes || null,
          'confirmed'
        ]
      );

      return insertResult.rows[0];
    });

    cache.delete(getCacheKey('availability', 'slots'));

    const cancelToken = crypto.randomBytes(32).toString('hex');

    try {
      await Promise.all([
        sendCustomerConfirmation({
          appointment: newAppointment,
          cancelToken: cancelToken
        }),
        sendCompanyNotification({
          appointment: newAppointment
        })
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
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
    console.error('Error creating appointment:', error);

    cache.delete(getCacheKey('availability', 'slots'));

    res.status(500).json({
      error: 'Er is een fout opgetreden bij het maken van de afspraak',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}