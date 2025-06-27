import { Clinic, Service } from '../models/clinic';
import { ClinicDTO, ServiceDTO } from '../dtos/clinic.dto';

export const toClinicEntity = (dto: ClinicDTO): Clinic => ({
    id: dto.id || '',
    name: dto.name,
    businessName: dto.businessName,
    streetAddress: dto.streetAddress,
    city: dto.city,
    state: dto.state,
    country: dto.country,
    zipCode: dto.zipCode,
    latitude: dto.latitude,
    longitude: dto.longitude,
    dateCreated: new Date(),
    services: dto.services.map(toServiceEntity),
});

export const toServiceEntity = (dto: ServiceDTO): Service => ({
    id: dto.id,
    name: dto.name,
    code: dto.code,
    description: dto.description,
    averagePrice: dto.averagePrice,
    isActive: dto.isActive,
});
