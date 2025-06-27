import { addClinic } from '../services/clinicService';
import { getAllClinics } from '../repositories/clinicRepository';
import { ClinicDTO } from '../dtos/clinic.dto';
import { v4 as uuidv4 } from 'uuid';

describe('Clinic Service', () => {
  it('should add a clinic and retrieve it', async () => {
    const clinic: ClinicDTO = {
        id: uuidv4(),
      name: 'Test Clinic',
      businessName: 'Test Biz',
      streetAddress: '123 Main St',
      city: 'Test City',
      state: 'TS',
      country: 'Testland',
      zipCode: '12345',
      latitude: 0,
      longitude: 0,
      services: [
        {
          id: uuidv4(),
          name: 'Consultation',
          code: 'CONSULT',
          description: 'General consultation',
          averagePrice: 100,
          isActive: true
        }
      ]
    };
    const created = await addClinic(clinic);
    expect(created.name).toBe('Test Clinic');
    const clinics = await getAllClinics();
    expect(clinics.some(c => c.name === 'Test Clinic')).toBe(true);
  });

  it('should retrieve all clinics', async () => {
    const clinics = await getAllClinics();
    expect(Array.isArray(clinics)).toBe(true);
    // Optionally check for at least one clinic
    // expect(clinics.length).toBeGreaterThan(0);
  });
});
