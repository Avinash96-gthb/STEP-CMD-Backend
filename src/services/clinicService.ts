import { ClinicDTO } from '../dtos/clinic.dto';
import { toClinicEntity } from '../mappers/clinicMapper';
import { createClinic } from '../repositories/clinicRepository';
import { v4 as uuidv4 } from 'uuid';
import { cacheClinic } from '../utils/cache';
import { toClinicDTO } from '../mappers/clinicMapper';
import { getAllClinics as getAllClinicsFromRepo } from '../repositories/clinicRepository';
export const addClinic = async (dto: ClinicDTO) => {
    const clinicId = uuidv4(); 
    const clinicEntity = toClinicEntity({ ...dto, id: clinicId });
    clinicEntity.id = clinicId;
    await createClinic(clinicEntity);
    await cacheClinic(clinicEntity);
    return clinicEntity;
};

export const getAllClinicsService = async () => {
    const clinics = await getAllClinicsFromRepo();
    return clinics.map(toClinicDTO);
};