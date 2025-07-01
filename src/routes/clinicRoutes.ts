import { Router } from 'express';
import { createClinic } from '../controllers/clinicController';
import { getAllClinicsHandler } from '../controllers/getAllClinicsController';
import { getAllLogsHandler } from '../controllers/getAllLogsController';
import { getAllServicesHandler } from '../controllers/serviceController';
import { getClinicsByCityHandler, getClinicByIdHandler } from '../controllers/clinicCacheController'; // New cached endpoints

const router = Router();

router.post('/clinic-create', createClinic);
router.get('/clinics', getAllClinicsHandler);
router.get('/clinics/city/:city', getClinicsByCityHandler); // New cached endpoint
router.get('/clinics/:id', getClinicByIdHandler); // New cached endpoint
router.get('/logs', getAllLogsHandler);
router.get('/services', getAllServicesHandler);

export default router;