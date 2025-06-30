import { Request, Response, NextFunction } from 'express';
import { getAllClinics } from '../repositories/clinicRepository';
import { logInfo } from '../utils/logger';
import { toClinicDTO } from '../mappers/clinicMapper';

export const getAllClinicsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinics = await getAllClinics();
        const clientClinc = clinics.map(toClinicDTO)
        logInfo('Clinics retrieved', 'Info', 'Low', 'telehealth-platform', 'getAllClinicsController', 'getAllClinicsHandler');
        res.json(clientClinc);
    } catch (err) {
        next(err);
    }
};
