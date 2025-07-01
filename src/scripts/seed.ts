import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export async function seedIfNeeded() {
  // Create clinics table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinics (
      id UUID PRIMARY KEY,
      clinic_id VARCHAR UNIQUE NOT NULL,
      name VARCHAR NOT NULL,
      business_name VARCHAR NOT NULL,
      street_address VARCHAR NOT NULL,
      city VARCHAR NOT NULL,
      state VARCHAR NOT NULL,
      country VARCHAR NOT NULL,
      zip_code VARCHAR NOT NULL,
      latitude FLOAT,
      longitude FLOAT,
      date_created TIMESTAMP NOT NULL
    );
  `);

  // Create master services table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY,
      service_id VARCHAR UNIQUE NOT NULL,
      name VARCHAR NOT NULL,
      code VARCHAR NOT NULL,
      description VARCHAR,
      average_price FLOAT,
      is_active BOOLEAN DEFAULT true
    );
  `);

  // Create clinic-services junction table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinic_services (
      clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
      service_id UUID REFERENCES services(id) ON DELETE CASCADE,
      is_offered BOOLEAN DEFAULT true,
      custom_price FLOAT,
      PRIMARY KEY (clinic_id, service_id)
    );
  `);

  await seedMasterServices();
  await seedSampleClinic();
}

async function seedMasterServices() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM services');
  if (parseInt(rows[0].count, 10) === 0) {
    const services = [
      { id: uuidv4(), serviceId: 'SRV001', name: 'Consultation', code: 'CONSULT', description: 'General doctor consultation', averagePrice: 50 },
      { id: uuidv4(), serviceId: 'SRV002', name: 'X-ray', code: 'XRAY', description: 'X-ray imaging service', averagePrice: 100 },
      { id: uuidv4(), serviceId: 'SRV003', name: 'Blood Test', code: 'BLOOD', description: 'Blood testing service', averagePrice: 75 },
      { id: uuidv4(), serviceId: 'SRV004', name: 'Covid Test', code: 'COVID', description: 'COVID-19 testing', averagePrice: 30 },
      { id: uuidv4(), serviceId: 'SRV005', name: 'MRI Scan', code: 'MRI', description: 'MRI scanning service', averagePrice: 500 }
    ];

    for (const service of services) {
      await pool.query(
        `INSERT INTO services (id, service_id, name, code, description, average_price, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [service.id, service.serviceId, service.name, service.code, service.description, service.averagePrice, true]
      );
    }
    console.log('Master services seeded.');
  }
}

async function seedSampleClinic() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM clinics');
  if (parseInt(rows[0].count, 10) === 0) {
    const clinicUuid = uuidv4();
    const clinicId = `CL${new Date().getFullYear()}${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`;
    
    await pool.query(
      `INSERT INTO clinics (id, clinic_id, name, business_name, street_address, city, state, country, zip_code, latitude, longitude, date_created)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [clinicUuid, clinicId, 'Sample Clinic', 'Sample Business', '123 Main St', 'Sample City', 'SC', 'USA', '12345', 40.0, -74.0, new Date()]
    );

    const consultationService = await pool.query(`SELECT id FROM services WHERE code = 'CONSULT'`);
    const bloodTestService = await pool.query(`SELECT id FROM services WHERE code = 'BLOOD'`);
    
    if (consultationService.rows.length > 0) {
      await pool.query(
        `INSERT INTO clinic_services (clinic_id, service_id, is_offered, custom_price)
         VALUES ($1, $2, $3, $4)`,
        [clinicUuid, consultationService.rows[0].id, true, 60]
      );
    }

    if (bloodTestService.rows.length > 0) {
      await pool.query(
        `INSERT INTO clinic_services (clinic_id, service_id, is_offered, custom_price)
         VALUES ($1, $2, $3, $4)`,
        [clinicUuid, bloodTestService.rows[0].id, true, null]
      );
    }

    console.log('Sample clinic and services linked.');
  }
}