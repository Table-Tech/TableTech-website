import { env } from '../../env';
import { logger } from '../logging/logger';

interface CaptchaVerifyResult {
  success: boolean;
  message?: string;
  score?: number;
}

// Abstract captcha verifier
abstract class CaptchaVerifier {
  abstract verify(token: string, ip?: string): Promise<CaptchaVerifyResult>;
}

// Cloudflare Turnstile implementation
class TurnstileVerifier extends CaptchaVerifier {
  private readonly verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  
  async verify(token: string, ip?: string): Promise<CaptchaVerifyResult> {
    try {
      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.CAPTCHA_SECRET,
          response: token,
          remoteip: ip,
        }),
      });
      
      const data = await response.json() as Record<string, unknown>;
      return {
        success: data.success === true,
        message: Array.isArray(data['error-codes']) ? (data['error-codes'] as string[]).join(', ') : undefined,
      };
    } catch (error) {
      logger.error({ error }, 'Turnstile verification failed');
      return { success: false, message: 'Verification service unavailable' };
    }
  }
}

// hCaptcha implementation
class HCaptchaVerifier extends CaptchaVerifier {
  private readonly verifyUrl = 'https://hcaptcha.com/siteverify';
  
  async verify(token: string, ip?: string): Promise<CaptchaVerifyResult> {
    try {
      const params = new URLSearchParams({
        secret: env.CAPTCHA_SECRET || '',
        response: token,
      });
      
      if (ip) params.append('remoteip', ip);
      
      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      
      const data = await response.json() as Record<string, unknown>;
      return {
        success: data.success === true,
        message: Array.isArray(data['error-codes']) ? (data['error-codes'] as string[]).join(', ') : undefined,
      };
    } catch (error) {
      logger.error({ error }, 'hCaptcha verification failed');
      return { success: false, message: 'Verification service unavailable' };
    }
  }
}

// reCAPTCHA v3 implementation
class RecaptchaVerifier extends CaptchaVerifier {
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  private readonly scoreThreshold = 0.5;
  
  async verify(token: string, ip?: string): Promise<CaptchaVerifyResult> {
    try {
      const params = new URLSearchParams({
        secret: env.CAPTCHA_SECRET || '',
        response: token,
      });
      
      if (ip) params.append('remoteip', ip);
      
      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      
      const data = await response.json() as Record<string, unknown>;
      // For reCAPTCHA v3, also check the score
      const success = data.success === true && (!data.score || (typeof data.score === 'number' && data.score >= this.scoreThreshold));
      return {
        success,
        message: Array.isArray(data['error-codes']) ? (data['error-codes'] as string[]).join(', ') : undefined,
        score: typeof data.score === 'number' ? data.score : undefined,
      };
    } catch (error) {
      logger.error({ error }, 'reCAPTCHA verification failed');
      return { success: false, message: 'Verification service unavailable' };
    }
  }
}

// Factory to get the right verifier
class CaptchaVerifierFactory {
  static create(): CaptchaVerifier | null {
    if (!env.ENABLE_CAPTCHA) return null;
    
    switch (env.CAPTCHA_PROVIDER) {
      case 'turnstile':
        return new TurnstileVerifier();
      case 'hcaptcha':
        return new HCaptchaVerifier();
      case 'recaptcha':
        return new RecaptchaVerifier();
      default:
        logger.warn(`Unknown captcha provider: ${env.CAPTCHA_PROVIDER}`);
        return null;
    }
  }
}

// Main verification function
export const verifyCaptcha = async (token: string | undefined, ip?: string): Promise<CaptchaVerifyResult> => {
  // If captcha is disabled, always return success
  if (!env.ENABLE_CAPTCHA) {
    return { success: true };
  }
  
  // If captcha is enabled but no token provided
  if (!token) {
    return { success: false, message: 'Captcha token required' };
  }
  
  const verifier = CaptchaVerifierFactory.create();
  if (!verifier) {
    logger.error('Captcha is enabled but no valid verifier configured');
    return { success: false, message: 'Captcha configuration error' };
  }
  
  return verifier.verify(token, ip);
};