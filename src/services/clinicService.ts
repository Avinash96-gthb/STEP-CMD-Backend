import { CreateClinicRequestDTO, ClinicDTO } from '../dtos/clinic.dto';
import { toClinicEntity, toClinicDTO } from '../mappers/clinicMapper';
import { createClinic, getAllClinics as getAllClinicsFromRepo, getClinicById as getClinicByIdFromRepo, getClinicsByCity as getClinicsByCityFromRepo } from '../repositories/clinicRepository';
import { getServicesByIds } from '../repositories/serviceRepository';
import { v4 as uuidv4 } from 'uuid';
import { 
    cacheIndividualClinic, 
    cacheAllClinicsComplete, 
    cacheCityComplete,
    getAllClinicsComplete, 
    getCityClinicsComplete,
    getIndividualClinic,
    clearCache
} from '../utils/cache';

export const addClinic = async (dto: CreateClinicRequestDTO) => {
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
    
    // STRATEGY: Only cache as individual clinic
    // Don't affect complete datasets since we just added new data
    cacheIndividualClinic(clinicEntity);
    
    // OPTIONAL: Clear complete caches since database has new data
    // This ensures next "get all" will fetch fresh complete data
    console.log('🗑️ Clearing complete caches due to new clinic creation');
    clearCache();
    
    return clinicEntity;
};

// GET ALL CLINICS - Only uses complete cache or fetches all from DB
export const getAllClinicsService = async () => {
    console.log('🔍 getAllClinicsService: Checking complete cache...');
    
    // TRY COMPLETE CACHE FIRST
    const cachedClinics = getAllClinicsComplete();
    if (cachedClinics) {
        console.log('📦 SUCCESS: Returning ALL clinics from complete cache');
        return cachedClinics.map(toClinicDTO);
    }
    
    // CACHE MISS OR EXPIRED - FETCH ALL FROM DATABASE
    console.log('🔍 CACHE MISS: Fetching ALL clinics from database');
    const clinics = await getAllClinicsFromRepo();
    
    // CACHE THE COMPLETE DATASET
    cacheAllClinicsComplete(clinics);
    console.log(`✅ Cached complete dataset: ${clinics.length} clinics`);
    
    return clinics.map(toClinicDTO);
};

// GET CLINICS BY CITY - Only uses complete city cache or fetches all for that city
export const getClinicsByCityService = async (city: string) => {
    console.log(`🔍 getClinicsByCityService: Checking complete cache for ${city}...`);
    
    // TRY COMPLETE CITY CACHE FIRST
    const cachedClinics = getCityClinicsComplete(city);
    if (cachedClinics) {
        console.log(`📦 SUCCESS: Returning ALL ${city} clinics from complete cache`);
        return cachedClinics.map(toClinicDTO);
    }
    
    // CACHE MISS OR EXPIRED - FETCH ALL FROM DATABASE FOR THIS CITY
    console.log(`🔍 CACHE MISS: Fetching ALL ${city} clinics from database`);
    const clinics = await getClinicsByCityFromRepo(city);
    
    // CACHE THE COMPLETE CITY DATASET
    cacheCityComplete(city, clinics);
    console.log(`✅ Cached complete city dataset for ${city}: ${clinics.length} clinics`);
    
    return clinics.map(toClinicDTO);
};

// GET SINGLE CLINIC - Uses individual cache
export const getClinicByIdService = async (id: string) => {
    console.log(`🔍 getClinicByIdService: Checking individual cache for ${id}...`);
    
    // TRY INDIVIDUAL CACHE FIRST
    const cachedClinic = getIndividualClinic(id);
    if (cachedClinic) {
        console.log(`📦 SUCCESS: Returning clinic ${id} from individual cache`);
        return toClinicDTO(cachedClinic);
    }
    
    // CACHE MISS - FETCH FROM DATABASE
    console.log(`🔍 CACHE MISS: Fetching clinic ${id} from database`);
    const clinic = await getClinicByIdFromRepo(id);
    if (clinic) {
        // CACHE AS INDIVIDUAL
        cacheIndividualClinic(clinic);
        console.log(`✅ Cached individual clinic: ${id}`);
        return toClinicDTO(clinic);
    }
    
    console.log(`❌ Clinic not found: ${id}`);
    return null;
};