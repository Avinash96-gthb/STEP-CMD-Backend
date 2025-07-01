import { addClinic } from '../services/clinicService';
import { getAllClinics } from '../repositories/clinicRepository';
import { CreateClinicRequestDTO } from '../dtos/clinic.dto';
import { getAllServices } from '../repositories/serviceRepository';

describe('Clinic Service', () => {
  it('should add a clinic and retrieve it', async () => {
    // Get available services first
    const services = await getAllServices();
    const serviceIds = services.slice(0, 2).map(s => s.id); // Use first 2 services

    const clinic: CreateClinicRequestDTO = {
      name: 'Test Clinic',
      businessName: 'Test Biz',
      streetAddress: '123 Main St',
      city: 'Test City',
      state: 'TS',
      country: 'Testland',
      zipCode: '12345',
      latitude: 0,
      longitude: 0,
      serviceIds: serviceIds,
      customPrices: {
        [serviceIds[0]]: 80.0
      }
    };

    const created = await addClinic(clinic);
    expect(created.name).toBe('Test Clinic');
    expect(created.clinicId).toMatch(/^CL\d{9}$/);

    const clinics = await getAllClinics();
    expect(clinics.some(c => c.name === 'Test Clinic')).toBe(true);
  });

  it('should retrieve all clinics', async () => {
    const clinics = await getAllClinics();
    expect(Array.isArray(clinics)).toBe(true);
  });

  it('should retrieve all services', async () => {
    const services = await getAllServices();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
  });
});