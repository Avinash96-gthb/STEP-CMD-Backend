import { pool } from '../config/database';
import { Clinic } from '../models/clinic';

export const createClinic = async (clinic: Clinic): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const clinicInsert = `
            INSERT INTO clinics 
            (id, name, business_name, street_address, city, state, country, zip_code, latitude, longitude, date_created)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        `;
        await client.query(clinicInsert, [
            clinic.id, clinic.name, clinic.businessName, clinic.streetAddress, clinic.city,
            clinic.state, clinic.country, clinic.zipCode, clinic.latitude, clinic.longitude, clinic.dateCreated
        ]);
        for (const service of clinic.services) {
            await client.query(
                `INSERT INTO clinic_services 
                (clinic_id, service_id, name, code, description, average_price, is_active)
                VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                [clinic.id, service.id, service.name, service.code, service.description, service.averagePrice, service.isActive]
            );
        }
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const getAllClinics = async (): Promise<Clinic[]> => {
    const result = await pool.query(`
        SELECT c.*, 
               json_agg(json_build_object(
                   'id', cs.service_id,
                   'name', cs.name,
                   'code', cs.code,
                   'description', cs.description,
                   'averagePrice', cs.average_price,
                   'isActive', cs.is_active
               )) AS services
        FROM clinics c
        LEFT JOIN clinic_services cs ON c.id = cs.clinic_id
        GROUP BY c.id
        ORDER BY c.date_created DESC
    `);
    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        businessName: row.business_name,
        streetAddress: row.street_address,
        city: row.city,
        state: row.state,
        country: row.country,
        zipCode: row.zip_code,
        latitude: row.latitude,
        longitude: row.longitude,
        dateCreated: row.date_created,
        services: Array.isArray(row.services) && row.services[0] !== null ? row.services : []
    }));
};
