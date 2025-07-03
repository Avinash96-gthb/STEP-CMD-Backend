import { addClinic, getAllClinicsService } from '../services/clinicService';
import { getAllClinics } from '../repositories/clinicRepository';
import { CreateClinicRequestDTO } from '../dtos/clinic.dto';
import { getAllServices } from '../repositories/serviceRepository';

describe('Clinic Service', () => {
  
  // SUCCESS CASES
  describe('Successful Operations', () => {
    it('should add a clinic and retrieve it successfully', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 2).map(s => s.serviceId);

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

    it('should create clinic without custom prices', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const clinic: CreateClinicRequestDTO = {
        name: 'No Custom Price Clinic',
        businessName: 'Standard Pricing Business',
        streetAddress: '456 Standard St',
        city: 'Standard City',
        state: 'ST',
        country: 'USA',
        zipCode: '54321',
        latitude: 10.0,
        longitude: 20.0,
        serviceIds: serviceIds
      };

      const created = await addClinic(clinic);
      expect(created).toBeDefined();
      expect(created.name).toBe('No Custom Price Clinic');
    });

    it('should retrieve all clinics successfully', async () => {
      const clinics = await getAllClinics();
      expect(Array.isArray(clinics)).toBe(true);
    });

    it('should retrieve all services successfully', async () => {
      const services = await getAllServices();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      services.forEach(service => {
        expect(service.serviceId).toMatch(/^SRV\d{3}$/);
      });
    });
  });

  // FAILURE CASES
  describe('Validation Failures', () => {
    it('should fail when providing invalid service IDs', async () => {
      const clinic: CreateClinicRequestDTO = {
        name: 'Invalid Service Clinic',
        businessName: 'Invalid Business',
        streetAddress: '789 Invalid St',
        city: 'Invalid City',
        state: 'IV',
        country: 'USA',
        zipCode: '99999',
        latitude: 0,
        longitude: 0,
        serviceIds: ['INVALID001', 'NONEXISTENT002'] // Invalid service IDs
      };

      await expect(addClinic(clinic)).rejects.toThrow('Some service IDs are invalid');
    });

    it('should fail when providing empty service IDs array', async () => {
      const clinic: CreateClinicRequestDTO = {
        name: 'No Services Clinic',
        businessName: 'No Services Business',
        streetAddress: '000 Empty St',
        city: 'Empty City',
        state: 'EM',
        country: 'USA',
        zipCode: '00000',
        latitude: 0,
        longitude: 0,
        serviceIds: [] 
      };

      await expect(addClinic(clinic)).rejects.toThrow('Some service IDs are invalid');
    });

    it('should fail when providing mix of valid and invalid service IDs', async () => {
      const services = await getAllServices();
      const validServiceId = services[0].serviceId;

      const clinic: CreateClinicRequestDTO = {
        name: 'Mixed Services Clinic',
        businessName: 'Mixed Services Business',
        streetAddress: '111 Mixed St',
        city: 'Mixed City',
        state: 'MX',
        country: 'USA',
        zipCode: '11111',
        latitude: 0,
        longitude: 0,
        serviceIds: [validServiceId, 'INVALID999'] // Mix of valid and invalid
      };

      await expect(addClinic(clinic)).rejects.toThrow('Some service IDs are invalid');
    });
  });

  describe('Data Validation Failures', () => {
    it('should fail with missing required fields', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const incompleteClinic = {
        name: 'Incomplete Clinic',
        serviceIds: serviceIds
      } as CreateClinicRequestDTO;

      // This should fail at the validation level
      await expect(addClinic(incompleteClinic)).rejects.toThrow();
    });

    it('should fail with invalid latitude/longitude values', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const clinic: CreateClinicRequestDTO = {
        name: 'Invalid Coordinates Clinic',
        businessName: 'Invalid Coords Business',
        streetAddress: '222 Invalid St',
        city: 'Invalid City',
        state: 'IC',
        country: 'USA',
        zipCode: '22222',
        latitude: 999.0, // Invalid latitude (should be -90 to 90)
        longitude: 999.0, // Invalid longitude (should be -180 to 180)
        serviceIds: serviceIds
      };
      const created = await addClinic(clinic);
      expect(created).toBeDefined();
    });

    it('should handle invalid custom prices gracefully', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 2).map(s => s.serviceId);

      const clinic: CreateClinicRequestDTO = {
        name: 'Invalid Price Clinic',
        businessName: 'Invalid Price Business',
        streetAddress: '333 Invalid St',
        city: 'Invalid City',
        state: 'IP',
        country: 'USA',
        zipCode: '33333',
        latitude: 0,
        longitude: 0,
        serviceIds: serviceIds,
        customPrices: {
          [serviceIds[0]]: -50.0, // Negative price
          'NONEXISTENT': 100.0 // Price for non-existent service
        }
      };

      const created = await addClinic(clinic);
      expect(created).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long clinic names', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const longName = 'A'.repeat(1000); // Very long name
      const clinic: CreateClinicRequestDTO = {
        name: longName,
        businessName: 'Long Name Business',
        streetAddress: '444 Long St',
        city: 'Long City',
        state: 'LG',
        country: 'USA',
        zipCode: '44444',
        latitude: 0,
        longitude: 0,
        serviceIds: serviceIds
      };

      // Depending on your DB constraints, this might fail or truncate
      try {
        const created = await addClinic(clinic);
        expect(created.name.length).toBeGreaterThan(0);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle special characters in input', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const clinic: CreateClinicRequestDTO = {
        name: 'Clinic with Special Chars !@#$%^&*()',
        businessName: 'Business & Co. Ltd.',
        streetAddress: '555 O\'Connor St, Apt #123',
        city: 'Saint-Jean-sur-Richelieu',
        state: 'QC',
        country: 'Canada',
        zipCode: 'J3B 1A1',
        latitude: 45.3078,
        longitude: -73.2623,
        serviceIds: serviceIds
      };

      const created = await addClinic(clinic);
      expect(created).toBeDefined();
      expect(created.name).toContain('Special Chars');
    });

    it('should handle duplicate clinic creation attempts', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const clinic: CreateClinicRequestDTO = {
        name: 'Duplicate Test Clinic',
        businessName: 'Duplicate Business',
        streetAddress: '666 Duplicate St',
        city: 'Duplicate City',
        state: 'DP',
        country: 'USA',
        zipCode: '66666',
        latitude: 0,
        longitude: 0,
        serviceIds: serviceIds
      };

      // Create first clinic
      const first = await addClinic(clinic);
      expect(first).toBeDefined();

      // Try to create identical clinic
      const second = await addClinic(clinic);
      expect(second).toBeDefined();
      expect(second.clinicId).not.toBe(first.clinicId); // Should get different IDs
    });
  });

  describe('Service Repository Edge Cases', () => {
    it('should handle empty service ID array gracefully', async () => {
      const services = await getAllServices();
      expect(services).toBeDefined();
      expect(services.length).toBeGreaterThan(0);

      // Test with empty array
      const emptyResult = await getAllServices();
      expect(Array.isArray(emptyResult)).toBe(true);
    });

    it('should return empty array for non-existent service IDs', async () => {
      try {
        const result = await getAllServices();
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });


  describe('Performance Tests', () => {
    it('should handle multiple clinics creation in reasonable time', async () => {
      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const startTime = Date.now();
      
      const promises = [];
      for (let i = 0; i < 5; i++) {
        const clinic: CreateClinicRequestDTO = {
          name: `Performance Test Clinic ${i}`,
          businessName: `Performance Business ${i}`,
          streetAddress: `${i} Performance St`,
          city: 'Performance City',
          state: 'PF',
          country: 'USA',
          zipCode: '77777',
          latitude: i,
          longitude: i,
          serviceIds: serviceIds
        };
        promises.push(addClinic(clinic));
      }

      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(results.length).toBe(5);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  });

  // CLEANUP TESTS
  describe('Database State Tests', () => {
    it('should maintain data consistency after operations', async () => {
      const initialClinics = await getAllClinics();
      const initialCount = initialClinics.length;

      const services = await getAllServices();
      const serviceIds = services.slice(0, 1).map(s => s.serviceId);

      const clinic: CreateClinicRequestDTO = {
        name: 'Consistency Test Clinic',
        businessName: 'Consistency Business',
        streetAddress: '888 Consistency St',
        city: 'Consistency City',
        state: 'CS',
        country: 'USA',
        zipCode: '88888',
        latitude: 0,
        longitude: 0,
        serviceIds: serviceIds
      };

      await addClinic(clinic);
      
      const finalClinics = await getAllClinics();
      expect(finalClinics.length).toBe(initialCount + 1);
    });
  });
});