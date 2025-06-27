export interface ClinicDto {
    clinicId: string;
    clinicName: string;
    businessName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    dateCreated: Date;
    servicesOffered: ServiceDto[];
}

export interface ServiceDto {
    serviceId: string;
    serviceName: string;
    description: string;
}