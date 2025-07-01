import NodeCache from 'node-cache';
import { Clinic } from '../models/clinic';

const clinicCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

// Cache individual clinics by ID
export const cacheClinic = async (clinic: Clinic) => {
    clinicCache.set(`clinic:${clinic.id}`, clinic);
    
    // Also cache by city (array of clinics)
    const cityKey = `city:${clinic.city.toLowerCase()}`;
    const existingClinics = clinicCache.get(cityKey) as Clinic[] || [];
    const updatedClinics = [...existingClinics.filter(c => c.id !== clinic.id), clinic];
    clinicCache.set(cityKey, updatedClinics);
    
    // Cache all clinics
    const allClinics = clinicCache.get('all_clinics') as Clinic[] || [];
    const updatedAllClinics = [...allClinics.filter(c => c.id !== clinic.id), clinic];
    clinicCache.set('all_clinics', updatedAllClinics);
};

export const getClinicById = (id: string): Clinic | null => {
    return clinicCache.get(`clinic:${id}`) || null;
};

export const getClinicsByCity = (city: string): Clinic[] => {
    return clinicCache.get(`city:${city.toLowerCase()}`) || [];
};

export const getAllClinicsFromCache = (): Clinic[] => {
    return clinicCache.get('all_clinics') || [];
};

export const clearCache = () => {
    clinicCache.flushAll();
};