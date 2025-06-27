import { Router } from 'express';
import { createClinic } from '../controllers/clinicController';
import { getAllClinicsHandler } from '../controllers/getAllClinicsController';
import { getAllLogsHandler } from '../controllers/getAllLogsController';

const router = Router();

router.post('/clinic-create', createClinic);
router.get('/clinics', getAllClinicsHandler);
router.get('/logs', getAllLogsHandler);

export default router;
