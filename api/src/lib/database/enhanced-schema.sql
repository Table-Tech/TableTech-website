-- Enhanced TableTech Database Schema with Privacy-First Appointment System
-- This schema focuses on privacy by not storing personal data directly

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if needed (be careful in production!)
DROP TABLE IF EXISTS appointment_time_slots CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;

-- Appointments table (privacy-focused)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(12) UNIQUE NOT NULL, -- Format: TTMMDD-XXXX
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_end_time TIME NOT NULL, -- To block time range
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled, completed, no-show
    restaurant_name VARCHAR(255), -- Optional: which restaurant they're interested in
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Privacy: No personal data stored here
    CONSTRAINT unique_appointment_slot UNIQUE (appointment_date, appointment_time)
);

-- Time slots configuration (for available times)
CREATE TABLE appointment_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60, -- Standard appointment duration
    is_available BOOLEAN DEFAULT true,
    max_appointments_per_slot INTEGER DEFAULT 1, -- Usually 1 for demos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_time_slot UNIQUE (day_of_week, start_time)
);

-- Email logs for audit trail (no personal data)
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    email_type VARCHAR(100) NOT NULL, -- confirmation, reminder, cancellation
    email_hash VARCHAR(64), -- SHA256 hash of email for verification only
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'sent', -- sent, failed, bounced
    error_message TEXT
);

-- Blocked dates (holidays, vacations, etc.)
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_blocked_date UNIQUE (blocked_date)
);

-- Create indexes for performance
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_reference ON appointments(reference_number);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_time_slots_day ON appointment_time_slots(day_of_week);
CREATE INDEX idx_email_logs_appointment ON email_logs(appointment_id);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(blocked_date);

-- Function to generate unique reference number
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS VARCHAR AS $$
DECLARE
    ref_number VARCHAR;
    date_part VARCHAR;
    random_part VARCHAR;
    exists_check BOOLEAN;
BEGIN
    -- Format: TTMMDD-XXXX (TT for TableTech, MMDD for month/day, XXXX random)
    date_part := 'TT' || TO_CHAR(CURRENT_DATE, 'MMDD');
    
    LOOP
        -- Generate random 4-character alphanumeric string
        random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
        ref_number := date_part || '-' || random_part;
        
        -- Check if this reference already exists
        EXISTS_CHECK := EXISTS(SELECT 1 FROM appointments WHERE reference_number = ref_number);
        
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a time slot is available
CREATE OR REPLACE FUNCTION is_time_slot_available(
    check_date DATE,
    check_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    day_week INTEGER;
    is_blocked BOOLEAN;
    is_booked BOOLEAN;
    slot_exists BOOLEAN;
BEGIN
    -- Get day of week (0=Sunday, 6=Saturday)
    day_week := EXTRACT(DOW FROM check_date);
    
    -- Check if date is blocked
    is_blocked := EXISTS(
        SELECT 1 FROM blocked_dates 
        WHERE blocked_date = check_date
    );
    
    IF is_blocked THEN
        RETURN FALSE;
    END IF;
    
    -- Check if time slot exists for this day
    slot_exists := EXISTS(
        SELECT 1 FROM appointment_time_slots 
        WHERE day_of_week = day_week 
        AND start_time = check_time
        AND is_available = true
    );
    
    IF NOT slot_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Check if already booked
    is_booked := EXISTS(
        SELECT 1 FROM appointments 
        WHERE appointment_date = check_date 
        AND appointment_time = check_time
        AND status IN ('confirmed', 'pending')
    );
    
    RETURN NOT is_booked;
END;
$$ LANGUAGE plpgsql;

-- Function to get available time slots for a date
CREATE OR REPLACE FUNCTION get_available_slots(check_date DATE)
RETURNS TABLE(
    slot_time TIME,
    is_available BOOLEAN
) AS $$
DECLARE
    day_week INTEGER;
BEGIN
    day_week := EXTRACT(DOW FROM check_date);
    
    RETURN QUERY
    SELECT 
        ts.start_time as slot_time,
        NOT EXISTS(
            SELECT 1 FROM appointments a
            WHERE a.appointment_date = check_date
            AND a.appointment_time = ts.start_time
            AND a.status IN ('confirmed', 'pending')
        ) AND NOT EXISTS(
            SELECT 1 FROM blocked_dates bd
            WHERE bd.blocked_date = check_date
        ) as is_available
    FROM appointment_time_slots ts
    WHERE ts.day_of_week = day_week
    AND ts.is_available = true
    ORDER BY ts.start_time;
END;
$$ LANGUAGE plpgsql;

-- Insert default time slots (9 AM to 5 PM, Monday to Friday, hourly slots)
INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes)
VALUES 
    -- Monday (1)
    (1, '09:00', '10:00', 60),
    (1, '10:00', '11:00', 60),
    (1, '11:00', '12:00', 60),
    (1, '13:00', '14:00', 60),
    (1, '14:00', '15:00', 60),
    (1, '15:00', '16:00', 60),
    (1, '16:00', '17:00', 60),
    -- Tuesday (2)
    (2, '09:00', '10:00', 60),
    (2, '10:00', '11:00', 60),
    (2, '11:00', '12:00', 60),
    (2, '13:00', '14:00', 60),
    (2, '14:00', '15:00', 60),
    (2, '15:00', '16:00', 60),
    (2, '16:00', '17:00', 60),
    -- Wednesday (3)
    (3, '09:00', '10:00', 60),
    (3, '10:00', '11:00', 60),
    (3, '11:00', '12:00', 60),
    (3, '13:00', '14:00', 60),
    (3, '14:00', '15:00', 60),
    (3, '15:00', '16:00', 60),
    (3, '16:00', '17:00', 60),
    -- Thursday (4)
    (4, '09:00', '10:00', 60),
    (4, '10:00', '11:00', 60),
    (4, '11:00', '12:00', 60),
    (4, '13:00', '14:00', 60),
    (4, '14:00', '15:00', 60),
    (4, '15:00', '16:00', 60),
    (4, '16:00', '17:00', 60),
    -- Friday (5)
    (5, '09:00', '10:00', 60),
    (5, '10:00', '11:00', 60),
    (5, '11:00', '12:00', 60),
    (5, '13:00', '14:00', 60),
    (5, '14:00', '15:00', 60),
    (5, '15:00', '16:00', 60),
    (5, '16:00', '17:00', 60)
ON CONFLICT (day_of_week, start_time) DO NOTHING;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();