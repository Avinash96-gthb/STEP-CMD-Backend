export interface Service {
    id: string; // UUID
    serviceId: string; // SRV001, SRV002, etc.
    name: string;
    code: string;
    description: string;
    averagePrice: number;
    isActive: boolean;
}

export interface Clinic {
    id: string;
    clinicId: string;
    name: string;
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    dateCreated: Date;
    services: ClinicService[];
}

export interface ClinicService {
    serviceId: string; // SRV001, SRV002, etc. (not UUID)
    serviceName: string;
    serviceCode: string;
    serviceDescription: string;
    defaultPrice: number;
    customPrice?: number;
    isOffered: boolean;
}