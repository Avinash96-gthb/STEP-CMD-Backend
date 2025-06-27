import { Request, Response, NextFunction } from 'express';
import { getAllClinics } from '../repositories/clinicRepository';
import { logInfo } from '../utils/logger';

export const getAllClinicsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinics = await getAllClinics();
        logInfo('Clinics retrieved', 'Info', 'Low', 'telehealth-platform', 'getAllClinicsController', 'getAllClinicsHandler');
        res.json(clinics);
    } catch (err) {
        next(err);
    }
};
