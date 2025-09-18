-- =====================================================
-- FIX: VOEG AVAILABILITY DATA TOE AAN DATABASE
-- Run dit in Neon SQL Editor (MAIN branch!)
-- =====================================================

-- Stap 1: Verwijder oude availability config (als die bestaat)
DELETE FROM availability_config;

-- Stap 2: Voeg werkdagen toe met tijdslots
-- Dagen: 0=Zondag, 1=Maandag, 2=Dinsdag, 3=Woensdag, 4=Donderdag, 5=Vrijdag, 6=Zaterdag
INSERT INTO availability_config (day_of_week, start_time, end_time, slot_duration, is_active) VALUES
-- Maandag: 9:00 - 18:00, slots van 30 minuten
(1, '09:00:00', '18:00:00', 30, true),
-- Dinsdag: 9:00 - 18:00
(2, '09:00:00', '18:00:00', 30, true),
-- Woensdag: 9:00 - 18:00
(3, '09:00:00', '18:00:00', 30, true),
-- Donderdag: 9:00 - 20:00 (langere dag)
(4, '09:00:00', '20:00:00', 30, true),
-- Vrijdag: 9:00 - 17:00
(5, '09:00:00', '17:00:00', 30, true),
-- Zaterdag: 10:00 - 16:00 (kortere dag)
(6, '10:00:00', '16:00:00', 30, true);
-- Zondag: GEEN (niet in de lijst = gesloten)

-- Stap 3: Voeg een paar geblokkeerde dagen toe (optioneel)
-- Bijvoorbeeld nationale feestdagen
INSERT INTO blocked_dates (blocked_date, reason) VALUES
('2024-12-25', 'Eerste Kerstdag'),
('2024-12-26', 'Tweede Kerstdag'),
('2024-12-31', 'Oudejaarsdag'),
('2025-01-01', 'Nieuwjaarsdag'),
('2025-04-21', 'Tweede Paasdag'),
('2025-04-27', 'Koningsdag'),
('2025-05-05', 'Bevrijdingsdag')
ON CONFLICT (blocked_date) DO NOTHING; -- Skip als al bestaat

-- Stap 4: Voeg TEST appointments toe om te zien dat boekingen werken
-- Deze worden automatisch geblokkeerd voor nieuwe boekingen
INSERT INTO appointments (
  customer_name,
  customer_email,
  customer_phone,
  appointment_date,
  appointment_time,
  service_type,
  notes,
  status
) VALUES
-- Vandaag om 14:00 (wordt geblokkeerd)
(
  'Test Klant 1',
  'test1@example.com',
  '0612345678',
  CURRENT_DATE,
  '14:00:00',
  'Consultatie',
  'Test appointment - kan niet dubbel geboekt worden',
  'confirmed'
),
-- Morgen om 10:00 (wordt geblokkeerd)
(
  'Test Klant 2',
  'test2@example.com',
  '0687654321',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00:00',
  'Demo',
  'Test appointment 2',
  'confirmed'
),
-- Overmorgen om 15:30 (wordt geblokkeerd)
(
  'Test Klant 3',
  'test3@example.com',
  '0611111111',
  CURRENT_DATE + INTERVAL '2 days',
  '15:30:00',
  'Training',
  'Test appointment 3',
  'confirmed'
)
ON CONFLICT (appointment_date, appointment_time) DO NOTHING; -- Skip als tijdslot al bezet

-- Stap 5: Verifieer dat alles werkt
SELECT
  '✅ AVAILABILITY CONFIG' as check_type,
  COUNT(*) as count,
  STRING_AGG(
    CASE day_of_week
      WHEN 1 THEN 'Ma'
      WHEN 2 THEN 'Di'
      WHEN 3 THEN 'Wo'
      WHEN 4 THEN 'Do'
      WHEN 5 THEN 'Vr'
      WHEN 6 THEN 'Za'
      WHEN 0 THEN 'Zo'
    END || ' ' ||
    start_time::text || '-' ||
    end_time::text, ', '
  ) as schedule
FROM availability_config
WHERE is_active = true

UNION ALL

SELECT
  '✅ BLOCKED DATES' as check_type,
  COUNT(*) as count,
  STRING_AGG(blocked_date::text || ' (' || COALESCE(reason, 'No reason') || ')', ', ') as schedule
FROM blocked_dates
WHERE blocked_date >= CURRENT_DATE

UNION ALL

SELECT
  '✅ BOOKED APPOINTMENTS' as check_type,
  COUNT(*) as count,
  STRING_AGG(appointment_date::text || ' ' || appointment_time::text, ', ') as schedule
FROM appointments
WHERE status = 'confirmed'
AND appointment_date >= CURRENT_DATE;

-- =====================================================
-- RESULTAAT:
-- Je ziet nu:
-- ✅ 6 werkdagen met tijden (Ma-Za)
-- ✅ 7 geblokkeerde feestdagen
-- ✅ 3 test appointments (deze tijdslots zijn bezet)
--
-- De website toont nu:
-- - Alle beschikbare tijdslots
-- - Bezette slots zijn NIET selecteerbaar
-- - Feestdagen hebben GEEN slots
-- =====================================================