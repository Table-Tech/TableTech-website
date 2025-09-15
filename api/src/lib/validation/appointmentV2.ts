import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// V2 Appointment schema for enhanced privacy-focused system
export const appointmentSchemaV2 = z.object({
  // Accept both new format (firstName/lastName) and old format (contactPerson)
  firstName: z.string().min(1, 'Voornaam is verplicht').max(255).optional(),
  lastName: z.string().min(1, 'Achternaam is verplicht').max(255).optional(),
  contactPerson: z.string().min(1, 'Contactpersoon is verplicht').max(255).optional(),

  // Accept both restaurantName and restaurant
  restaurantName: z.string().min(1, 'Restaurant naam is verplicht').max(255).optional(),
  restaurant: z.string().min(1, 'Restaurant naam is verplicht').max(255).optional(),

  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().optional(),

  // Accept both date and preferredDate
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum moet in YYYY-MM-DD formaat').optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum moet in YYYY-MM-DD formaat').optional(),

  // Accept both time and preferredTime
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Tijd moet in HH:MM formaat').optional(),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Tijd moet in HH:MM formaat').optional(),

  message: z.string().max(1000, 'Bericht mag maximaal 1000 tekens bevatten').optional(),

  // Anti-spam fields
  hp: z.string().optional(), // Honeypot
  formRenderTs: z.number().optional(), // Form render timestamp
}).refine(
  (data) => {
    // Ensure we have either firstName/lastName OR contactPerson
    const hasName = (data.firstName && data.lastName) || data.contactPerson;
    // Ensure we have either restaurantName OR restaurant
    const hasRestaurant = data.restaurantName || data.restaurant;
    // Ensure we have either date OR preferredDate
    const hasDate = data.date || data.preferredDate;
    // Ensure we have either time OR preferredTime
    const hasTime = data.time || data.preferredTime;

    return hasName && hasRestaurant && hasDate && hasTime;
  },
  {
    message: 'Verplichte velden ontbreken',
    path: ['validation']
  }
);

export type AppointmentDataV2 = z.infer<typeof appointmentSchemaV2>;

// Reference number schema for lookups
export const referenceSchema = z.object({
  reference: z.string().regex(/^TT\d{4}-[A-Z0-9]{4}$/, 'Ongeldig referentienummer formaat'),
});

// Date validation schema
export const dateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum moet in YYYY-MM-DD formaat'),
});

// Cancellation schema
export const cancellationSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres').optional(),
});

// Block date schema (admin)
export const blockDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum moet in YYYY-MM-DD formaat'),
  reason: z.string().optional(),
  adminKey: z.string().min(1, 'Admin key is verplicht'),
});

/**
 * Validation middleware for V2 appointments
 */
export const validateAppointment = (req: Request, res: Response, next: NextFunction): void => {
  try {
    console.log('📝 Validating appointment data:', JSON.stringify(req.body, null, 2));

    // Check for missing required fields before parsing
    const missingFields: string[] = [];

    // Check name fields
    if (!req.body.firstName && !req.body.lastName && !req.body.contactPerson) {
      missingFields.push('Naam (voornaam en achternaam)');
    }

    // Check restaurant
    if (!req.body.restaurantName && !req.body.restaurant) {
      missingFields.push('Restaurant naam');
    }

    // Check date
    if (!req.body.date && !req.body.preferredDate) {
      missingFields.push('Datum');
    }

    // Check time
    if (!req.body.time && !req.body.preferredTime) {
      missingFields.push('Tijd');
    }

    // Check email
    if (!req.body.email) {
      missingFields.push('E-mailadres');
    }

    // If there are missing fields, return early with clear error
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      res.status(400).json({
        success: false,
        error: 'Vul alle verplichte velden in',
        details: missingFields.map(field => ({
          field,
          message: `${field} is verplicht`
        })),
        missingFields,
        code: 'MISSING_FIELDS'
      });
      return;
    }

    const result = appointmentSchemaV2.parse(req.body);

    // Normalize data - use either variant of the fields
    const normalizedData = {
      ...result,
      // Ensure we have firstName and lastName
      firstName: result.firstName || (result.contactPerson ? result.contactPerson.split(' ')[0] : ''),
      lastName: result.lastName || (result.contactPerson ? result.contactPerson.split(' ').slice(1).join(' ') : ''),
      // Ensure we have restaurantName
      restaurantName: result.restaurantName || result.restaurant || '',
      // Ensure we have date and time
      date: result.date || result.preferredDate || '',
      time: result.time || result.preferredTime || '',
    };

    // Additional validation for date/time
    const appointmentDate = new Date(normalizedData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is not in the past
    if (appointmentDate < today) {
      res.status(400).json({
        success: false,
        error: 'Datum kan niet in het verleden liggen',
        code: 'INVALID_DATE'
      });
      return;
    }

    // Check if date is not too far in the future (3 months max)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (appointmentDate > maxDate) {
      res.status(400).json({
        success: false,
        error: 'Datum mag niet meer dan 3 maanden in de toekomst liggen',
        code: 'DATE_TOO_FAR'
      });
      return;
    }

    // Honeypot check
    if (result.hp && result.hp.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid request',
        code: 'SPAM_DETECTED'
      });
      return;
    }

    // Form fill time check (minimum 2 seconds)
    if (result.formRenderTs) {
      const timeTaken = Date.now() - result.formRenderTs;
      if (timeTaken < 2000) {
        res.status(400).json({
          success: false,
          error: 'Formulier te snel ingevuld',
          code: 'TOO_FAST'
        });
        return;
      }
    }

    // Store normalized data
    req.body = normalizedData;
    next();
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Validation failed:', error.errors);
      res.status(400).json({
        success: false,
        error: 'Validatiefout in formuliergegevens',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        })),
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Server validatiefout',
      code: 'INTERNAL_ERROR'
    });
    return;
  }
};

/**
 * Validate reference number parameter
 */
export const validateReference = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = referenceSchema.parse({ reference: req.params.reference });
    req.params.reference = result.reference;
    next();
  } catch {
    res.status(400).json({
      success: false,
      error: 'Ongeldig referentienummer',
      code: 'INVALID_REFERENCE'
    });
    return;
  }
};

/**
 * Validate date parameter
 */
export const validateDate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = dateSchema.parse({ date: req.query.date });
    req.query.date = result.date;
    next();
  } catch {
    res.status(400).json({
      success: false,
      error: 'Ongeldige datum',
      code: 'INVALID_DATE'
    });
    return;
  }
};