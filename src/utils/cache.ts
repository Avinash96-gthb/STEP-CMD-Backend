import NodeCache from 'node-cache';
import { Clinic } from '../models/clinic';

const clinicCache = new NodeCache({ stdTTL: 3600 });

export const cacheClinic = async (clinic: Clinic) => {
    clinicCache.set(clinic.city, clinic);
};

export const getClinicsByCity = (city: string): Clinic[] => {
    return clinicCache.get(city) ? [clinicCache.get(city) as Clinic] : [];
};
