-- TableTech Appointment System Database Setup
-- Run this SQL in your Neon PostgreSQL database

-- 1. Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS availability_config CASCADE;
DROP TABLE IF EXISTS blocked_dates CASCADE;

-- 2. Create appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(100),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(appointment_date, appointment_time)
);

-- 3. Create availability configuration table
CREATE TABLE availability_config (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(day_of_week)
);

-- 4. Create blocked dates table
CREATE TABLE blocked_dates (
  id SERIAL PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255),
  UNIQUE(blocked_date)
);

-- 5. Insert default availability (Monday to Friday, 9:00-17:00)
INSERT INTO availability_config (day_of_week, start_time, end_time, slot_duration, is_active) VALUES
(1, '09:00:00', '17:00:00', 30, true), -- Monday
(2, '09:00:00', '17:00:00', 30, true), -- Tuesday
(3, '09:00:00', '17:00:00', 30, true), -- Wednesday
(4, '09:00:00', '17:00:00', 30, true), -- Thursday
(5, '09:00:00', '17:00:00', 30, true); -- Friday
-- Weekend is not included, so no appointments on Saturday (6) and Sunday (0)

-- 6. Insert some example blocked dates (optional)
-- INSERT INTO blocked_dates (blocked_date, reason) VALUES
-- ('2025-01-01', 'Nieuwjaarsdag'),
-- ('2025-04-21', 'Tweede Paasdag'),
-- ('2025-04-27', 'Koningsdag'),
-- ('2025-05-05', 'Bevrijdingsdag'),
-- ('2025-12-25', 'Eerste Kerstdag'),
-- ('2025-12-26', 'Tweede Kerstdag');

-- 7. Create indexes for performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_email ON appointments(customer_email);
CREATE INDEX idx_availability_day ON availability_config(day_of_week);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(blocked_date);

-- 8. Create a view for easy appointment overview
CREATE OR REPLACE VIEW appointment_overview AS
SELECT
  a.id,
  a.customer_name,
  a.customer_email,
  a.customer_phone,
  a.appointment_date,
  a.appointment_time,
  a.service_type,
  a.status,
  a.created_at,
  EXTRACT(DOW FROM a.appointment_date) as day_of_week,
  TO_CHAR(a.appointment_date, 'Day') as day_name
FROM appointments a
WHERE a.status != 'cancelled'
ORDER BY a.appointment_date, a.appointment_time;

-- 9. Grant permissions (adjust based on your user setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Verification queries
SELECT 'Appointments table created' as status, COUNT(*) as count FROM appointments;
SELECT 'Availability config created' as status, COUNT(*) as count FROM availability_config;
SELECT 'Blocked dates table created' as status, COUNT(*) as count FROM blocked_dates;