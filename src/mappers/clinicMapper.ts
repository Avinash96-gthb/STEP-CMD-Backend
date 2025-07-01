import { Clinic, ClinicService } from '../models/clinic';
import { ClinicDTO, CreateClinicRequestDTO, ClinicServiceDTO } from '../dtos/clinic.dto';
import { v4 as uuidv4 } from 'uuid';

export const toClinicEntity = (dto: CreateClinicRequestDTO & { id: string; clinicId: string }): Clinic => ({
    id: dto.id,
    clinicId: dto.clinicId,
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
    services: []
});

export const toClinicDTO = (clinic: Clinic): ClinicDTO => ({
    clinicId: clinic.clinicId,
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
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        serviceCode: service.serviceCode,
        serviceDescription: service.serviceDescription,
        defaultPrice: service.defaultPrice,
        customPrice: service.customPrice,
        isOffered: service.isOffered
    }))
});