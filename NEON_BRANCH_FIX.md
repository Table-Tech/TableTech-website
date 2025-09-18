# 🔥 NEON DATABASE BRANCH PROBLEEM - OPLOSSING

## HET PROBLEEM
Je tabellen bestaan in **development** branch maar NIET in **production (main)** branch!

Neon werkt met branches zoals Git:
- **main branch** = Production database (LEEG)
- **dev branch** = Development database (HEEFT TABELLEN)

## CHECK WELKE BRANCH JE GEBRUIKT

### In Neon Dashboard:
1. Ga naar https://console.neon.tech
2. Kijk bovenaan - daar staat de huidige branch (main/dev)
3. Check je connection string - bevat het `/main/` of `/dev/`?

### Je Connection String Structuur:
```
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
                                                           ↑
                                          Dit bepaalt de branch!
```

## OPLOSSING 1: Maak Tabellen in Production (BESTE OPTIE)

### Stappen:
1. **Open Neon Dashboard**
2. **Switch naar "main" branch** (dropdown bovenaan)
3. **Ga naar SQL Editor**
4. **Copy & Paste dit script:**

```sql
-- TableTech Appointment System Database Setup
-- Run this in MAIN/PRODUCTION branch

-- 1. Drop existing tables if they exist
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

-- 6. Create indexes for performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_email ON appointments(customer_email);

-- 7. Verify
SELECT 'Setup complete!' as status;
```

5. **Run de query**
6. **Je ziet "Setup complete!"**

## OPLOSSING 2: Gebruik Development Branch (Tijdelijk)

### Als je snel wilt testen:
1. **In Neon Dashboard**
2. **Switch naar "dev" branch**
3. **Ga naar "Connection Details"**
4. **Copy de POOLED connection string van DEV**
5. **In Vercel:**
   - Update DATABASE_URL_new met dev connection string
   - Save & Redeploy

## HOE CHECK JE WELKE BRANCH ACTIEF IS?

### Via SQL in Neon:
```sql
SELECT current_database(), version();
```

### Via je API:
Ga naar: `https://table-tech-website.vercel.app/api/debug`

Check de connection string preview - zie je `/main/` of `/dev/`?

## BELANGRIJKE TIPS

### Voor Production:
- Gebruik ALTIJD **main branch** voor live website
- Development branch is voor testen

### Connection String per Branch:
- **Main (Production):** `postgresql://user:pass@ep-xxx-pooler.aws.neon.tech/neondb`
- **Dev:** Kan anders zijn, check in Neon dashboard

### Test Commando voor Elke Branch:
```sql
-- Run dit in SQL editor om te checken welke tabellen bestaan
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

## CHECKLIST

- [ ] Neon Dashboard geopend
- [ ] Naar MAIN branch geswitched
- [ ] SQL Editor geopend
- [ ] Database setup script gerun
- [ ] "Setup complete!" gezien
- [ ] Connection string van MAIN branch gekopieerd
- [ ] Vercel environment variables geüpdatet
- [ ] Website werkt met echte data

## NOG STEEDS PROBLEMEN?

1. **Check branch naam in connection string**
2. **Verifieer dat tabellen bestaan met:**
   ```sql
   SELECT COUNT(*) FROM availability_config;
   ```
3. **Check Neon status** - is database actief (niet suspended)?

---

**Dit lost het branch probleem DIRECT op!**