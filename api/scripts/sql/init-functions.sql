-- Database Functions for TableTech Appointment System

-- Function to generate unique reference number
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS VARCHAR AS $$
DECLARE
    ref_number VARCHAR;
    date_part VARCHAR;
    random_part VARCHAR;
    exists_check BOOLEAN;
BEGIN
    date_part := 'TT' || TO_CHAR(CURRENT_DATE, 'MMDD');
    
    LOOP
        random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
        ref_number := date_part || '-' || random_part;
        
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
    day_week := EXTRACT(DOW FROM check_date);
    
    is_blocked := EXISTS(
        SELECT 1 FROM blocked_dates 
        WHERE blocked_date = check_date
    );
    
    IF is_blocked THEN
        RETURN FALSE;
    END IF;
    
    slot_exists := EXISTS(
        SELECT 1 FROM appointment_time_slots 
        WHERE day_of_week = day_week 
        AND start_time = check_time
        AND is_available = true
    );
    
    IF NOT slot_exists THEN
        RETURN FALSE;
    END IF;
    
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

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to appointments table
CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();