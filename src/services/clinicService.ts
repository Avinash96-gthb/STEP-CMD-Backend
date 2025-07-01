import { CreateClinicRequestDTO, ClinicDTO } from '../dtos/clinic.dto';
import { toClinicEntity, toClinicDTO } from '../mappers/clinicMapper';
import { createClinic, getAllClinics as getAllClinicsFromRepo, getClinicById as getClinicByIdFromRepo, getClinicsByCity as getClinicsByCityFromRepo } from '../repositories/clinicRepository';
import { getServicesByIds } from '../repositories/serviceRepository';
import { v4 as uuidv4 } from 'uuid';
import { cacheClinic, getAllClinicsFromCache, getClinicById, getClinicsByCity } from '../utils/cache';

export const addClinic = async (dto: CreateClinicRequestDTO) => {
    // Validate that all service IDs exist (using SRV001, SRV002, etc.)
    if (!dto.serviceIds || dto.serviceIds.length === 0) {
        throw new Error('Some service IDs are invalid');
    }

    const services = await getServicesByIds(dto.serviceIds);
    if (services.length !== dto.serviceIds.length) {
        throw new Error('Some service IDs are invalid');
    }

    const clinicUuid = uuidv4();
    const clinicId = `CL${new Date().getFullYear()}${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`;
    
    const clinicEntity = toClinicEntity({ 
        ...dto, 
        id: clinicUuid, 
        clinicId: clinicId 
    });

    await createClinic(clinicEntity, dto.serviceIds, dto.customPrices);
    await cacheClinic(clinicEntity);
    
    return clinicEntity;
};

// Updated to use cache-first strategy
export const getAllClinicsService = async () => {
    // Try cache first
    const cachedClinics = getAllClinicsFromCache();
    if (cachedClinics.length > 0) {
        console.log('📦 Returning clinics from cache');
        return cachedClinics.map(toClinicDTO);
    }
    
    // Fallback to database
    console.log('🔍 Cache miss - fetching from database');
    const clinics = await getAllClinicsFromRepo();
    
    // Cache the results
    for (const clinic of clinics) {
        await cacheClinic(clinic);
    }
    
    return clinics.map(toClinicDTO);
};

// New function to get clinics by city with caching
export const getClinicsByCityService = async (city: string) => {
    // Try cache first
    const cachedClinics = getClinicsByCity(city);
    if (cachedClinics.length > 0) {
        console.log(`📦 Returning clinics for ${city} from cache`);
        return cachedClinics.map(toClinicDTO);
    }
    
    // Fallback to database
    console.log(`🔍 Cache miss for ${city} - fetching from database`);
    const clinics = await getClinicsByCityFromRepo(city);
    
    // Cache the results
    for (const clinic of clinics) {
        await cacheClinic(clinic);
    }
    
    return clinics.map(toClinicDTO);
};

// New function to get single clinic by ID
export const getClinicByIdService = async (id: string) => {
    // Try cache first
    const cachedClinic = getClinicById(id);
    if (cachedClinic) {
        console.log(`📦 Returning clinic ${id} from cache`);
        return toClinicDTO(cachedClinic);
    }
    
    // Fallback to database
    console.log(`🔍 Cache miss for clinic ${id} - fetching from database`);
    const clinic = await getClinicByIdFromRepo(id);
    if (clinic) {
        await cacheClinic(clinic);
        return toClinicDTO(clinic);
    }
    
    return null;
};