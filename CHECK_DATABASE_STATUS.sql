-- =====================================================
-- CHECK WAT ER IN DE DATABASE ZIT
-- Run dit om te zien wat er ontbreekt
-- =====================================================

-- Check 1: Zijn er availability configs?
SELECT
  'AVAILABILITY CONFIG STATUS' as check_name,
  CASE
    WHEN COUNT(*) = 0 THEN '❌ LEEG - Geen werkdagen geconfigureerd!'
    ELSE '✅ ' || COUNT(*) || ' werkdagen geconfigureerd'
  END as status,
  COUNT(*) as aantal
FROM availability_config
WHERE is_active = true;

-- Check 2: Welke dagen zijn geconfigureerd?
SELECT
  'WERKDAGEN' as info,
  day_of_week,
  CASE day_of_week
    WHEN 0 THEN 'Zondag'
    WHEN 1 THEN 'Maandag'
    WHEN 2 THEN 'Dinsdag'
    WHEN 3 THEN 'Woensdag'
    WHEN 4 THEN 'Donderdag'
    WHEN 5 THEN 'Vrijdag'
    WHEN 6 THEN 'Zaterdag'
  END as dag_naam,
  start_time as open_tijd,
  end_time as sluit_tijd,
  slot_duration as slot_minuten,
  is_active as actief
FROM availability_config
ORDER BY day_of_week;

-- Check 3: Zijn er geblokkeerde dagen?
SELECT
  'GEBLOKKEERDE DAGEN' as info,
  COUNT(*) as aantal,
  CASE
    WHEN COUNT(*) = 0 THEN 'Geen feestdagen/blokkades'
    ELSE STRING_AGG(blocked_date::text || ' (' || COALESCE(reason, '-') || ')', ', ')
  END as dagen
FROM blocked_dates
WHERE blocked_date >= CURRENT_DATE;

-- Check 4: Hoeveel afspraken zijn er?
SELECT
  'GEBOEKTE AFSPRAKEN' as info,
  COUNT(*) as totaal,
  COUNT(CASE WHEN appointment_date >= CURRENT_DATE THEN 1 END) as toekomstig,
  COUNT(CASE WHEN appointment_date < CURRENT_DATE THEN 1 END) as verleden
FROM appointments
WHERE status = 'confirmed';

-- Check 5: Eerste 10 toekomstige afspraken
SELECT
  'UPCOMING' as type,
  appointment_date as datum,
  appointment_time as tijd,
  customer_name as klant,
  service_type as service
FROM appointments
WHERE appointment_date >= CURRENT_DATE
AND status = 'confirmed'
ORDER BY appointment_date, appointment_time
LIMIT 10;

-- =====================================================
-- ALS JE ZIET:
-- ❌ "LEEG - Geen werkdagen geconfigureerd!"
-- DAN: Run FIX_AVAILABILITY_DATA.sql
-- =====================================================