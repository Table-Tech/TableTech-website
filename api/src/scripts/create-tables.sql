-- Create appointments table if not exists
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

-- Create email_logs table if not exists
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    email_type VARCHAR(50),
    recipient VARCHAR(255),
    status VARCHAR(50),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment_time_slots table if not exists
CREATE TABLE IF NOT EXISTS appointment_time_slots (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day_of_week, start_time)
);

-- Create blocked_dates table if not exists
CREATE TABLE IF NOT EXISTS blocked_dates (
    id SERIAL PRIMARY KEY,
    blocked_date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default time slots for weekdays
INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, is_available)
VALUES
    (1, '09:00', '09:30', true),
    (1, '09:30', '10:00', true),
    (1, '10:00', '10:30', true),
    (1, '10:30', '11:00', true),
    (1, '11:00', '11:30', true),
    (1, '11:30', '12:00', true),
    (1, '13:00', '13:30', true),
    (1, '13:30', '14:00', true),
    (1, '14:00', '14:30', true),
    (1, '14:30', '15:00', true),
    (1, '15:00', '15:30', true),
    (1, '15:30', '16:00', true),
    (1, '16:00', '16:30', true),
    (1, '16:30', '17:00', true),
    (2, '09:00', '09:30', true),
    (2, '09:30', '10:00', true),
    (2, '10:00', '10:30', true),
    (2, '10:30', '11:00', true),
    (2, '11:00', '11:30', true),
    (2, '11:30', '12:00', true),
    (2, '13:00', '13:30', true),
    (2, '13:30', '14:00', true),
    (2, '14:00', '14:30', true),
    (2, '14:30', '15:00', true),
    (2, '15:00', '15:30', true),
    (2, '15:30', '16:00', true),
    (2, '16:00', '16:30', true),
    (2, '16:30', '17:00', true),
    (3, '09:00', '09:30', true),
    (3, '09:30', '10:00', true),
    (3, '10:00', '10:30', true),
    (3, '10:30', '11:00', true),
    (3, '11:00', '11:30', true),
    (3, '11:30', '12:00', true),
    (3, '13:00', '13:30', true),
    (3, '13:30', '14:00', true),
    (3, '14:00', '14:30', true),
    (3, '14:30', '15:00', true),
    (3, '15:00', '15:30', true),
    (3, '15:30', '16:00', true),
    (3, '16:00', '16:30', true),
    (3, '16:30', '17:00', true),
    (4, '09:00', '09:30', true),
    (4, '09:30', '10:00', true),
    (4, '10:00', '10:30', true),
    (4, '10:30', '11:00', true),
    (4, '11:00', '11:30', true),
    (4, '11:30', '12:00', true),
    (4, '13:00', '13:30', true),
    (4, '13:30', '14:00', true),
    (4, '14:00', '14:30', true),
    (4, '14:30', '15:00', true),
    (4, '15:00', '15:30', true),
    (4, '15:30', '16:00', true),
    (4, '16:00', '16:30', true),
    (4, '16:30', '17:00', true),
    (5, '09:00', '09:30', true),
    (5, '09:30', '10:00', true),
    (5, '10:00', '10:30', true),
    (5, '10:30', '11:00', true),
    (5, '11:00', '11:30', true),
    (5, '11:30', '12:00', true),
    (5, '13:00', '13:30', true),
    (5, '13:30', '14:00', true),
    (5, '14:00', '14:30', true),
    (5, '14:30', '15:00', true),
    (5, '15:00', '15:30', true),
    (5, '15:30', '16:00', true),
    (5, '16:00', '16:30', true),
    (5, '16:30', '17:00', true)
ON CONFLICT (day_of_week, start_time) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_deleted ON appointments(deleted_at);

-- Create function to get available slots
CREATE OR REPLACE FUNCTION get_available_slots(check_date DATE)
RETURNS TABLE(slot_time TIME, is_available BOOLEAN) AS $$
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