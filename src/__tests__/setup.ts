import { pool } from '../config/database';

beforeAll(async () => {
  try {
    // Test connection to the Docker database
    await pool.query('SELECT 1');
    console.log('✅ Tests connected to database (localhost:5432)');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Make sure Docker is running: docker-compose up -d');
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    // Clean up test data (be careful with these patterns)
    await pool.query(`DELETE FROM clinic_services WHERE clinic_id IN (
      SELECT id FROM clinics WHERE 
        name LIKE '%Test%' OR 
        name LIKE '%Performance%' OR 
        name LIKE '%Invalid%' OR 
        name LIKE '%Duplicate%' OR 
        name LIKE '%Consistency%' OR
        name LIKE '%Special Chars%' OR
        name LIKE '%Long%' OR
        name LIKE '%Custom Price%'
    )`);
    
    // src/__tests__/setup.ts
await pool.query(`DELETE FROM clinics WHERE 
  name LIKE '%Test%' OR 
  name LIKE '%Performance%' OR 
  name LIKE '%Invalid%' OR 
  name LIKE '%Duplicate%' OR 
  name LIKE '%Consistency%' OR
  name LIKE '%Special Chars%' OR
  name LIKE '%Long%' OR
  name LIKE '%Custom Price%' OR
  LENGTH(name) > 100  -- Add this to catch long names
`);
    console.log('🧹 Test data cleaned up');
  } catch (error) {
    console.error('⚠️  Error cleaning up test data:', error);
  } finally {
    await pool.end();
  }
});

jest.setTimeout(30000);