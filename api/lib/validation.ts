import { format, parse, isValid, isBefore, isAfter, addDays } from 'date-fns';

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppointmentInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_type?: string;
  notes?: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleaned.length >= 10 && cleaned.length <= 15;
}

export function validateDate(dateStr: string): boolean {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());

  if (!isValid(date)) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = addDays(today, 90);

  return !isBefore(date, today) && !isAfter(date, maxDate);
}

export function validateTime(timeStr: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(timeStr)) {
    return false;
  }

  const [hours, minutes] = timeStr.split(':').map(Number);

  if (hours < 8 || hours >= 20) {
    return false;
  }

  if (minutes % 15 !== 0) {
    return false;
  }

  return true;
}

export function validateAppointmentInput(input: AppointmentInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.customer_name || input.customer_name.trim().length < 2) {
    errors.push({
      field: 'customer_name',
      message: 'Naam moet minimaal 2 karakters bevatten'
    });
  }

  if (input.customer_name && input.customer_name.length > 255) {
    errors.push({
      field: 'customer_name',
      message: 'Naam mag maximaal 255 karakters bevatten'
    });
  }

  if (!input.customer_email || !validateEmail(input.customer_email)) {
    errors.push({
      field: 'customer_email',
      message: 'Voer een geldig email adres in'
    });
  }

  if (!input.customer_phone || !validatePhone(input.customer_phone)) {
    errors.push({
      field: 'customer_phone',
      message: 'Voer een geldig telefoonnummer in'
    });
  }

  if (!input.appointment_date || !validateDate(input.appointment_date)) {
    errors.push({
      field: 'appointment_date',
      message: 'Selecteer een geldige datum (vandaag tot 90 dagen vooruit)'
    });
  }

  if (!input.appointment_time || !validateTime(input.appointment_time)) {
    errors.push({
      field: 'appointment_time',
      message: 'Selecteer een geldige tijd tussen 08:00 en 20:00'
    });
  }

  if (input.service_type && input.service_type.length > 100) {
    errors.push({
      field: 'service_type',
      message: 'Service type mag maximaal 100 karakters bevatten'
    });
  }

  if (input.notes && input.notes.length > 1000) {
    errors.push({
      field: 'notes',
      message: 'Opmerkingen mogen maximaal 1000 karakters bevatten'
    });
  }

  return errors;
}

export function sanitizeInput(input: any): AppointmentInput {
  return {
    customer_name: (input.customer_name || '').trim(),
    customer_email: (input.customer_email || '').trim().toLowerCase(),
    customer_phone: (input.customer_phone || '').trim(),
    appointment_date: (input.appointment_date || '').trim(),
    appointment_time: (input.appointment_time || '').trim(),
    service_type: input.service_type ? input.service_type.trim() : undefined,
    notes: input.notes ? input.notes.trim() : undefined
  };
}