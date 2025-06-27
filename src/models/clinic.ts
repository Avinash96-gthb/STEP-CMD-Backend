export interface Service {
    id: string;
    name: string;
    code: string;
    description: string;
    averagePrice: number;
    isActive: boolean;
}

export interface Clinic {
    id: string;
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
    services: Service[];
}
