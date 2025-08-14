import { env } from '../../env';

// Format Dutch phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle international format
  if (digits.startsWith('31')) {
    return `+${digits}`;
  }
  
  // Handle local format
  if (digits.startsWith('0')) {
    return `+31${digits.substring(1)}`;
  }
  
  // Assume it's already formatted correctly
  return phone;
};

// Count URLs in text
export const countUrls = (text: string): number => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/gi;
  const matches = text.match(urlRegex);
  return matches ? matches.length : 0;
};

// Sanitize HTML from text
export const sanitizeHtml = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/&(?!(amp|lt|gt|quot|#39);)/g, '&amp;');
};

// Truncate text to max length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Calculate spam score
export const calculateSpamScore = (data: {
  message: string;
  email: string;
  firstName?: string;
  lastName?: string;
}): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];
  
  // Check for excessive URLs
  const urlCount = countUrls(data.message);
  if (urlCount > env.MAX_URLS_IN_MESSAGE) {
    score += 30;
    reasons.push(`Too many URLs (${urlCount})`);
  } else if (urlCount > 2) {
    score += 10;
    reasons.push(`Multiple URLs (${urlCount})`);
  }
  
  // Check message length
  if (data.message.length < 20) {
    score += 20;
    reasons.push('Message too short');
  }
  if (data.message.length > env.MAX_MESSAGE_LENGTH) {
    score += 15;
    reasons.push('Message too long');
  }
  
  // Check for spam keywords
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'lottery', 'winner', 'congratulations',
    'click here', 'act now', 'limited time', 'risk free', 'guaranteed',
    'increase sales', 'online degree', 'work from home', 'make money',
    'bitcoin', 'crypto', 'investment opportunity', 'nigerian prince'
  ];
  
  const lowerMessage = data.message.toLowerCase();
  const foundKeywords = spamKeywords.filter(keyword => lowerMessage.includes(keyword));
  if (foundKeywords.length > 0) {
    score += foundKeywords.length * 15;
    reasons.push(`Spam keywords found: ${foundKeywords.join(', ')}`);
  }
  
  // Check for excessive capitalization
  const capsRatio = (data.message.match(/[A-Z]/g) || []).length / data.message.length;
  if (capsRatio > 0.5) {
    score += 20;
    reasons.push('Excessive capitalization');
  }
  
  // Check for repeated characters
  if (/(.)\1{4,}/.test(data.message)) {
    score += 15;
    reasons.push('Repeated characters');
  }
  
  // Check for suspicious email patterns
  if (data.email.includes('+') && data.email.split('+')[1].length > 10) {
    score += 10;
    reasons.push('Suspicious email alias');
  }
  
  // Check name fields for URLs or numbers
  const nameFields = [data.firstName, data.lastName].filter(Boolean).join(' ');
  if (nameFields && (countUrls(nameFields) > 0 || /\d{3,}/.test(nameFields))) {
    score += 25;
    reasons.push('Suspicious content in name fields');
  }
  
  return { score, reasons };
};

// Spam score threshold
export const SPAM_SCORE_THRESHOLD = 50;