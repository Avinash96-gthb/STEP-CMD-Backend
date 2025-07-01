import NodeCache from 'node-cache';
import { Clinic } from '../models/clinic';

const clinicCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

const CACHE_KEYS = {
    ALL_CLINICS_COMPLETE: 'complete:all_clinics',
    CITY_COMPLETE: (city: string) => `complete:city:${city.toLowerCase()}`,
    INDIVIDUAL: (id: string) => `clinic:${id}`
};

// SIMPLIFIED - No manual timestamp tracking needed
export const cacheIndividualClinic = (clinic: Clinic) => {
    clinicCache.set(CACHE_KEYS.INDIVIDUAL(clinic.id), clinic);
    console.log(`💾 Cached individual clinic: ${clinic.clinicId}`);
};

export const cacheAllClinicsComplete = (clinics: Clinic[]) => {
    clinicCache.set(CACHE_KEYS.ALL_CLINICS_COMPLETE, clinics);
    
    for (const clinic of clinics) {
        clinicCache.set(CACHE_KEYS.INDIVIDUAL(clinic.id), clinic);
    }
    
    console.log(`💾 Cached COMPLETE dataset: ${clinics.length} clinics`);
};

export const cacheCityComplete = (city: string, clinics: Clinic[]) => {
    const cityKey = CACHE_KEYS.CITY_COMPLETE(city);
    clinicCache.set(cityKey, clinics);
    
    for (const clinic of clinics) {
        clinicCache.set(CACHE_KEYS.INDIVIDUAL(clinic.id), clinic);
    }
    
    console.log(`💾 Cached COMPLETE city dataset for ${city}: ${clinics.length} clinics`);
};

// SIMPLIFIED - NodeCache handles expiration automatically
export const getAllClinicsComplete = (): Clinic[] | null => {
    const clinics = clinicCache.get(CACHE_KEYS.ALL_CLINICS_COMPLETE) as Clinic[];
    if (clinics && clinics.length > 0) {
        console.log(`✅ Found complete all-clinics cache: ${clinics.length} clinics`);
        return clinics;
    }
    
    console.log('❌ Complete all-clinics cache not found or expired');
    return null;
};

export const getCityClinicsComplete = (city: string): Clinic[] | null => {
    const clinics = clinicCache.get(CACHE_KEYS.CITY_COMPLETE(city)) as Clinic[];
    if (clinics && clinics.length > 0) {
        console.log(`✅ Found complete cache for ${city}: ${clinics.length} clinics`);
        return clinics;
    }
    
    console.log(`❌ Complete cache for ${city} not found or expired`);
    return null;
};

export const getIndividualClinic = (id: string): Clinic | null => {
    const clinic = clinicCache.get(CACHE_KEYS.INDIVIDUAL(id)) as Clinic;
    if (clinic) {
        console.log(`✅ Found individual clinic in cache: ${id}`);
        return clinic;
    }
    
    console.log(`❌ Individual clinic not in cache: ${id}`);
    return null;
};

export const clearCache = () => {
    clinicCache.flushAll();
    console.log('🧹 All cache cleared');
};

export const getCacheStats = () => {
    const stats = clinicCache.getStats();
    const allKeys = clinicCache.keys();
    
    return {
        totalKeys: allKeys.length,
        individualClinics: allKeys.filter(k => k.startsWith('clinic:')).length,
        completeCities: allKeys.filter(k => k.startsWith('complete:city:')).length,
        hasCompleteAll: allKeys.includes('complete:all_clinics'),
        cacheHits: stats.hits,
        cacheMisses: stats.misses,
        hitRate: stats.hits > 0 ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2) + '%' : '0%'
    };
};