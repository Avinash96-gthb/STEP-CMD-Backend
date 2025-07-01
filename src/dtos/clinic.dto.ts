export interface ServiceDTO {
    id?: string; 
    name: string;
    code: string;
    description: string;
    averagePrice: number;
    isActive: boolean;
}

export interface ClinicDTO {
    id?: string;
    name: string;
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    services: ServiceDTO[];
}
