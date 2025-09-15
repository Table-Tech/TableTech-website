-- Cleaned TableTech Database Schema - Only Appointments and Blocked Dates
-- Run this script directly in PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop unnecessary tables
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS appointment_time_slots CASCADE;
DROP TABLE IF EXISTS appointment_emails CASCADE;

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    restaurant_name VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_end_time TIME,
    duration_minutes INTEGER DEFAULT 30,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create blocked_dates table
CREATE TABLE IF NOT EXISTS blocked_dates (
    id SERIAL PRIMARY KEY,
    blocked_date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_deleted ON appointments(deleted_at);
CREATE INDEX IF NOT EXISTS idx_appointments_reference ON appointments(reference_number);

-- Function to check if a date is blocked
CREATE OR REPLACE FUNCTION is_date_blocked(check_date DATE)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM blocked_dates bd
        WHERE bd.blocked_date = check_date
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if appointment slot is available
CREATE OR REPLACE FUNCTION is_slot_available(check_date DATE, check_time TIME)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if date is blocked
    IF is_date_blocked(check_date) THEN
        RETURN FALSE;
    END IF;

    -- Check if slot is already taken
    RETURN NOT EXISTS(
        SELECT 1 FROM appointments
        WHERE appointment_date = check_date
        AND appointment_time = check_time
        AND status IN ('pending', 'confirmed')
        AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

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
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();