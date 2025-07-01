export interface ServiceDTO {
    id?: string; // UUID
    serviceId?: string; // SRV001, SRV002, etc.
    name: string;
    code: string;
    description: string;
    averagePrice: number;
    isActive: boolean;
}

export interface ClinicDTO {
    id?: string;
    clinicId?: string;
    name: string;
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    services: ClinicServiceDTO[];
}

export interface ClinicServiceDTO {
    serviceId: string; // SRV001, SRV002, etc. (not UUID)
    serviceName: string;
    serviceCode: string;
    serviceDescription: string;
    defaultPrice: number;
    customPrice?: number;
    isOffered: boolean;
}

export interface CreateClinicRequestDTO {
    name: string;
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    serviceIds: string[]; // Array of SRV001, SRV002, etc. (not UUIDs)
    customPrices?: { [serviceId: string]: number }; // Keys are SRV001, SRV002, etc.
}