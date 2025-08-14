-- Enhanced TableTech Database Schema with Privacy-First Appointment System
-- Run this script directly in PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if needed (be careful in production!)
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS appointment_time_slots CASCADE;
DROP TABLE IF EXISTS blocked_dates CASCADE;

-- Appointments table (privacy-focused)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(12) UNIQUE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    restaurant_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_appointment_slot UNIQUE (appointment_date, appointment_time)
);

-- Time slots configuration
CREATE TABLE appointment_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    is_available BOOLEAN DEFAULT true,
    max_appointments_per_slot INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_time_slot UNIQUE (day_of_week, start_time)
);

-- Email logs
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    email_type VARCHAR(100) NOT NULL,
    email_hash VARCHAR(64),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'sent',
    error_message TEXT
);

-- Blocked dates
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_blocked_date UNIQUE (blocked_date)
);

-- Create indexes
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_reference ON appointments(reference_number);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_time_slots_day ON appointment_time_slots(day_of_week);
CREATE INDEX idx_email_logs_appointment ON email_logs(appointment_id);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(blocked_date);

-- Insert default time slots (Monday to Friday, 9 AM to 5 PM)
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