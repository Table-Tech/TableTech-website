const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Wish_pgadmin@localhost:5432/appointment_system'
});

async function migrate() {
  try {
    console.log('🔄 Running database migration...');

    const sqlFile = path.join(__dirname, 'src/scripts/create-tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    await pool.query(sql);

    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();