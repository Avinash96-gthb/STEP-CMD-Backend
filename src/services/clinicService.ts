import { CreateClinicRequestDTO, ClinicDTO } from '../dtos/clinic.dto';
import { toClinicEntity, toClinicDTO } from '../mappers/clinicMapper';
import { createClinic, getAllClinics as getAllClinicsFromRepo } from '../repositories/clinicRepository';
import { getServicesByIds } from '../repositories/serviceRepository';
import { v4 as uuidv4 } from 'uuid';
import { cacheClinic } from '../utils/cache';

export const addClinic = async (dto: CreateClinicRequestDTO) => {
    // Validate that all service IDs exist (using SRV001, SRV002, etc.)
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

export const getAllClinicsService = async () => {
    const clinics = await getAllClinicsFromRepo();
    return clinics.map(toClinicDTO);
};