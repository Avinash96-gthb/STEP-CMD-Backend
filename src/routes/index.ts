import { Router } from 'express';
import clinicRoutes from './clinicRoutes';

const router = Router();

router.use('/api', clinicRoutes);

export default router;