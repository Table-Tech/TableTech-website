// Test database connection
import dotenv from 'dotenv';
import pg from 'pg';
const { Client } = pg;

dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Environment check:');
  console.log('  DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('  DATABASE_URL_new exists:', !!process.env.DATABASE_URL_new);
  console.log('  DIRECT_DATABASE_URL exists:', !!process.env.DIRECT_DATABASE_URL);

  // Try different connection strings
  const connectionStrings = [
    { name: 'DATABASE_URL_new', url: process.env.DATABASE_URL_new },
    { name: 'DATABASE_URL', url: process.env.DATABASE_URL },
    { name: 'DIRECT_DATABASE_URL', url: process.env.DIRECT_DATABASE_URL }
  ];

  for (const config of connectionStrings) {
    if (!config.url) {
      console.log(`\n❌ ${config.name} not found in environment`);
      continue;
    }

    console.log(`\n📡 Testing ${config.name}...`);

    const client = new Client({
      connectionString: config.url,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log(`  ✅ Connected successfully`);

      // Test query
      const result = await client.query('SELECT NOW() as current_time');
      console.log(`  ✅ Query works, server time:`, result.rows[0].current_time);

      // Check tables
      const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      console.log(`  📊 Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`     - ${row.table_name}`);
      });

      // Check availability_config specifically
      try {
        const availResult = await client.query('SELECT COUNT(*) as count FROM availability_config');
        console.log(`  ✅ availability_config table exists with ${availResult.rows[0].count} rows`);
      } catch (err) {
        console.log(`  ❌ availability_config table error:`, err.message);
      }

      // Check appointments table
      try {
        const appResult = await client.query('SELECT COUNT(*) as count FROM appointments');
        console.log(`  ✅ appointments table exists with ${appResult.rows[0].count} rows`);
      } catch (err) {
        console.log(`  ❌ appointments table error:`, err.message);
      }

      await client.end();
      console.log(`  ✅ ${config.name} works perfectly!\n`);

    } catch (error) {
      console.log(`  ❌ Connection failed:`, error.message);
      if (error.message.includes('password')) {
        console.log(`     💡 Hint: Check your password in the connection string`);
      }
      if (error.message.includes('ECONNREFUSED')) {
        console.log(`     💡 Hint: Database might be sleeping or URL incorrect`);
      }
    }
  }

  console.log('\n📝 Summary:');
  console.log('If all tests failed, please:');
  console.log('1. Check your .env.local file has the correct database URLs');
  console.log('2. Ensure database is created in Neon');
  console.log('3. Run database-setup.sql in Neon SQL editor');
  console.log('4. Copy the connection strings from Neon dashboard');
}

testConnection().catch(console.error);