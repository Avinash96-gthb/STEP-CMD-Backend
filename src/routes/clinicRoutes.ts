import { Router } from 'express';
import { createClinic } from '../controllers/clinicController';
import { getAllClinicsHandler } from '../controllers/getAllClinicsController';

const router = Router();

router.post('/clinics', createClinic);
router.get('/clinics', getAllClinicsHandler);

export default router;
