import { Request, Response, NextFunction } from 'express';
import { logInfo } from '../utils/logger';
import { getAllClinicsService } from '../services/clinicService';

export const getAllClinicsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinics = await getAllClinicsService();
        logInfo('Clinics retrieved', 'Info', 'Low', 'telehealth-platform', 'getAllClinicsController', 'getAllClinicsHandler');
        res.json(clinics);
    } catch (err) {
        next(err);
    }
};
