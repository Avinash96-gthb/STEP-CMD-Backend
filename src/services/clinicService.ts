import { ClinicDTO } from '../dtos/clinic.dto';
import { toClinicEntity } from '../mappers/clinicMapper';
import { createClinic } from '../repositories/clinicRepository';
import { v4 as uuidv4 } from 'uuid';
import { cacheClinic } from '../utils/cache';

export const addClinic = async (dto: ClinicDTO) => {
    const clinicId = uuidv4(); // Use a real UUID
    const clinicEntity = toClinicEntity({ ...dto, id: clinicId });
    clinicEntity.id = clinicId;
    await createClinic(clinicEntity);
    await cacheClinic(clinicEntity);
    return clinicEntity;
};
