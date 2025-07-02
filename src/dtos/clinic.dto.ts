export interface ServiceDTO {
    id?: string; 
    serviceId?: string; 
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
    serviceId: string; 
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
    serviceIds: string[]; 
    customPrices?: { [serviceId: string]: number }; 
}