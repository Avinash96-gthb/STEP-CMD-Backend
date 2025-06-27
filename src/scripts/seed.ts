import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export async function seedIfNeeded() {
  // Create tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinics (
      id UUID PRIMARY KEY,
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinic_services (
      clinic_id UUID REFERENCES clinics(id),
      service_id UUID NOT NULL,
      name VARCHAR NOT NULL,
      code VARCHAR NOT NULL,
      description VARCHAR,
      average_price FLOAT,
      is_active BOOLEAN,
      PRIMARY KEY (clinic_id, service_id)
    );
  `);

  // Only insert sample data if there are no clinics
  const { rows } = await pool.query('SELECT COUNT(*) FROM clinics');
  if (parseInt(rows[0].count, 10) === 0) {
    const clinicId = uuidv4();
    const serviceId = uuidv4();
    await pool.query(
      `INSERT INTO clinics (id, name, business_name, street_address, city, state, country, zip_code, latitude, longitude, date_created)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        clinicId,
        'Sample Clinic',
        'Sample Business',
        '123 Main St',
        'Sample City',
        'SC',
        'USA',
        '12345',
        40.0,
        -74.0,
        new Date()
      ]
    );
    await pool.query(
      `INSERT INTO clinic_services (clinic_id, service_id, name, code, description, average_price, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        clinicId,
        serviceId,
        'Consultation',
        'CONSULT',
        'General doctor consultation',
        50,
        true
      ]
    );
    console.log('Sample clinic and service inserted.');
  } else {
    console.log('Clinics already exist, skipping sample data.');
  }
}