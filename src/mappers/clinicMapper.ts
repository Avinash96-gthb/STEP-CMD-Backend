import { Clinic, Service } from '../models/clinic';
import { ClinicDTO, ServiceDTO } from '../dtos/clinic.dto';
import { v4 as uuidv4 } from 'uuid';

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
    id: dto.id || uuidv4(), // generate if not provided
    name: dto.name,
    code: dto.code,
    description: dto.description,
    averagePrice: dto.averagePrice,
    isActive: dto.isActive,
});

export const toClinicDTO = (clinic: Clinic): ClinicDTO => ({
    // Optionally omit id, dateCreated, etc. if you don't want to expose them
    name: clinic.name,
    businessName: clinic.businessName,
    streetAddress: clinic.streetAddress,
    city: clinic.city,
    state: clinic.state,
    country: clinic.country,
    zipCode: clinic.zipCode,
    latitude: clinic.latitude,
    longitude: clinic.longitude,
    services: clinic.services.map(service => ({
        name: service.name,
        code: service.code,
        description: service.description,
        averagePrice: service.averagePrice,
        isActive: service.isActive,
    })),
});
