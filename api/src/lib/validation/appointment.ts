import { z } from 'zod';

// UTM parameters schema
export const utmSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
});

// Main appointment schema
export const appointmentSchema = z.object({
  firstName: z.string().min(1, 'Voornaam is verplicht').max(100),
    lastName: z.string().min(1, 'Achternaam is verplicht').max(100),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().optional().refine(
    (val) => !val || /^(\+31|0031|0)?[1-9][0-9]{8}$/.test(val.replace(/\s/g, '')),
    'Ongeldig telefoonnummer'
  ),
  restaurant: z.string().optional().refine(val => !val || val.length <= 200, 'Maximaal 200 tekens'),
  preferredDate: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Ongeldige datum'
  ),
  preferredTime: z.string().optional().refine(
    (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
    'Ongeldige tijd (gebruik HH:mm formaat)'
  ),
  subject: z.string().optional().refine(val => !val || val.length <= 200, 'Maximaal 200 tekens'),
  message: z.string().min(1, 'Bericht is verplicht').max(5000),
  consentMarketing: z.boolean().optional(),
  pageUrl: z.string().url().optional(),
  utm: utmSchema.optional(),
  
  // Anti-spam fields
  hp: z.string().optional(), // Honeypot - must be empty
  formRenderTs: z.number().optional(), // Form render timestamp
  captchaToken: z.string().optional(), // CAPTCHA token
});

export type AppointmentData = z.infer<typeof appointmentSchema>;

// Request headers schema
export const requestHeadersSchema = z.object({
  'idempotency-key': z.string().uuid('Invalid idempotency key'),
  'x-client-version': z.string().optional(),
});

// Response schemas
export const successResponseSchema = z.object({
  ok: z.literal(true),
  requestId: z.string(),
});

export const errorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;