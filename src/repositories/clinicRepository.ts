import { pool } from '../config/database';
import { Clinic, ClinicService } from '../models/clinic';

export const createClinic = async (clinic: Clinic, serviceIds: string[], customPrices?: { [serviceId: string]: number }): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const clinicInsert = `
            INSERT INTO clinics 
            (id, clinic_id, name, business_name, street_address, city, state, country, zip_code, latitude, longitude, date_created)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `;
        await client.query(clinicInsert, [
            clinic.id, clinic.clinicId, clinic.name, clinic.businessName, clinic.streetAddress, 
            clinic.city, clinic.state, clinic.country, clinic.zipCode, clinic.latitude, 
            clinic.longitude, clinic.dateCreated
        ]);

        // Convert service IDs (SRV001, etc.) to UUIDs for database storage
        for (const serviceId of serviceIds) {
            const serviceResult = await client.query(`SELECT id FROM services WHERE service_id = $1`, [serviceId]);
            if (serviceResult.rows.length > 0) {
                const serviceUuid = serviceResult.rows[0].id;
                const customPrice = customPrices?.[serviceId] || null;
                await client.query(
                    `INSERT INTO clinic_services (clinic_id, service_id, is_offered, custom_price)
                     VALUES ($1, $2, $3, $4)`,
                    [clinic.id, serviceUuid, true, customPrice]
                );
            }
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
        SELECT 
            c.id, c.clinic_id as "clinicId", c.name, c.business_name as "businessName",
            c.street_address as "streetAddress", c.city, c.state, c.country, 
            c.zip_code as "zipCode", c.latitude, c.longitude, c.date_created as "dateCreated",
            json_agg(
                CASE WHEN s.id IS NOT NULL THEN
                    json_build_object(
                        'serviceId', s.service_id,
                        'serviceName', s.name,
                        'serviceCode', s.code,
                        'serviceDescription', s.description,
                        'defaultPrice', s.average_price,
                        'customPrice', cs.custom_price,
                        'isOffered', cs.is_offered
                    )
                END
            ) FILTER (WHERE s.id IS NOT NULL) AS services
        FROM clinics c
        LEFT JOIN clinic_services cs ON c.id = cs.clinic_id
        LEFT JOIN services s ON cs.service_id = s.id
        GROUP BY c.id
        ORDER BY c.date_created DESC
    `);
    
    return result.rows.map(row => ({
        ...row,
        services: row.services || []
    }));
};

// New function: Get clinic by ID (clinic_id only)
export const getClinicById = async (id: string): Promise<Clinic | null> => {
    const result = await pool.query(`
        SELECT 
            c.id, c.clinic_id as "clinicId", c.name, c.business_name as "businessName",
            c.street_address as "streetAddress", c.city, c.state, c.country, 
            c.zip_code as "zipCode", c.latitude, c.longitude, c.date_created as "dateCreated",
            json_agg(
                CASE WHEN s.id IS NOT NULL THEN
                    json_build_object(
                        'serviceId', s.service_id,
                        'serviceName', s.name,
                        'serviceCode', s.code,
                        'serviceDescription', s.description,
                        'defaultPrice', s.average_price,
                        'customPrice', cs.custom_price,
                        'isOffered', cs.is_offered
                    )
                END
            ) FILTER (WHERE s.id IS NOT NULL) AS services
        FROM clinics c
        LEFT JOIN clinic_services cs ON c.id = cs.clinic_id
        LEFT JOIN services s ON cs.service_id = s.id
        WHERE c.clinic_id = $1
        GROUP BY c.id
    `, [id]);
    
    if (result.rows.length === 0) return null;
    
    return {
        ...result.rows[0],
        services: result.rows[0].services || []
    };
};

// New function: Get clinics by city
export const getClinicsByCity = async (city: string): Promise<Clinic[]> => {
    const result = await pool.query(`
        SELECT 
            c.id, c.clinic_id as "clinicId", c.name, c.business_name as "businessName",
            c.street_address as "streetAddress", c.city, c.state, c.country, 
            c.zip_code as "zipCode", c.latitude, c.longitude, c.date_created as "dateCreated",
            json_agg(
                CASE WHEN s.id IS NOT NULL THEN
                    json_build_object(
                        'serviceId', s.service_id,
                        'serviceName', s.name,
                        'serviceCode', s.code,
                        'serviceDescription', s.description,
                        'defaultPrice', s.average_price,
                        'customPrice', cs.custom_price,
                        'isOffered', cs.is_offered
                    )
                END
            ) FILTER (WHERE s.id IS NOT NULL) AS services
        FROM clinics c
        LEFT JOIN clinic_services cs ON c.id = cs.clinic_id
        LEFT JOIN services s ON cs.service_id = s.id
        WHERE LOWER(c.city) = LOWER($1)
        GROUP BY c.id
        ORDER BY c.date_created DESC
    `, [city]);
    
    return result.rows.map(row => ({
        ...row,
        services: row.services || []
    }));
};