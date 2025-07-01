import { pool } from '../config/database';
import { Service } from '../models/clinic';

export const getAllServices = async (): Promise<Service[]> => {
    const result = await pool.query(`
        SELECT id, service_id as "serviceId", name, code, description, average_price as "averagePrice", is_active as "isActive"
        FROM services 
        WHERE is_active = true
        ORDER BY name
    `);
    return result.rows;
};

export const getServicesByIds = async (serviceIds: string[]): Promise<Service[]> => {
    if (serviceIds.length === 0) return [];
    
    const placeholders = serviceIds.map((_, index) => `$${index + 1}`).join(',');
    const result = await pool.query(`
        SELECT id, service_id as "serviceId", name, code, description, average_price as "averagePrice", is_active as "isActive"
        FROM services 
        WHERE service_id IN (${placeholders}) AND is_active = true
    `, serviceIds);
    return result.rows;
};

// New function to get service UUIDs from service IDs
export const getServiceUuidsByServiceIds = async (serviceIds: string[]): Promise<string[]> => {
    if (serviceIds.length === 0) return [];
    
    const placeholders = serviceIds.map((_, index) => `$${index + 1}`).join(',');
    const result = await pool.query(`
        SELECT id
        FROM services 
        WHERE service_id IN (${placeholders}) AND is_active = true
    `, serviceIds);
    return result.rows.map(row => row.id);
};