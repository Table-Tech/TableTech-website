import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { appointmentSchema, requestHeadersSchema } from '../lib/validation/appointment';
import { verifyCaptcha } from '../lib/security/captcha';
import { checkIdempotency, storeIdempotency, updateIdempotencyResponse } from '../lib/security/idempotency';
import { isSuspiciousEmail } from '../lib/security/disposableDomains';
import { getClientIP, hashIP } from '../lib/security/rateLimit';
import { sendAppointmentEmails } from '../lib/email/mailer';
import { 
  sanitizeHtml, 
  formatPhoneNumber, 
  calculateSpamScore, 
  SPAM_SCORE_THRESHOLD 
} from '../lib/utils/format';
import { createRequestLogger } from '../lib/logging/logger';
import { env } from '../env';

const router = Router();

router.post('/appointments', async (req: Request, res: Response) => {
  const requestId = nanoid();
  const clientIp = getClientIP(req);
  const ipHash = hashIP(clientIp);
  const logger = createRequestLogger(requestId, ipHash);
  
  logger.info({ method: req.method, path: req.path }, 'Appointment request received');
  
  try {
    // 1. Validate headers
    const headerValidation = requestHeadersSchema.safeParse(req.headers);
    if (!headerValidation.success) {
      logger.warn({ errors: headerValidation.error.errors }, 'Invalid headers');
      return res.status(400).json({
        ok: false,
        error: {
          code: 'INVALID_HEADERS',
          message: 'Missing or invalid request headers',
          details: headerValidation.error.errors,
        },
      });
    }
    
    const idempotencyKey = headerValidation.data['idempotency-key'];
    
    // 2. Check idempotency
    const idempotencyCheck = checkIdempotency(idempotencyKey, req.body);
    if (idempotencyCheck.isDuplicate) {
      logger.info({ idempotencyKey }, 'Duplicate request detected');
      return res.status(200).json(idempotencyCheck.response || {
        ok: true,
        requestId: idempotencyCheck.requestId,
      });
    }
    
    // Store idempotency key immediately
    storeIdempotency(idempotencyKey, requestId, req.body);
    
    // 3. Validate request body
    const validation = appointmentSchema.safeParse(req.body);
    if (!validation.success) {
      logger.warn({ errors: validation.error.errors }, 'Validation failed');
      const response = {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid appointment data',
          details: validation.error.errors,
        },
      };
      updateIdempotencyResponse(idempotencyKey, response);
      return res.status(400).json(response);
    }
    
    const data = validation.data;
    
    // 4. Check honeypot
    if (data.hp) {
      logger.warn('Honeypot triggered');
      const response = {
        ok: false,
        error: {
          code: 'SPAM_DETECTED',
          message: 'Your submission was flagged as spam',
        },
      };
      updateIdempotencyResponse(idempotencyKey, response);
      return res.status(400).json(response);
    }
    
    // 5. Check minimum form fill time
    if (data.formRenderTs) {
      const fillTime = Date.now() - data.formRenderTs;
      if (fillTime < env.MIN_FORM_FILL_TIME) {
        logger.warn({ fillTime }, 'Form filled too quickly');
        const response = {
          ok: false,
          error: {
            code: 'SPAM_DETECTED',
            message: 'Form submitted too quickly',
          },
        };
        updateIdempotencyResponse(idempotencyKey, response);
        return res.status(400).json(response);
      }
    }
    
    // 6. Verify CAPTCHA
    const captchaResult = await verifyCaptcha(data.captchaToken, clientIp);
    if (!captchaResult.success) {
      logger.warn({ reason: captchaResult.message }, 'CAPTCHA verification failed');
      const response = {
        ok: false,
        error: {
          code: 'CAPTCHA_FAILED',
          message: captchaResult.message || 'CAPTCHA verification failed',
        },
      };
      updateIdempotencyResponse(idempotencyKey, response);
      return res.status(400).json(response);
    }
    
    // 7. Check for disposable email
    const emailCheck = isSuspiciousEmail(data.email);
    if (emailCheck.suspicious) {
      logger.warn({ email: data.email, reason: emailCheck.reason }, 'Suspicious email detected');
      const response = {
        ok: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please use a valid business email address',
        },
      };
      updateIdempotencyResponse(idempotencyKey, response);
      return res.status(400).json(response);
    }
    
    // 8. Calculate spam score
    const spamCheck = calculateSpamScore({
      message: data.message,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    
    if (spamCheck.score > SPAM_SCORE_THRESHOLD) {
      logger.warn({ score: spamCheck.score, reasons: spamCheck.reasons }, 'High spam score');
      const response = {
        ok: false,
        error: {
          code: 'SPAM_DETECTED',
          message: 'Your submission was flagged for review',
        },
      };
      updateIdempotencyResponse(idempotencyKey, response);
      return res.status(422).json(response);
    }
    
    // 9. Sanitize data
    const sanitizedData = {
      ...data,
      firstName: sanitizeHtml(data.firstName),
      lastName: sanitizeHtml(data.lastName),
      message: sanitizeHtml(data.message),
      subject: data.subject ? sanitizeHtml(data.subject) : undefined,
      restaurant: data.restaurant ? sanitizeHtml(data.restaurant) : undefined,
      phone: data.phone ? formatPhoneNumber(data.phone) : undefined,
    };
    
    // 10. Send emails
    logger.info('Sending appointment emails');
    const emailResults = await sendAppointmentEmails(sanitizedData, requestId, ipHash);
    
    if (!emailResults.customer && !emailResults.internal) {
      logger.error('Failed to send any emails');
      const response = {
        ok: false,
        error: {
          code: 'EMAIL_FAILED',
          message: 'Failed to process your request. Please try again later.',
        },
      };
      updateIdempotencyResponse(idempotencyKey, response);
      return res.status(500).json(response);
    }
    
    // Log partial failures
    if (!emailResults.customer) {
      logger.warn('Failed to send customer confirmation email');
    }
    if (!emailResults.internal) {
      logger.warn('Failed to send internal notification email');
    }
    
    // Success response
    const response = {
      ok: true as const,
      requestId,
    };
    
    updateIdempotencyResponse(idempotencyKey, response);
    
    logger.info(
      { 
        requestId, 
        emailsSent: { 
          customer: emailResults.customer, 
          internal: emailResults.internal 
        } 
      },
      'Appointment request processed successfully'
    );
    
    return res.status(200).json(response);
    
  } catch (error) {
    logger.error({ error }, 'Unexpected error processing appointment');
    return res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
      },
    });
  }
});

export default router;